import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/user/user.service';

import { SignupDto } from './dtos/signup.dto';
import { AccessToken } from './types/access-token.type';
import { SignTokenParams } from './types/sign-token-params.type';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async signup(signupDto: SignupDto): Promise<AccessToken> {
    const user = await this.userService.createUser(signupDto);
    return this.signToken({ email: user.email, id: user.id });
  }

  signToken(signTokenParams: SignTokenParams): AccessToken {
    return {
      accessToken: this.jwtService.sign(signTokenParams, {
        secret: this.configService.get('SECRET_KEY'),
        expiresIn: '15m',
      }),
    };
  }
}
