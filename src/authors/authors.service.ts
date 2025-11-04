import { HttpException, Injectable } from '@nestjs/common';
import { CreateAuthorDto } from './dto/create-author.dto';
import { UpdateAuthorDto } from './dto/update-author.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { Author } from './entities/author.entity';

@Injectable()
export class AuthorsService {
  constructor(private prisma: PrismaService) { }

  async create(userId: number, bio: string) {
    const author = await this.prisma.author.findUnique({ where: { userId } });
    if (author) {
      throw new HttpException(`AUTHOR_ALREADY_EXISTS`, 400);
    }
    return this.prisma.author.create({
      data: { userId, bio },
    });
  }


  findAll(): Promise<Author[]> {
    return this.prisma.author.findMany();
  }


  async findOne(id: number) {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (user) {
      throw new HttpException(`AUTHOR_ALREADY_EXISTS`, 400);
    }
    return this.prisma.author.findUnique({ where: { id } });
  }

  async update(id: number, data: { bio?: string }) {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (user) {
      throw new HttpException(`AUTHOR_ALREADY_EXISTS`, 400);
    }
    return this.prisma.author.update({
      where: { id },
      data,
    });
  }

  remove(id: number) {
    return `This action removes a #${id} author`;
  }
}
