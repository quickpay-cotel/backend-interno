import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: '8Ls!xv2PLD92jRzm$NfQ9gT7qW',
    });
  }

  async validate(payload: any) {
    return payload; // El payload del token (información del usuario)
  }
}