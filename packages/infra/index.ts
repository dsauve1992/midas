import {bucketName, cdnURL} from './frontend'
import {publicHostName, ec2PrivateKey} from './backend'
import {addGithubVariables} from "./github";

addGithubVariables({
    FRONTEND_STORAGE_S3_BUCKET_NAME: bucketName,
    EC2_HOST: publicHostName,
    SSH_PRIVATE_KEY: ec2PrivateKey
})

export const AppURL = cdnURL
export const BackendUrl = publicHostName