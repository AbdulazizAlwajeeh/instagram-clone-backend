import { Injectable} from '@nestjs/common';
import { SignupDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';
import { Users } from './entities/user.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { ProfileService } from '../profile/profile.service';
import { AuthErrorCode, AuthException } from './exceptions/auth.exception';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Users)
    private readonly userRepo: Repository<Users>,
    private readonly profileService: ProfileService,
    private readonly jwtService: JwtService,
  ) { }

  async signup(signupDto: SignupDto) {
    const { email, password, username } = signupDto;

    const emailRegistered = await this.userRepo.findOne({ where: { email } });
    if (emailRegistered) { throw new AuthException(AuthErrorCode.email_exists); }

    const usernameTaken = await this.profileService.isUsernameTaken(username);
    if (usernameTaken) { throw new AuthException(AuthErrorCode.username_exists); }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await this.userRepo.create({ email, encryptedPassword: hashedPassword });
    const savedUser = await this.userRepo.save(newUser);

    await this.profileService.create(savedUser.id, username);

    return {
      message: 'User registered successfully',
      userId: savedUser.id
    };
  }

  async login(loginDto: LoginDto) {
    const { email, password } = loginDto;

    const user = await this.userRepo.findOne({ where: { email } });
    if (!user) {
      throw new AuthException(AuthErrorCode.invalid_credentials);
    }

    const isPasswordMatching = await bcrypt.compare(password, user.encryptedPassword);
    if (!isPasswordMatching) {
      throw new AuthException(AuthErrorCode.invalid_credentials);
    }

    const payload = { sub: user.id, email: user.email };

    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }
}
