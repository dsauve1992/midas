import * as aws from "@pulumi/aws";
import * as pulumi from "@pulumi/pulumi";


// Get the config ready to go.
const config = new pulumi.Config();

// If keyName is provided, an existing KeyPair is used, else if publicKey is provided a new KeyPair
// derived from the publicKey is created.
let keyName: pulumi.Input<string> | undefined = config.get("keyName");
const publicKey = config.get("publicKey");

// The privateKey associated with the selected key must be provided (either directly or base64 encoded).
const privateKey = config.requireSecret("privateKey").apply(key => {
    if (key.startsWith("-----BEGIN RSA PRIVATE KEY-----")) {
        return key;
    } else {
        return Buffer.from(key, "base64").toString("ascii");
    }
});

// Create a new security group that permits SSH and web access.
const securityGroup = new aws.ec2.SecurityGroup("ec2-security-group", {
    ingress: [
        { protocol: "tcp", fromPort: 22, toPort: 22, cidrBlocks: ["0.0.0.0/0"] },
        { protocol: "tcp", fromPort: 80, toPort: 80, cidrBlocks: ["0.0.0.0/0"] },
        { protocol: "tcp", fromPort: 443, toPort: 443, cidrBlocks: ["0.0.0.0/0"] },
    ],
    egress: [
        { protocol: "-1", fromPort: 0, toPort: 0, cidrBlocks: ["0.0.0.0/0"] }
    ]
});

// Get the AMI
const amiId = aws.ec2.getAmi({
    owners: ["amazon"],
    mostRecent: true,
    filters: [{
        name: "name",
        values: ["amzn2-ami-hvm-*-x86_64-gp2"],
    }],
}, { async: true }).then(ami => ami.id);

// Create an EC2 server that we'll then provision stuff onto.
const size = "t2.micro";
if (!keyName) {
    if (!publicKey) {
        throw new Error("must provide one of `keyName` or `publicKey`");
    }
    const key = new aws.ec2.KeyPair("key", { publicKey });
    keyName = key.keyName;
}

const defaultVpc = pulumi.output(aws.ec2.getVpc({
    default: true,
}));

// Récupérer les sous-réseaux publics du VPC par défaut
const defaultVpcSubnets = defaultVpc.apply(vpc => aws.ec2.getSubnetIds({ vpcId: vpc.id }));



const userData =
`#!/bin/bash
yum update -y
amazon-linux-extras install docker
service docker start
usermod -a -G docker ec2-user
chkconfig docker on`

const server = new aws.ec2.Instance("midas-backend", {
    instanceType: size,
    ami: amiId,
    associatePublicIpAddress: true,
    subnetId: defaultVpcSubnets.apply(subnets => subnets.ids[0]),
    keyName: keyName,
    vpcSecurityGroupIds: [securityGroup.id],
    userData
});


export const ec2PrivateKey = privateKey
export const publicHostName = server.publicDns;