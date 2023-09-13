import * as fs from "fs";

const pulumi = require("@pulumi/pulumi");
const aws = require("@pulumi/aws");

const config = new pulumi.Config();
// A path to the EC2 keypair's public key:
const publicKeyPath = config.require("publicKeyPath");
// A path to the EC2 keypair's private key:
const privateKeyPath = config.require("privateKeyPath");
// The WordPress database size:

const defaultVpc = new aws.ec2.DefaultVpc("defaultVPC");

const defaultAz1 = new aws.ec2.DefaultSubnet("defaultAz1", {availabilityZone: "ca-central-1a"});

// Read in the public key for easy use below.
const publicKey = fs.readFileSync(publicKeyPath).toString();
// Read in the private key for easy use below (and to ensure it's marked a secret!)
const privateKey = pulumi.secret(fs.readFileSync(privateKeyPath).toString());


// Find the latest Amazon Linux 2 AMI.
const ami = pulumi.output(aws.ec2.getAmi({
    owners: [ "amazon" ],
    mostRecent: true,
    filters: [
        { name: "description", values: [ "Amazon Linux 2 *" ] },
    ],
}));

const ec2AllowRule = new aws.ec2.SecurityGroup("ec2-allow-rule", {
    vpcId: defaultVpc.id,
    ingress: [
        {
            description: "HTTPS",
            fromPort: 443,
            toPort: 443,
            protocol: "tcp",
            cidrBlocks: ["0.0.0.0/0"],
        },
        {
            description: "HTTP",
            fromPort: 80,
            toPort: 80,
            protocol: "tcp",
            cidrBlocks: ["0.0.0.0/0"],
        },
        {
            description: "SSH",
            fromPort: 22,
            toPort: 22,
            protocol: "tcp",
            cidrBlocks: ["0.0.0.0/0"],
        },
    ],
    egress: [{
        fromPort: 0,
        toPort: 0,
        protocol: "-1",
        cidrBlocks: ["0.0.0.0/0"],
    }],
    tags: {
        Name: "allow ssh,http,https",
    },
});

const wordpressKeypair = new aws.ec2.KeyPair("wordpress-keypair", {publicKey: publicKey});


// Create and launch an Amazon Linux EC2 instance into the public subnet.
const instance = new aws.ec2.Instance("instance", {
    ami: ami.id,
    instanceType: "t3.nano",
    subnetId: defaultAz1.id,
    keyName: wordpressKeypair.id,
    vpcSecurityGroupIds: [
        ec2AllowRule.id,
    ]
});

// Export the instance's publicly accessible URL.
export const instanceURL = pulumi.interpolate `http://${instance.publicIp}`
