import { bucketName, cdnURL } from "./frontend";
import { dbRegion, dbUrl, ec2PrivateKey, publicHostName } from "./backend";
import { addGithubVariables } from "./github";
import * as pulumi from "@pulumi/pulumi";

const config = new pulumi.Config();

const fmpPrivateKey = config.requireSecret("fmpkey");
const sentryDsn = config.requireSecret("sentryDsn");

addGithubVariables({
  FRONTEND_STORAGE_S3_BUCKET_NAME: bucketName,
  EC2_HOST: publicHostName,
  SSH_PRIVATE_KEY: ec2PrivateKey,
  FMP_PRIVATE_KEY: fmpPrivateKey,
  DYNAMO_DB_URL: dbUrl,
  DYNAMO_DB_REGION: dbRegion,
  SENTRY_DSN: sentryDsn,
});

export const AppURL = cdnURL;
export const BackendUrl = publicHostName;
