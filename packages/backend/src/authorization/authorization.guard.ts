import {
  CanActivate,
  ExecutionContext,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { Request, Response } from 'express';
import {
  auth,
  InvalidTokenError,
  UnauthorizedError,
} from 'express-oauth2-jwt-bearer';
import { promisify } from 'util';
import * as console from 'console';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthorizationGuard implements CanActivate {
  constructor(private configService: ConfigService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const response = context.switchToHttp().getResponse<Response>();

    const validateAccessToken = promisify(
      auth({
        audience: this.configService.get('AUTH0_AUDIENCE'),
        issuerBaseURL: this.configService.get('AUTH0_ISSUER'),
        tokenSigningAlg: 'RS256',
      }),
    );

    try {
      await validateAccessToken(request, response);

      return true;
    } catch (error) {
      if (error instanceof InvalidTokenError) {
        console.log(error);
        throw new UnauthorizedException('Bad credentials');
      }

      if (error instanceof UnauthorizedError) {
        throw new UnauthorizedException('Requires authentication');
      }

      throw new InternalServerErrorException();
    }
  }
}
