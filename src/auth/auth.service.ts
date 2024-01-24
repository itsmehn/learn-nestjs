import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthDTO } from './dto';
import * as argon from 'argon2';

@Injectable({})
export class AuthService {
  constructor(private prismaService: PrismaService) {}

  async register(authDTO: AuthDTO) {
    const hashedPassword = await argon.hash(authDTO.password);
    try {
      const user = await this.prismaService.user.create({
        data: {
          email: authDTO.email,
          hashedPassword: hashedPassword,
          fullName: authDTO.fullName,
        },
        select: {
          id: true,
          email: true,
          fullName: true,
          createdAt: true,
        },
      });
      return user;
    } catch (err) {
      return err;
    }
  }

  async login(authDTO: AuthDTO) {
    const user = await this.prismaService.user.findUnique({
      where: {
        email: authDTO.email,
      },
    });

    if (!user) {
      throw new ForbiddenException('User not found');
    }

    const passwordMatched = await argon.verify(
      user.hashedPassword,
      authDTO.password,
    );

    if (!passwordMatched) {
      throw new ForbiddenException('Incorrect Password');
    }
    delete user.hashedPassword;

    return user;
  }
}
