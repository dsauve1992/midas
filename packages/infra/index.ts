import {bucketName, cdnURL} from './frontend'
import {applicationName, environmentName} from './backend'
import {addGithubVariables} from "./github";

addGithubVariables({
    FRONTEND_STORAGE_S3_BUCKET_NAME: bucketName,
    BACKEND_ENVIRONMENT_NAME: environmentName,
    BACKEND_APPLICATION_NAME: applicationName
})

export const AppURL = cdnURL