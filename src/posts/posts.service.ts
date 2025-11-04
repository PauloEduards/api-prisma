import { HttpException, Injectable } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { Post } from './entities/post.entity';


@Injectable()
export class PostsService {
  constructor(private prisma: PrismaService) { } // <- injeção de dependência


  // posts.service.ts
  async create(title: string, content: string, publishedAt: Date, authorId: number) {
    const author = await this.prisma.author.findUnique({ where: { id: authorId } });
    if (!author) {
      throw new HttpException(`O author referente ao id:${authorId} não existe`, 400);
    }
    return this.prisma.post.create({
      data: {
        title,
        content,
        publishedAt,
        author: { connect: { id: authorId } },
      },
    });
  }

  async findAll(authorId?: number, date?: string) {
    return this.prisma.post.findMany({
      where: {
        authorId: authorId ?? undefined,
        publishedAt: date
          ? {
              gte: new Date(`${date}T00:00:00Z`),
              lt: new Date(`${date}T23:59:59Z`),
            }
          : undefined,
      },
      include: { author: true },
    });
  }

  async findOne(id: number) {
    const post = await this.prisma.post.findUnique({ where: { id } });
    if (!post) {
      throw new HttpException(`O post referente ao id ${id} não existe`, 400);
    }
    return this.prisma.post.findUnique({ where: { id } });
  }

  async update(id: number, data: UpdatePostDto) {
    const post = await this.prisma.post.findUnique({ where: { id } });
    if (!post) {
      throw new HttpException(`O post referente ao id ${id} não existe`, 400);
    }
    return this.prisma.post.update({
      where: { id },
      data,
    });
  }

  remove(id: number) {
    return `This action removes a #${id} post`;
  }

  async findByAuthor(authorId: number) {
  return this.prisma.post.findMany({
    where: { authorId: Number(authorId) },
  });
}
  

}
