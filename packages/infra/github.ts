import * as github from "@pulumi/github";
import {Output} from "@pulumi/pulumi";

type GithubVariable = {
    FRONTEND_STORAGE_S3_BUCKET_NAME: Output<string>
    EC2_HOST: Output<string>
    SSH_PRIVATE_KEY: Output<string>
    FMP_PRIVATE_KEY: Output<string>
    DYNAMO_DB_URL: Output<string>
    DYNAMO_DB_REGION: Output<string>
}

export const addGithubVariables = ({FRONTEND_STORAGE_S3_BUCKET_NAME, EC2_HOST, SSH_PRIVATE_KEY, FMP_PRIVATE_KEY, DYNAMO_DB_URL, DYNAMO_DB_REGION}: GithubVariable) => {
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

    new github.ActionsSecret("FMP_PRIVATE_KEY", {
        plaintextValue: FMP_PRIVATE_KEY.apply(v => v),
        repository: "midas",
        secretName: "FMP_PRIVATE_KEY"
    });

    new github.ActionsSecret("DYNAMO_DB_URL", {
        plaintextValue: DYNAMO_DB_URL.apply(v => v),
        repository: "midas",
        secretName: "DYNAMO_DB_URL"
    });
    new github.ActionsSecret("DYNAMO_DB_REGION", {
        plaintextValue: DYNAMO_DB_REGION.apply(v => v),
        repository: "midas",
        secretName: "DYNAMO_DB_REGION"
    });
}