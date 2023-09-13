import * as aws from "@pulumi/aws";
import {Output} from "@pulumi/pulumi";

const appName = "midas-backend"

// Créer une application Elastic Beanstalk
const app = new aws.elasticbeanstalk.Application(appName, {});

// Créer une solution Stack pour Node.js
const solutionStackName = "64bit Amazon Linux 2023 v6.0.0 running Node.js 18";

const midas_backend_prod = new aws.elasticbeanstalk.Environment("midas-backend-prod", {
    application: "midas-backend",
    name: "midas-backend-env",
    solutionStackName: "64bit Amazon Linux 2023 v6.0.0 running Node.js 18",
}, {
    protect: true,
});


export const applicationName = Output.create(appName);
export const environmentName = midas_backend_prod.name;