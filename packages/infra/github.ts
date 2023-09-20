import * as github from "@pulumi/github";
import {Output} from "@pulumi/pulumi";

type GithubVariable = {
    FRONTEND_STORAGE_S3_BUCKET_NAME: Output<string>
    EC2_HOST: Output<string>
    SSH_PRIVATE_KEY: Output<string>
}

export const addGithubVariables = ({FRONTEND_STORAGE_S3_BUCKET_NAME, EC2_HOST, SSH_PRIVATE_KEY}: GithubVariable) => {
    new github.ActionsVariable("FRONTEND_STORAGE_S3_BUCKET_NAME", {
        value: FRONTEND_STORAGE_S3_BUCKET_NAME.apply(v => v),
        repository: "midas",
        variableName: "FRONTEND_STORAGE_S3_BUCKET_NAME"
    });

    new github.ActionsSecret("SSH_PRIVATE_KEY", {
        plaintextValue: SSH_PRIVATE_KEY.apply(v => v),
        repository: "midas",
        secretName: "SSH_PRIVATE_KEY"
    });

    new github.ActionsSecret("EC2_HOST", {
        plaintextValue: EC2_HOST.apply(v => v),
        repository: "midas",
        secretName: "EC2_HOST"
    });
}