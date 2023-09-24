import {bucketName, cdnURL} from './frontend'
import {publicHostName, ec2PrivateKey} from './backend'
import {addGithubVariables} from "./github";
import * as pulumi from "@pulumi/pulumi";

const config = new pulumi.Config();

const fmpPrivateKey = config.requireSecret("fmpkey")


addGithubVariables({
    FRONTEND_STORAGE_S3_BUCKET_NAME: bucketName,
    EC2_HOST: publicHostName,
    SSH_PRIVATE_KEY: ec2PrivateKey,
    FMP_PRIVATE_KEY: fmpPrivateKey
})

export const AppURL = cdnURL
export const BackendUrl = publicHostName