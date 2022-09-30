import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { User, UserScopes } from 'src/user/user.model';
import { UserService } from 'src/user/user.service';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async validateLogin(loginDto: LoginDto): Promise<User | null> {
    const user = await this.userService.findOne(
      { email: loginDto.email },
      UserScopes.withPassword,
    );

    if (!user) {
      return null;
    }

    const isValid = await bcrypt.compare(loginDto.password, user.password);

    if (!isValid) return null;

    return user;
  }

  async getTokenResponse(user: User) {
    const payload = { id: user.id };
    return {
      token: this.jwtService.sign(payload),
    };
  }
}
