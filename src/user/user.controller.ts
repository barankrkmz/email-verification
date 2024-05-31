import { Controller, Post, Body, Get, Param } from '@nestjs/common';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('register')
  async register(
    @Body('username') username: string,
    @Body('email') email: string,
  ): Promise<void> {
    return this.userService.register(username, email);
  }

  @Get('verify-email/:username/:verificationToken')
  async verifyEmail(
    @Param('username') username: string,
    @Param('verificationToken') verificationToken: string,
  ): Promise<string> {
    const isVerified = await this.userService.verifyEmail(username, verificationToken);
    return isVerified ? 'Email verified successfully' : 'Verification failed';
  }

  @Get('check-verification/:username')
  async checkVerification(
    @Param('username') username: string,
  ): Promise<string> {
    const isVerified = await this.userService.checkVerification(username);
    return isVerified ? 'User is verified' : 'User is not verified';
  }
}
