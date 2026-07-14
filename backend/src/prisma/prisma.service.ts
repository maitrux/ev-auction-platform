import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { createPrismaClient } from './create-prisma-client';

@Injectable()
export class PrismaService implements OnModuleInit {
  private readonly client: PrismaClient = createPrismaClient();

  async onModuleInit(): Promise<void> {
    await this.client.$connect();
  }

  get user(): PrismaClient['user'] {
    return this.client.user;
  }

  get vehicle(): PrismaClient['vehicle'] {
    return this.client.vehicle;
  }

  get auction(): PrismaClient['auction'] {
    return this.client.auction;
  }

  get bid(): PrismaClient['bid'] {
    return this.client.bid;
  }
}
