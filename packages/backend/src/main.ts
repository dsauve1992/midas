// Import this first!
import './instrument';

import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as fs from 'fs';
import { ExpressAdapter } from '@nestjs/platform-express';
import * as http from 'http';
import * as https from 'https';
import * as express from 'express';
import { SentryFilter } from './modules/monitoring/sentry.exception-filter';

async function bootstrap() {
  const httpsOptions = {
    // FIXME, les certificats ne devraient pas se trouver dans le code source
    //  Ils devraient être emis par une authorité reconnu
    key: fs.readFileSync('./secrets/key.pem'),
    cert: fs.readFileSync('./secrets/certificate.pem'),
  };

  const server = express();
  const app = await NestFactory.create(AppModule, new ExpressAdapter(server));
  const { httpAdapter } = app.get(HttpAdapterHost);
  app.useGlobalFilters(new SentryFilter(httpAdapter));
  app.enableCors();
  app.enableShutdownHooks();
  await app.init();

  http.createServer(server).listen(3000);
  https.createServer(httpsOptions, server).listen(443);
}

bootstrap();
