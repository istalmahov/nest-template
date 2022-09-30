import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { UserService } from 'src/user/user.service';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

@Controller('/auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private userService: UserService,
  ) {}

  @Post('/register')
  async register(@Body() registerDto: RegisterDto) {
    const user = await this.userService.create(registerDto);

    return this.authService.getTokenResponse(user);
  }

  @Post('/login')
  async login(@Body() loginDto: LoginDto) {
    const user = await this.authService.validatePasswordLogin(loginDto);

    if (!user) {
      throw new BadRequestException('Wrong email or password');
    }

    return this.authService.getTokenResponse(user);
  }

  @UseGuards(JwtAuthGuard)
  @Get('/me')
  async getMe(@Req() req) {
    return this.userService.findOne(req.user);
  }

  @Get('/google')
  @UseGuards(AuthGuard('google'))
  googleOAuth() {
    // Handled by passport.js
  }

  @Get('/google/callback')
  @UseGuards(AuthGuard('google'))
  async googleAuthRedirect(@Req() req) {
    const { googleId, email }: { googleId: string; email: string } = req.user;

    let user = await this.userService.findOne({ email });

    if (!user) {
      user = await this.userService.create({ email, googleId });
    } else {
      user.googleId = googleId;
      await user.save();
    }

    return this.authService.getTokenResponse(user);
  }
}
