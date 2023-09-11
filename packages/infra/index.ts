import {bucketName, cdnURL} from './frontend'
import {environmentName, applicationName} from './backend'
import {addGithubVariables} from "./github";

addGithubVariables({
    FRONTEND_STORAGE_S3_BUCKET_NAME: bucketName,
    BACKEND_APPLICATION_NAME: applicationName,
    BACKEND_ENVIRONMENT_NAME: environmentName
})

export const AppURL = cdnURL