import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class BidsService {
  constructor(private readonly prisma: PrismaService) {}

  async findByDealer(dealerId: string) {
    return this.prisma.bid.findMany({
      where: {
        dealerId,
      },
      include: {
        auction: {
          include: {
            vehicle: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }
}
