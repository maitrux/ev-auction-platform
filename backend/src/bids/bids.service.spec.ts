import { BadRequestException, NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AuctionStatus } from '../common/constants/auction-status';
import { PrismaService } from '../prisma/prisma.service';
import { BidsService } from './bids.service';

describe('BidsService', () => {
  let service: BidsService;

  const day = 24 * 60 * 60 * 1000;
  const daysFromNow = (days: number) => new Date(Date.now() + days * day);

  const prisma = {
    bid: {
      findMany: jest.fn(),
      create: jest.fn(),
    },
    auction: {
      findUnique: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BidsService,
        {
          provide: PrismaService,
          useValue: prisma,
        },
      ],
    }).compile();

    service = module.get<BidsService>(BidsService);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    function buildLiveAuction(overrides: Record<string, unknown> = {}) {
      return {
        id: 'auction-1',
        status: AuctionStatus.LIVE,
        startsAt: daysFromNow(-1),
        endsAt: daysFromNow(4),
        minIncrement: 250,
        result: null,
        bids: [
          {
            amount: 27250,
            createdAt: daysFromNow(-2),
          },
        ],
        ...overrides,
      };
    }

    it('creates a bid when the amount meets the minimum increment', async () => {
      prisma.auction.findUnique.mockResolvedValue(buildLiveAuction());
      prisma.bid.create.mockResolvedValue({
        id: 'bid-1',
        amount: 27500,
        createdAt: daysFromNow(0),
      });

      const result = await service.create('dealer-1', {
        auctionId: 'auction-1',
        amount: 27500,
      });

      expect(prisma.bid.create).toHaveBeenCalledWith({
        data: {
          auctionId: 'auction-1',
          dealerId: 'dealer-1',
          amount: 27500,
        },
      });
      expect(result.amount).toBe(27500);
    });

    it('rejects bids below the minimum increment', async () => {
      prisma.auction.findUnique.mockResolvedValue(buildLiveAuction());

      await expect(
        service.create('dealer-1', {
          auctionId: 'auction-1',
          amount: 27400,
        }),
      ).rejects.toBeInstanceOf(BadRequestException);
    });

    it('rejects bids on non-live auctions', async () => {
      prisma.auction.findUnique.mockResolvedValue(
        buildLiveAuction({
          startsAt: daysFromNow(5),
          endsAt: daysFromNow(8),
        }),
      );

      await expect(
        service.create('dealer-1', {
          auctionId: 'auction-1',
          amount: 250,
        }),
      ).rejects.toBeInstanceOf(BadRequestException);
    });

    it('throws when the auction does not exist', async () => {
      prisma.auction.findUnique.mockResolvedValue(null);

      await expect(
        service.create('dealer-1', {
          auctionId: 'missing',
          amount: 250,
        }),
      ).rejects.toBeInstanceOf(NotFoundException);
    });
  });
});
