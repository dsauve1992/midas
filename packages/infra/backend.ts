import * as aws from "@pulumi/aws";

const appName = "midas-backend"

// Créer une application Elastic Beanstalk
const app = new aws.elasticbeanstalk.Application(appName, {});

// Créer une solution Stack pour Node.js
const solutionStackName = "64bit Amazon Linux 2018.03 v4.14.1 running Node.js";

// Créer un environnement Elastic Beanstalk
const env = new aws.elasticbeanstalk.Environment(`${appName}-env`, {
    application: app.name,
    solutionStackName: solutionStackName
});

export const applicationName = app.name;
export const environmentName = env.name;