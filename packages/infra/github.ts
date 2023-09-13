import * as github from "@pulumi/github";
import {Output} from "@pulumi/pulumi";

type GithubVariable = {
    FRONTEND_STORAGE_S3_BUCKET_NAME: Output<string>
}

export const addGithubVariables = ({FRONTEND_STORAGE_S3_BUCKET_NAME}: GithubVariable) => {
    new github.ActionsVariable("FRONTEND_STORAGE_S3_BUCKET_NAME", {
        value: FRONTEND_STORAGE_S3_BUCKET_NAME.apply(v => v),
        repository: "midas",
        variableName: "FRONTEND_STORAGE_S3_BUCKET_NAME"
    });
}