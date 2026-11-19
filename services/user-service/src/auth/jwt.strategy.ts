import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) { constructor(config:ConfigService){ super({ jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), ignoreExpiration:false, secretOrKey: config.get<string>('JWT_SECRET') || (process.env.NODE_ENV === 'production' ? (() => { throw new Error('JWT_SECRET doit être défini en production'); })() : 'glovo-dev-only-jwt-secret') }); } validate(payload:any){ return { userId: payload.sub, email: payload.email, role: payload.role }; } }
