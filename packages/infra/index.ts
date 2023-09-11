import {bucketName, cdnURL} from './frontend'
import {addGithubVariables} from "./github";

addGithubVariables({FRONTEND_STORAGE_S3_BUCKET_NAME: bucketName})

export const AppURL = cdnURL