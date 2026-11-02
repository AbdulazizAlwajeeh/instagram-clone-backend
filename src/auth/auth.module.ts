import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Users } from './entities/user.entity';
import { JwtModule } from '@nestjs/jwt';
import { ConfigType } from '@nestjs/config';
import jwtConfig from '../config/jwt.config';

@Module({
  imports: [TypeOrmModule.forFeature([Users]),
  JwtModule.registerAsync({
    global: true,
    inject: [jwtConfig.KEY],
    useFactory: async (jwtCfg: ConfigType<typeof jwtConfig>) => {
      return {
        secret: jwtCfg.secret,
        signOptions: {
          expiresIn: jwtCfg.duration as any,
        },
      };
    },
  }),],
  controllers: [AuthController],
  providers: [AuthService],
  exports: [TypeOrmModule]
})
export class AuthModule { }
