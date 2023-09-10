import * as github from "@pulumi/github";
import {Output} from "@pulumi/pulumi";

type GithubVariable = {
    FRONTEND_STORAGE_S3_BUCKET_NAME: Output<string>
}

type GithubSecrets = {
    AWS_ACCESS_KEY_ID: Output<string>
    AWS_SECRET_ACCESS_KEY: Output<string>
    AWS_REGION: Output<string>
}

export const addGithubVariables = ({FRONTEND_STORAGE_S3_BUCKET_NAME}: GithubVariable) => {
    const frontendStorageS3BucketName = new github.ActionsVariable("FRONTEND_STORAGE_S3_BUCKET_NAME", {
        value: FRONTEND_STORAGE_S3_BUCKET_NAME.apply(v => v),
        repository: "midas",
        variableName: "FRONTEND_STORAGE_S3_BUCKET_NAME"
    });
}