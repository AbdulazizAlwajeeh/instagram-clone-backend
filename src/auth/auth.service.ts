import { Injectable } from '@nestjs/common';
import { SignupDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
    // TODO: Inject UsersRepository here

  async signup(signupDto: SignupDto) {
    const { email, password, username} = signupDto;

    // 1. Check if the user already exists in your database
    //    If yes -> throw new ConflictException('Email already exists');

    // 2. Hash the password using bcrypt
    //    const hashedPassword = await bcrypt.hash(password, 10);

    // 3. Save the new user record to your database
    //    const newUser = await this.db.user.create(...);

    // 4. Return a success state or automatically log them in
    return { 
      message: 'User registered successfully',
      userId: 'mock-id-123' // Temporary placeholder
    };
  }

  async login(loginDto: LoginDto) {
    const { email, password } = loginDto;

    // 1. Find the user in your database by email
    //    If not found -> throw new UnauthorizedException('Invalid credentials');

    // 2. Verify the password matches the hashed password in your database
    //    const isMatch = await bcrypt.compare(password, user.password);
    //    If not a match -> throw new UnauthorizedException('Invalid credentials');

    // 3. Generate a JWT token for the session
    //    const payload = { sub: user.id, email: user.email };
    //    const token = this.jwtService.sign(payload);

    // 4. Return the access token to your app
    return {
      access_token: 'mock-jwt-token-xyz', // Temporary placeholder
      user: { email }
    };
  }
}
