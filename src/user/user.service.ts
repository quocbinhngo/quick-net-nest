import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import * as argon from 'argon2';
import { PrismaService } from 'src/prisma/prisma.service';

import { UserAlreadyExistedException } from './exceptions';
import { CreateUserParams } from './types/create-user-params.type';

@Injectable()
export class UserService {
  constructor(private prismaService: PrismaService) {}

  async createUser(createUserParams: CreateUserParams): Promise<User> {
    const isExistedEmail = await this.prismaService.user.findUnique({
      where: { email: createUserParams.email },
    });

    if (isExistedEmail) {
      throw new UserAlreadyExistedException();
    }

    const hashedPassword = await argon.hash(createUserParams.password);
    return await this.prismaService.user.create({
      data: { ...createUserParams, password: hashedPassword },
    });
  }
}
