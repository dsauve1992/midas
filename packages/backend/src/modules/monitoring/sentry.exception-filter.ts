import { ArgumentsHost, Catch } from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';
import { WithSentry } from '@sentry/nestjs';

@Catch()
export class SentryFilter extends BaseExceptionFilter {
  @WithSentry()
  catch(exception: unknown, host: ArgumentsHost) {
    console.log(exception);
    super.catch(exception, host);
  }
}
