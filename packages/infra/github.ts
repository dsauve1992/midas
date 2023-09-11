import * as github from "@pulumi/github";
import {Output} from "@pulumi/pulumi";

type GithubVariable = {
    FRONTEND_STORAGE_S3_BUCKET_NAME: Output<string>
    BACKEND_APPLICATION_NAME: Output<string>
    BACKEND_ENVIRONMENT_NAME: Output<string>
}

export const addGithubVariables = ({FRONTEND_STORAGE_S3_BUCKET_NAME, BACKEND_ENVIRONMENT_NAME, BACKEND_APPLICATION_NAME}: GithubVariable) => {
    new github.ActionsVariable("FRONTEND_STORAGE_S3_BUCKET_NAME", {
        value: FRONTEND_STORAGE_S3_BUCKET_NAME.apply(v => v),
        repository: "midas",
        variableName: "FRONTEND_STORAGE_S3_BUCKET_NAME"
    });

    new github.ActionsVariable("BACKEND_ENVIRONMENT_NAME", {
        value: BACKEND_ENVIRONMENT_NAME.apply(v => v),
        repository: "midas",
        variableName: "BACKEND_ENVIRONMENT_NAME"
    });

    new github.ActionsVariable("BACKEND_APPLICATION_NAME", {
        value: BACKEND_APPLICATION_NAME.apply(v => v),
        repository: "midas",
        variableName: "BACKEND_APPLICATION_NAME"
    });
}