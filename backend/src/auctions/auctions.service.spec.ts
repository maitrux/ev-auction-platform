import { Test, TestingModule } from '@nestjs/testing';
import { AuctionStatus } from '../common/constants/auction-status';
import { PrismaService } from '../prisma/prisma.service';
import { AuctionsService } from './auctions.service';

describe('AuctionsService', () => {
  let service: AuctionsService;

  const prisma = {
    auction: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
      create: jest.fn(),
    },
    vehicle: {
      create: jest.fn(),
      delete: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuctionsService,
        {
          provide: PrismaService,
          useValue: prisma,
        },
      ],
    }).compile();

    service = module.get<AuctionsService>(AuctionsService);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findOpenForDealer', () => {
    function buildAuction(overrides: Record<string, unknown> = {}) {
      return {
        id: 'auction-1',
        status: AuctionStatus.LIVE,
        startsAt: new Date('2026-07-14T12:00:00.000Z'),
        endsAt: new Date('2026-07-18T12:00:00.000Z'),
        result: null,
        vehicle: {
          make: 'Tesla',
          model: 'Model 3',
          year: 2022,
          photos: [],
          city: 'Munich',
          country: 'Germany',
          mileage: 25000,
        },
        ...overrides,
      };
    }

    it('returns only LIVE and SCHEDULED auctions', async () => {
      prisma.auction.findMany.mockResolvedValue([
        buildAuction({ id: 'live-1' }),
        buildAuction({
          id: 'scheduled-1',
          status: AuctionStatus.SCHEDULED,
          startsAt: new Date('2026-07-20T12:00:00.000Z'),
          endsAt: new Date('2026-07-23T12:00:00.000Z'),
        }),
        buildAuction({
          id: 'ended-1',
          status: AuctionStatus.ENDED,
          startsAt: new Date('2026-06-01T12:00:00.000Z'),
          endsAt: new Date('2026-06-05T12:00:00.000Z'),
        }),
      ]);

      const result = await service.findOpenForDealer();

      expect(result).toHaveLength(2);
      expect(result.map((auction) => auction.id)).toEqual([
        'live-1',
        'scheduled-1',
      ]);
      expect(result[0].status).toBe(AuctionStatus.LIVE);
      expect(result[1].status).toBe(AuctionStatus.SCHEDULED);
    });

    it('sorts LIVE auctions before SCHEDULED and by soonest end/start', async () => {
      prisma.auction.findMany.mockResolvedValue([
        buildAuction({
          id: 'scheduled-later',
          status: AuctionStatus.SCHEDULED,
          startsAt: new Date('2026-07-25T12:00:00.000Z'),
          endsAt: new Date('2026-07-28T12:00:00.000Z'),
        }),
        buildAuction({
          id: 'live-later',
          endsAt: new Date('2026-07-20T12:00:00.000Z'),
        }),
        buildAuction({
          id: 'live-sooner',
          endsAt: new Date('2026-07-17T12:00:00.000Z'),
        }),
        buildAuction({
          id: 'scheduled-sooner',
          status: AuctionStatus.SCHEDULED,
          startsAt: new Date('2026-07-20T12:00:00.000Z'),
          endsAt: new Date('2026-07-23T12:00:00.000Z'),
        }),
      ]);

      const result = await service.findOpenForDealer();

      expect(result.map((auction) => auction.id)).toEqual([
        'live-sooner',
        'live-later',
        'scheduled-sooner',
        'scheduled-later',
      ]);
    });

    it('includes enriched vehicle fields for dealer cards', async () => {
      prisma.auction.findMany.mockResolvedValue([buildAuction()]);

      const [auction] = await service.findOpenForDealer();

      expect(auction.vehicle).toEqual({
        make: 'Tesla',
        model: 'Model 3',
        year: 2022,
        photos: [],
        city: 'Munich',
        country: 'Germany',
        mileage: 25000,
      });
      expect(auction).not.toHaveProperty('highestBid');
      expect(auction).not.toHaveProperty('bidCount');
    });
  });
});
