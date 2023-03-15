import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { decode } from 'jsonwebtoken';

@Injectable()
export class AuthGuard implements CanActivate {
  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    if (!request.headers['authorization']) {
      return false;
    }

    const token = request.headers['authorization'].split(' ')[1];
    if (!token) {
      return false;
    }

    const decoded: any = decode(token);
    if (!Array.isArray(decoded?.aud)) {
      return false;
    }

    const audience = decoded.aud.filter((aud: string) =>
      aud.startsWith('meetup/'),
    )[0];
    if (!audience) {
      return false;
    }

    //
    // @TODO meetup
    // Check here in any state, if data ventilation is authorized for this specific client :)
    //
    return true;
  }
}
