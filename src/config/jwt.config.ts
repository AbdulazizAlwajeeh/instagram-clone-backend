import { registerAs } from '@nestjs/config';

export interface JwtConfig {
  secret: string;
  duration: string;
}

export default registerAs('jwt', (): JwtConfig => ({
  secret: process.env.JWT_SECRET ?? 'secret',
  duration: process.env.JWT_DURATION ?? '1h',
}));