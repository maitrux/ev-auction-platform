import { AuctionResult, Role, VehicleCondition } from '@prisma/client';
import 'dotenv/config';
import { AuctionStatus } from '../src/common/constants/auction-status';
import { hashPassword } from '../src/common/utils/password';
import { createPrismaClient } from '../src/prisma/create-prisma-client';

const prisma = createPrismaClient();

type SellingCountry = 'Austria' | 'Germany' | 'France' | 'Switzerland';

type VehicleSeed = {
  key: string;
  vin: string;
  make: string;
  model: string;
  year: number;
  mileage: number;
  batteryCapacityKwh: number;
  batterySoH: number;
  rangeKm: number;
  registrationDate: string;
  condition: VehicleCondition;
  conditionNotes?: string;
  photos: string[];
  city: string;
  country: SellingCountry;
};

const VEHICLE_SEEDS: VehicleSeed[] = [
  {
    key: 'tesla1',
    vin: '5YJ3E1EA7KF000001',
    make: 'Tesla',
    model: 'Model 3',
    year: 2022,
    mileage: 45000,
    batteryCapacityKwh: 75,
    batterySoH: 91,
    rangeKm: 450,
    registrationDate: '2022-05-01',
    condition: 'GOOD',
    conditionNotes: 'Minor scratches on rear bumper.',
    photos: [
      'https://images.pexels.com/photos/10029878/pexels-photo-10029878.jpeg',
      'https://images.pexels.com/photos/34357079/pexels-photo-34357079.jpeg',
      'https://images.pexels.com/photos/35387655/pexels-photo-35387655.jpeg',
    ],
    city: 'Munich',
    country: 'Germany',
  },
  {
    key: 'vw',
    vin: 'WVWZZZ1JZXW000002',
    make: 'Volkswagen',
    model: 'ID.3',
    year: 2021,
    mileage: 32000,
    batteryCapacityKwh: 58,
    batterySoH: 95,
    rangeKm: 420,
    registrationDate: '2021-03-15',
    condition: 'EXCELLENT',
    conditionNotes:
      'One previous owner. Regularly serviced at authorized dealer.',
    photos: [
      'https://images.pexels.com/photos/30373975/pexels-photo-30373975.jpeg',
    ],
    city: 'Berlin',
    country: 'Germany',
  },
  {
    key: 'renault',
    vin: 'VF1AG000000000003',
    make: 'Renault',
    model: 'Zoe',
    year: 2020,
    mileage: 68000,
    batteryCapacityKwh: 52,
    batterySoH: 86,
    rangeKm: 395,
    registrationDate: '2020-07-20',
    condition: 'FAIR',
    conditionNotes: 'Visible wear on interior. Battery still performs well.',
    photos: [
      'https://images.pexels.com/photos/16634642/pexels-photo-16634642.jpeg',
      'https://images.pexels.com/photos/15372518/pexels-photo-15372518.jpeg',
    ],
    city: 'Paris',
    country: 'France',
  },
  {
    key: 'bmw',
    vin: 'WBA00000000000004',
    make: 'BMW',
    model: 'i4',
    year: 2023,
    mileage: 12000,
    batteryCapacityKwh: 83,
    batterySoH: 98,
    rangeKm: 590,
    registrationDate: '2023-01-10',
    condition: 'EXCELLENT',
    photos: [
      'https://images.pexels.com/photos/17000825/pexels-photo-17000825.jpeg',
      'https://images.pexels.com/photos/17000828/pexels-photo-17000828.jpeg',
    ],
    city: 'Hamburg',
    country: 'Germany',
  },
  {
    key: 'hyundai',
    vin: 'KMH00000000000005',
    make: 'Hyundai',
    model: 'Kona Electric',
    year: 2022,
    mileage: 28000,
    batteryCapacityKwh: 64,
    batterySoH: 94,
    rangeKm: 470,
    registrationDate: '2022-09-12',
    condition: 'GOOD',
    photos: [
      'https://images.pexels.com/photos/33128503/pexels-photo-33128503.jpeg',
    ],
    city: 'Cologne',
    country: 'Germany',
  },
  {
    key: 'nissan',
    vin: 'JN100000000000006',
    make: 'Nissan',
    model: 'Leaf',
    year: 2021,
    mileage: 51000,
    batteryCapacityKwh: 62,
    batterySoH: 89,
    rangeKm: 360,
    registrationDate: '2021-04-08',
    condition: 'GOOD',
    photos: [
      'https://images.pexels.com/photos/19896350/pexels-photo-19896350.jpeg',
      'https://images.pexels.com/photos/33501918/pexels-photo-33501918.jpeg',
    ],
    city: 'Frankfurt',
    country: 'Germany',
  },
  {
    key: 'audi1',
    vin: 'WAU00000000000007',
    make: 'Audi',
    model: 'Q6 e-tron',
    year: 2023,
    mileage: 18000,
    batteryCapacityKwh: 77,
    batterySoH: 97,
    rangeKm: 520,
    registrationDate: '2023-04-22',
    condition: 'EXCELLENT',
    photos: [
      'https://images.pexels.com/photos/14277538/pexels-photo-14277538.jpeg',
    ],
    city: 'Stuttgart',
    country: 'Germany',
  },
  {
    key: 'audi2',
    vin: 'W1K00000000000008',
    make: 'Audi',
    model: 'EQA',
    year: 2022,
    mileage: 24000,
    batteryCapacityKwh: 66,
    batterySoH: 93,
    rangeKm: 430,
    registrationDate: '2022-02-14',
    condition: 'GOOD',
    photos: [
      'https://images.pexels.com/photos/12351517/pexels-photo-12351517.jpeg',
      'https://images.pexels.com/photos/38600973/pexels-photo-38600973.jpeg',
      'https://images.pexels.com/photos/28751639/pexels-photo-28751639.jpeg',
    ],
    city: 'Düsseldorf',
    country: 'Germany',
  },
  {
    key: 'audi3',
    vin: 'YSMA000000000009',
    make: 'Audi',
    model: 'A4 e-tron',
    year: 2022,
    mileage: 35000,
    batteryCapacityKwh: 78,
    batterySoH: 92,
    rangeKm: 480,
    registrationDate: '2022-06-08',
    condition: 'GOOD',
    photos: [
      'https://images.pexels.com/photos/28751639/pexels-photo-28751639.jpeg',
    ],
    city: 'Nuremberg',
    country: 'Germany',
  },
  {
    key: 'tesla2',
    vin: 'KNA00000000000010',
    make: 'Tesla',
    model: 'Model Y',
    year: 2023,
    mileage: 15000,
    batteryCapacityKwh: 77,
    batterySoH: 96,
    rangeKm: 510,
    registrationDate: '2023-03-18',
    condition: 'EXCELLENT',
    photos: [
      'https://images.pexels.com/photos/34698047/pexels-photo-34698047.jpeg',
      'https://images.pexels.com/photos/18978491/pexels-photo-18978491.jpeg',
    ],
    city: 'Strasbourg',
    country: 'France',
  },
  {
    key: 'ford1',
    vin: '1FME0000000000011',
    make: 'Ford',
    model: 'Mustang Mach-E',
    year: 2022,
    mileage: 41000,
    batteryCapacityKwh: 88,
    batterySoH: 90,
    rangeKm: 500,
    registrationDate: '2022-08-30',
    condition: 'GOOD',
    photos: [
      'https://images.pexels.com/photos/27138982/pexels-photo-27138982.jpeg',
    ],
    city: 'Lille',
    country: 'France',
  },
  {
    key: 'ford2',
    vin: 'TMB00000000000012',
    make: 'Ford',
    model: 'Mustang Mach-E',
    year: 2021,
    mileage: 47000,
    batteryCapacityKwh: 82,
    batterySoH: 88,
    rangeKm: 530,
    registrationDate: '2021-11-05',
    condition: 'GOOD',
    photos: [
      'https://images.pexels.com/photos/9799995/pexels-photo-9799995.jpeg',
    ],
    city: 'Salzburg',
    country: 'Austria',
  },
  {
    key: 'ford3',
    vin: 'VSS00000000000013',
    make: 'Ford',
    model: 'F-150 Lightning',
    year: 2023,
    mileage: 9000,
    batteryCapacityKwh: 58,
    batterySoH: 99,
    rangeKm: 420,
    registrationDate: '2023-07-12',
    condition: 'EXCELLENT',
    photos: [
      'https://images.pexels.com/photos/27138982/pexels-photo-27138982.jpeg',
    ],
    city: 'Marseille',
    country: 'France',
  },
  {
    key: 'peugeot',
    vin: 'VF30000000000014',
    make: 'Peugeot',
    model: 'e-208',
    year: 2021,
    mileage: 39000,
    batteryCapacityKwh: 50,
    batterySoH: 91,
    rangeKm: 340,
    registrationDate: '2021-09-20',
    condition: 'GOOD',
    photos: [
      'https://images.pexels.com/photos/3846205/pexels-photo-3846205.jpeg',
    ],
    city: 'Lyon',
    country: 'France',
  },
  {
    key: 'fiat1',
    vin: 'ZFA00000000000015',
    make: 'Fiat',
    model: '500e',
    year: 2022,
    mileage: 22000,
    batteryCapacityKwh: 42,
    batterySoH: 94,
    rangeKm: 320,
    registrationDate: '2022-04-03',
    condition: 'GOOD',
    photos: [
      'https://images.pexels.com/photos/35729636/pexels-photo-35729636.jpeg',
    ],
    city: 'Geneva',
    country: 'Switzerland',
  },
  {
    key: 'fiat2',
    vin: 'LSJA0000000000016',
    make: 'Fiat',
    model: '500e',
    year: 2023,
    mileage: 11000,
    batteryCapacityKwh: 64,
    batterySoH: 97,
    rangeKm: 450,
    registrationDate: '2023-05-27',
    condition: 'EXCELLENT',
    photos: [
      'https://images.pexels.com/photos/31850593/pexels-photo-31850593.jpeg',
    ],
    city: 'Vienna',
    country: 'Austria',
  },
  {
    key: 'volvo',
    vin: 'YV100000000000017',
    make: 'Volvo',
    model: 'XC40 Recharge',
    year: 2022,
    mileage: 33000,
    batteryCapacityKwh: 75,
    batterySoH: 92,
    rangeKm: 440,
    registrationDate: '2022-10-15',
    condition: 'GOOD',
    photos: [
      'https://images.pexels.com/photos/20695289/pexels-photo-20695289.jpeg',
    ],
    city: 'Basel',
    country: 'Switzerland',
  },
  {
    key: 'porsche',
    vin: 'WP0ZZZ0000000018',
    make: 'Porsche',
    model: 'Taycan',
    year: 2021,
    mileage: 26000,
    batteryCapacityKwh: 93,
    batterySoH: 93,
    rangeKm: 450,
    registrationDate: '2021-12-01',
    condition: 'EXCELLENT',
    photos: [
      'https://images.pexels.com/photos/18412480/pexels-photo-18412480.jpeg',
    ],
    city: 'Zurich',
    country: 'Switzerland',
  },
  {
    key: 'opel',
    vin: 'W0V00000000000019',
    make: 'Opel',
    model: 'Mokka-e',
    year: 2022,
    mileage: 30000,
    batteryCapacityKwh: 50,
    batterySoH: 90,
    rangeKm: 340,
    registrationDate: '2022-07-19',
    condition: 'FAIR',
    conditionNotes: 'Small dent on passenger door.',
    photos: [
      'https://images.pexels.com/photos/10994395/pexels-photo-10994395.jpeg',
    ],
    city: 'Hannover',
    country: 'Germany',
  },
  {
    key: 'mini',
    vin: 'WMW00000000000020',
    make: 'Mini',
    model: 'Cooper SE',
    year: 2021,
    mileage: 44000,
    batteryCapacityKwh: 32,
    batterySoH: 87,
    rangeKm: 230,
    registrationDate: '2021-06-11',
    condition: 'FAIR',
    photos: [
      'https://images.pexels.com/photos/29909546/pexels-photo-29909546.jpeg',
    ],
    city: 'Leipzig',
    country: 'Germany',
  },
];

type VehicleKey = (typeof VEHICLE_SEEDS)[number]['key'];

type OpenAuctionSeed = {
  vehicleKey: VehicleKey;
  status: typeof AuctionStatus.LIVE | typeof AuctionStatus.SCHEDULED;
  reservePrice: number;
  minIncrement: number;
  scheduledDaysFromNow?: number;
};

const OPEN_AUCTION_SEEDS: OpenAuctionSeed[] = [
  {
    vehicleKey: 'audi2',
    status: AuctionStatus.LIVE,
    reservePrice: 34000,
    minIncrement: 400,
  },
  {
    vehicleKey: 'tesla2',
    status: AuctionStatus.LIVE,
    reservePrice: 36000,
    minIncrement: 400,
  },
  {
    vehicleKey: 'audi3',
    status: AuctionStatus.LIVE,
    reservePrice: 39000,
    minIncrement: 450,
  },
  {
    vehicleKey: 'ford1',
    status: AuctionStatus.LIVE,
    reservePrice: 41000,
    minIncrement: 500,
  },
  {
    vehicleKey: 'ford2',
    status: AuctionStatus.LIVE,
    reservePrice: 33000,
    minIncrement: 350,
  },
  {
    vehicleKey: 'ford3',
    status: AuctionStatus.LIVE,
    reservePrice: 31000,
    minIncrement: 350,
  },
  {
    vehicleKey: 'fiat1',
    status: AuctionStatus.LIVE,
    reservePrice: 24000,
    minIncrement: 250,
  },
  {
    vehicleKey: 'peugeot',
    status: AuctionStatus.SCHEDULED,
    reservePrice: 19000,
    minIncrement: 200,
    scheduledDaysFromNow: 7,
  },
  {
    vehicleKey: 'fiat2',
    status: AuctionStatus.SCHEDULED,
    reservePrice: 16000,
    minIncrement: 150,
    scheduledDaysFromNow: 9,
  },
  {
    vehicleKey: 'volvo',
    status: AuctionStatus.SCHEDULED,
    reservePrice: 37000,
    minIncrement: 400,
    scheduledDaysFromNow: 11,
  },
  {
    vehicleKey: 'porsche',
    status: AuctionStatus.SCHEDULED,
    reservePrice: 72000,
    minIncrement: 1000,
    scheduledDaysFromNow: 14,
  },
  {
    vehicleKey: 'opel',
    status: AuctionStatus.SCHEDULED,
    reservePrice: 21000,
    minIncrement: 200,
    scheduledDaysFromNow: 16,
  },
  {
    vehicleKey: 'mini',
    status: AuctionStatus.SCHEDULED,
    reservePrice: 18000,
    minIncrement: 200,
    scheduledDaysFromNow: 18,
  },
];

type SeedVehicles = Record<VehicleKey, { id: string }>;

async function createUsers(): Promise<void> {
  const passwordHash = await hashPassword('password123');

  await prisma.user.createMany({
    skipDuplicates: true,
    data: [
      {
        email: 'admin@aampere.com',
        passwordHash,
        role: Role.ADMIN,
        name: 'Aampere Admin',
      },
      {
        email: 'dealer1@example.com',
        passwordHash,
        role: Role.DEALER,
        name: 'Dealer One',
      },
      {
        email: 'dealer2@example.com',
        passwordHash,
        role: Role.DEALER,
        name: 'Dealer Two',
      },
      {
        email: 'dealer3@example.com',
        passwordHash,
        role: Role.DEALER,
        name: 'Dealer Three',
      },
    ],
  });
}

async function createVehicles(): Promise<SeedVehicles> {
  const vehicles = {} as SeedVehicles;

  for (const seed of VEHICLE_SEEDS) {
    vehicles[seed.key] = await prisma.vehicle.upsert({
      where: { vin: seed.vin },
      update: {},
      create: {
        vin: seed.vin,
        make: seed.make,
        model: seed.model,
        year: seed.year,
        mileage: seed.mileage,
        batteryCapacityKwh: seed.batteryCapacityKwh,
        batterySoH: seed.batterySoH,
        rangeKm: seed.rangeKm,
        registrationDate: new Date(seed.registrationDate),
        condition: seed.condition,
        conditionNotes: seed.conditionNotes,
        photos: seed.photos,
        city: seed.city,
        country: seed.country,
      },
    });
  }

  return vehicles;
}

type SeedAuctions = {
  draftAuction: { id: string };
  scheduledAuction: { id: string };
  activeAuction: { id: string };
  pendingReviewAuction: { id: string };
  unsoldAuction: { id: string };
  completedAuction: { id: string };
  canceledAuction: { id: string };
  openAuctions: { id: string; vehicleKey: string }[];
};

function getLiveWindow(now: Date): { startsAt: Date; endsAt: Date } {
  const startsAt = new Date(now);
  startsAt.setDate(startsAt.getDate() - 1);
  const endsAt = new Date(now);
  endsAt.setDate(endsAt.getDate() + 3);

  return { startsAt, endsAt };
}

function getScheduledWindow(
  now: Date,
  daysFromNow: number,
): { startsAt: Date; endsAt: Date } {
  const startsAt = new Date(now);
  startsAt.setDate(startsAt.getDate() + daysFromNow);
  const endsAt = new Date(startsAt);
  endsAt.setDate(endsAt.getDate() + 3);

  return { startsAt, endsAt };
}

async function createAuctions(vehicles: SeedVehicles): Promise<SeedAuctions> {
  const now = new Date();

  const activeWindow = getLiveWindow(now);
  const scheduledWindow = getScheduledWindow(now, 5);

  const pendingReviewStart = new Date('2026-06-10T10:00:00');
  const pendingReviewEnd = new Date('2026-06-14T10:00:00');
  const completedStart = new Date('2026-07-01T10:00:00');
  const completedEnd = new Date('2026-07-05T10:00:00');

  const draftAuction = await prisma.auction.create({
    data: {
      vehicleId: vehicles.audi1.id,
    } as never,
  });

  const scheduledAuction = await prisma.auction.create({
    data: {
      vehicleId: vehicles.bmw.id,
      status: AuctionStatus.SCHEDULED,
      startsAt: scheduledWindow.startsAt,
      endsAt: scheduledWindow.endsAt,
      reservePrice: 42000,
      minIncrement: 500,
    } as never,
  });

  const activeAuction = await prisma.auction.create({
    data: {
      vehicleId: vehicles.tesla1.id,
      status: AuctionStatus.LIVE,
      startsAt: activeWindow.startsAt,
      endsAt: activeWindow.endsAt,
      reservePrice: 25000,
      minIncrement: 250,
    } as never,
  });

  const pendingReviewAuction = await prisma.auction.create({
    data: {
      vehicleId: vehicles.vw.id,
      status: AuctionStatus.ENDED,
      startsAt: pendingReviewStart,
      endsAt: pendingReviewEnd,
      reservePrice: 22000,
      minIncrement: 300,
    } as never,
  });

  const unsoldAuction = await prisma.auction.create({
    data: {
      vehicleId: vehicles.nissan.id,
      status: AuctionStatus.ENDED,
      startsAt: new Date('2026-05-10T10:00:00'),
      endsAt: new Date('2026-05-14T10:00:00'),
      reservePrice: 18000,
      minIncrement: 250,
      result: AuctionResult.UNSOLD,
    } as never,
  });

  const completedAuction = await prisma.auction.create({
    data: {
      vehicleId: vehicles.renault.id,
      status: AuctionStatus.ENDED,
      startsAt: completedStart,
      endsAt: completedEnd,
      reservePrice: 15000,
      minIncrement: 200,
      result: AuctionResult.SOLD,
    } as never,
  });

  const canceledAuction = await prisma.auction.create({
    data: {
      vehicleId: vehicles.hyundai.id,
      status: AuctionStatus.CANCELED,
      startsAt: new Date('2026-06-20T10:00:00'),
      endsAt: new Date('2026-06-23T10:00:00'),
      reservePrice: 27000,
      minIncrement: 250,
    } as never,
  });

  const openAuctions: { id: string; vehicleKey: string }[] = [];

  for (const seed of OPEN_AUCTION_SEEDS) {
    const window =
      seed.status === AuctionStatus.LIVE
        ? getLiveWindow(now)
        : getScheduledWindow(now, seed.scheduledDaysFromNow ?? 5);

    const auction = await prisma.auction.create({
      data: {
        vehicleId: vehicles[seed.vehicleKey].id,
        status: seed.status,
        startsAt: window.startsAt,
        endsAt: window.endsAt,
        reservePrice: seed.reservePrice,
        minIncrement: seed.minIncrement,
      } as never,
    });

    openAuctions.push({ id: auction.id, vehicleKey: seed.vehicleKey });
  }

  return {
    draftAuction,
    scheduledAuction,
    activeAuction,
    pendingReviewAuction,
    unsoldAuction,
    completedAuction,
    canceledAuction,
    openAuctions,
  };
}

async function createBids(
  dealerA: { id: string },
  dealerB: { id: string },
  dealerC: { id: string },
  auctions: SeedAuctions,
): Promise<void> {
  const now = new Date();

  // Active auction — bids in chronological order
  await prisma.bid.create({
    data: {
      auctionId: auctions.activeAuction.id,
      dealerId: dealerC.id,
      amount: 26900,
      createdAt: new Date(now.getTime() - 2 * 60 * 60 * 1000),
    },
  });

  await prisma.bid.create({
    data: {
      auctionId: auctions.activeAuction.id,
      dealerId: dealerB.id,
      amount: 27250,
      createdAt: new Date(now.getTime() - 1 * 60 * 60 * 1000),
    },
  });

  await prisma.bid.create({
    data: {
      auctionId: auctions.activeAuction.id,
      dealerId: dealerA.id,
      amount: 27500,
      createdAt: new Date(now.getTime() - 30 * 60 * 1000),
    },
  });

  // Pending review auction — bids in chronological order
  await prisma.bid.create({
    data: {
      auctionId: auctions.pendingReviewAuction.id,
      dealerId: dealerB.id,
      amount: 21400,
      createdAt: new Date('2026-06-12T12:00:00'),
    },
  });

  await prisma.bid.create({
    data: {
      auctionId: auctions.pendingReviewAuction.id,
      dealerId: dealerC.id,
      amount: 22800,
      createdAt: new Date('2026-06-13T14:00:00'),
    },
  });

  await prisma.bid.create({
    data: {
      auctionId: auctions.pendingReviewAuction.id,
      dealerId: dealerB.id,
      amount: 23100,
      createdAt: new Date('2026-06-14T08:30:00'),
    },
  });

  // Completed (sold) auction — bids in chronological order
  await prisma.bid.create({
    data: {
      auctionId: auctions.completedAuction.id,
      dealerId: dealerB.id,
      amount: 17800,
      createdAt: new Date('2026-07-04T12:00:00'),
    },
  });

  const winningBid = await prisma.bid.create({
    data: {
      auctionId: auctions.completedAuction.id,
      dealerId: dealerA.id,
      amount: 18200,
      createdAt: new Date('2026-07-04T14:00:00'),
    },
  });

  await prisma.auction.update({
    where: { id: auctions.completedAuction.id },
    data: { winningBidId: winningBid.id },
  });

  // Canceled auction
  await prisma.bid.create({
    data: {
      auctionId: auctions.canceledAuction.id,
      dealerId: dealerB.id,
      amount: 17200,
      createdAt: new Date('2026-05-13T15:00:00'),
    },
  });

  const openLiveAuctionIds = new Map(
    auctions.openAuctions.map((auction) => [auction.vehicleKey, auction.id]),
  );

  const audi2LiveId = openLiveAuctionIds.get('audi2');
  if (audi2LiveId) {
    await prisma.bid.create({
      data: {
        auctionId: audi2LiveId,
        dealerId: dealerA.id,
        amount: 35200,
        createdAt: new Date(now.getTime() - 3 * 60 * 60 * 1000),
      },
    });

    await prisma.bid.create({
      data: {
        auctionId: audi2LiveId,
        dealerId: dealerC.id,
        amount: 35600,
        createdAt: new Date(now.getTime() - 90 * 60 * 1000),
      },
    });
  }

  const audi3LiveId = openLiveAuctionIds.get('audi3');
  if (audi3LiveId) {
    await prisma.bid.create({
      data: {
        auctionId: audi3LiveId,
        dealerId: dealerB.id,
        amount: 40100,
        createdAt: new Date(now.getTime() - 4 * 60 * 60 * 1000),
      },
    });
  }

  const ford1LiveId = openLiveAuctionIds.get('ford1');
  if (ford1LiveId) {
    await prisma.bid.create({
      data: {
        auctionId: ford1LiveId,
        dealerId: dealerA.id,
        amount: 41800,
        createdAt: new Date(now.getTime() - 2 * 60 * 60 * 1000),
      },
    });

    await prisma.bid.create({
      data: {
        auctionId: ford1LiveId,
        dealerId: dealerB.id,
        amount: 42300,
        createdAt: new Date(now.getTime() - 45 * 60 * 1000),
      },
    });

    await prisma.bid.create({
      data: {
        auctionId: ford1LiveId,
        dealerId: dealerC.id,
        amount: 42800,
        createdAt: new Date(now.getTime() - 15 * 60 * 1000),
      },
    });
  }
}

async function createAuctionsAndBids(vehicles: SeedVehicles): Promise<void> {
  const existingAuctions = await prisma.auction.count();

  if (existingAuctions > 0) {
    return;
  }

  const [dealerA, dealerB, dealerC] = await prisma.user.findMany({
    where: { role: Role.DEALER },
    orderBy: { email: 'asc' },
  });

  const auctions = await createAuctions(vehicles);
  await createBids(dealerA, dealerB, dealerC, auctions);
}

async function main() {
  await createUsers();
  const vehicles = await createVehicles();
  await createAuctionsAndBids(vehicles);

  console.log('Seed completed');
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
