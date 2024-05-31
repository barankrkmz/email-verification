import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import * as nodemailer from 'nodemailer';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async register(username: string, email: string): Promise<void> {
    const verificationToken = Math.random().toString(36).substring(2);
    const user = this.usersRepository.create({ username, email, verificationToken, isVerified: false });
    await this.usersRepository.save(user);

    // E-posta gönderimi
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'youremail@gmail.com',
        pass: 'yourpassword',
      },
    });

    const mailOptions = {
      from: 'youremail@gmail.com',
      to: email,
      subject: 'Email Verification',
      text: `Please verify your email using this token: ${verificationToken}`,
    };

    await transporter.sendMail(mailOptions);
  }

  async verifyEmail(username: string, verificationToken: string): Promise<boolean> {
    const user = await this.usersRepository.findOne({ where: { username } });
    if (!user || user.verificationToken !== verificationToken) {
      return false;
    }
    user.isVerified = true;
    await this.usersRepository.save(user);
    return true;
  }

  async checkVerification(username: string): Promise<boolean> {
    const user = await this.usersRepository.findOne({ where: { username } });
    return user ? user.isVerified : false;
  }
}
