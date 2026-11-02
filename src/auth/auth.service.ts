import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { SignupDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';
import { Users } from './entities/user.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Users)
    private readonly userRepo: Repository<Users>,
    private readonly jwtService: JwtService,
  ) { }

  async signup(signupDto: SignupDto) {
    const { email, password, username } = signupDto;

    const userExists = await this.userRepo.findOne({ where: { email } });
    if (userExists) { throw new ConflictException(); }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await this.userRepo.create({ email, encryptedPassword: hashedPassword });
    const savedUser = await this.userRepo.save(newUser);

    return {
      message: 'User registered successfully',
      userId: savedUser.id
    };
  }

  async login(loginDto: LoginDto) {
    const { email, password } = loginDto;

    const user = await this.userRepo.findOne({ where: { email } });
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordMatching = await bcrypt.compare(password, user.encryptedPassword);
    if (!isPasswordMatching) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = { sub: user.id, email: user.email };

    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }
}
