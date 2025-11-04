import { HttpException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

import { PrismaService } from '../prisma/prisma.service';
import { User } from './entities/user.entity';

@Injectable()
export class UserService {

  constructor(private prisma: PrismaService) { }

  async create(name: string, email: string) {
    return this.prisma.user.create({
      data: { name, email },
    });
  }

  findAll(): Promise<User[]> {
    return this.prisma.user.findMany();
  }

  async findOne(id: number) {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) {
      throw new HttpException(`O usuario referente ao id ${id} não existe`, 400);
    }
    return this.prisma.user.findUnique({ where: { id } });
  }

  async update(id: number, data: { name?: string; email?: string }) {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) {
      throw new HttpException(`O usuario referente ao id ${id} não existe`, 400);
    }
    return this.prisma.user.update({ where: { id }, data, });
  }

  async addFavorite(userId: number, postId: number) {
    return this.prisma.favorite.create({
      data: { userId, postId },
    });
  }
  async getFavorites(userId: number) {
    return this.prisma.favorite.findMany({
      where: { userId },
      include: { post: true },
    });
  }

}
