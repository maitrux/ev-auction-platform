import { Test, TestingModule } from '@nestjs/testing';
import type { AuthenticatedRequest } from 'src/common/types/authenticated-request';
import { AuctionsController } from './auctions.controller';
import { AuctionsService } from './auctions.service';

describe('AuctionsController', () => {
  let controller: AuctionsController;

  const auctionsService = {
    findAll: jest.fn(),
    findOpenForDealer: jest.fn(),
    findOne: jest.fn(),
    createWithVehicle: jest.fn(),
    update: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuctionsController],
      providers: [
        {
          provide: AuctionsService,
          useValue: auctionsService,
        },
      ],
    }).compile();

    controller = module.get<AuctionsController>(AuctionsController);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('delegates open auctions to the service', async () => {
    const openAuctions = [{ id: 'auction-1' }];
    auctionsService.findOpenForDealer.mockResolvedValue(openAuctions);

    const request = {
      user: {
        id: 'dealer-1',
        email: 'dealer@example.com',
        role: 'DEALER',
      },
    } as AuthenticatedRequest;

    await expect(controller.findOpenForDealer(request)).resolves.toEqual(
      openAuctions,
    );
    expect(auctionsService.findOpenForDealer).toHaveBeenCalledWith('dealer-1');
  });
});
