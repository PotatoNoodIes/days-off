import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, Inject, forwardRef, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { passportJwtSecret } from 'jwks-rsa';

@Injectable()
export class SupabaseStrategy extends PassportStrategy(Strategy) {
  private readonly logger = new Logger(SupabaseStrategy.name);

  constructor(
    private configService: ConfigService,
  ) {
    const supabaseUrl = configService.get<string>('EXPO_PUBLIC_SUPABASE_URL');
    const jwksUri = `${supabaseUrl}/auth/v1/.well-known/jwks.json`;

    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKeyProvider: passportJwtSecret({
        cache: true,
        rateLimit: true,
        jwksRequestsPerMinute: 5,
        jwksUri: jwksUri,
      }),
      algorithms: ['ES256'],
    });

    this.logger.log(`Initialized with JWKS endpoint: ${jwksUri}`);
  }

  async validate(payload: any) {
    this.logger.debug('Authenticated JWT payload:', payload);
    
    return { 
      sub: payload.sub,
      userId: payload.sub,
      email: payload.email,
      user_metadata: payload.user_metadata,
      role: payload.role,
    };
  }
}
