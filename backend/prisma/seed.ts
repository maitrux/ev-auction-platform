import { AuctionResult, Role } from '@prisma/client';
import 'dotenv/config';
import { AuctionStatus } from '../src/common/constants/auction-status';
import { createPrismaClient } from '../src/prisma/create-prisma-client';

const prisma = createPrismaClient();

async function createUsers(): Promise<void> {
  await prisma.user.createMany({
    skipDuplicates: true,
    data: [
      {
        email: 'admin@aampere.com',
        passwordHash: 'password123',
        role: Role.ADMIN,
        name: 'Aampere Admin',
      },
      {
        email: 'dealer1@example.com',
        passwordHash: 'password123',
        role: Role.DEALER,
        name: 'Dealer One',
      },
      {
        email: 'dealer2@example.com',
        passwordHash: 'password123',
        role: Role.DEALER,
        name: 'Dealer Two',
      },
      {
        email: 'dealer3@example.com',
        passwordHash: 'password123',
        role: Role.DEALER,
        name: 'Dealer Three',
      },
    ],
  });
}

type SeedVehicles = {
  tesla: { id: string };
  vw: { id: string };
  renault: { id: string };
  bmw: { id: string };
  hyundai: { id: string };
  nissan: { id: string };
};

async function createVehicles(): Promise<SeedVehicles> {
  const tesla = await prisma.vehicle.upsert({
    where: { vin: '5YJ3E1EA7KF000001' },
    update: {},
    create: {
      vin: '5YJ3E1EA7KF000001',
      make: 'Tesla',
      model: 'Model 3',
      year: 2022,
      mileage: 45000,
      batteryCapacityKwh: 75,
      batterySoH: 91,
      rangeKm: 450,
      registrationDate: new Date('2022-05-01'),
      condition: 'GOOD',
      conditionNotes: 'Minor scratches on rear bumper.',
      photos: [
        'https://images.pexels.com/photos/10029878/pexels-photo-10029878.jpeg?_gl=1*1snfsm2*_ga*MTQyMzIyMDE3Ny4xNzg0MjE1NjE0*_ga_8JE65Q40S6*czE3ODQyMTU2MTMkbzEkZzEkdDE3ODQyMTYyMzAkajQxJGwwJGgw',
        'https://images.pexels.com/photos/34357079/pexels-photo-34357079.jpeg?_gl=1*je6623*_ga*MTQyMzIyMDE3Ny4xNzg0MjE1NjE0*_ga_8JE65Q40S6*czE3ODQyMTU2MTMkbzEkZzEkdDE3ODQyMTcxMzQkajUyJGwwJGgw',
        'https://images.pexels.com/photos/35387655/pexels-photo-35387655.jpeg?_gl=1*1jmza3t*_ga*MTQyMzIyMDE3Ny4xNzg0MjE1NjE0*_ga_8JE65Q40S6*czE3ODQyMjI1MzYkbzIkZzEkdDE3ODQyMjI3NTAkajUyJGwwJGgw',
      ],
      city: 'Munich',
      country: 'Germany',
    },
  });

  const vw = await prisma.vehicle.upsert({
    where: { vin: 'WVWZZZ1JZXW000002' },
    update: {},
    create: {
      vin: 'WVWZZZ1JZXW000002',
      make: 'Volkswagen',
      model: 'ID.3',
      year: 2021,
      mileage: 32000,
      batteryCapacityKwh: 58,
      batterySoH: 95,
      rangeKm: 420,
      registrationDate: new Date('2021-03-15'),
      condition: 'EXCELLENT',
      conditionNotes:
        'One previous owner. Regularly serviced at authorized dealer.',
      photos: [
        'https://images.pexels.com/photos/30373975/pexels-photo-30373975.jpeg?_gl=1*v376cg*_ga*MTQyMzIyMDE3Ny4xNzg0MjE1NjE0*_ga_8JE65Q40S6*czE3ODQyMjI1MzYkbzIkZzEkdDE3ODQyMjI3OTMkajkkbDAkaDA.',
      ],
      city: 'Berlin',
      country: 'Germany',
    },
  });

  const renault = await prisma.vehicle.upsert({
    where: { vin: 'VF1AG000000000003' },
    update: {},
    create: {
      vin: 'VF1AG000000000003',
      make: 'Renault',
      model: 'Zoe',
      year: 2020,
      mileage: 68000,
      batteryCapacityKwh: 52,
      batterySoH: 86,
      rangeKm: 395,
      registrationDate: new Date('2020-07-20'),
      condition: 'FAIR',
      conditionNotes: 'Visible wear on interior. Battery still performs well.',
      photos: [
        'https://images.pexels.com/photos/16634642/pexels-photo-16634642.jpeg?_gl=1*1euafyw*_ga*MTQyMzIyMDE3Ny4xNzg0MjE1NjE0*_ga_8JE65Q40S6*czE3ODQyMjI1MzYkbzIkZzEkdDE3ODQyMjI1ODQkajEyJGwwJGgw',
        'https://images.pexels.com/photos/15372518/pexels-photo-15372518.jpeg?_gl=1*es67b2*_ga*MTQyMzIyMDE3Ny4xNzg0MjE1NjE0*_ga_8JE65Q40S6*czE3ODQyMjI1MzYkbzIkZzEkdDE3ODQyMjI2MjUkajMzJGwwJGgw',
      ],
      city: 'Paris',
      country: 'France',
    },
  });

  const bmw = await prisma.vehicle.upsert({
    where: { vin: 'WBA00000000000004' },
    update: {},
    create: {
      vin: 'WBA00000000000004',
      make: 'BMW',
      model: 'i4',
      year: 2023,
      mileage: 12000,
      batteryCapacityKwh: 83,
      batterySoH: 98,
      rangeKm: 590,
      registrationDate: new Date('2023-01-10'),
      condition: 'EXCELLENT',
      photos: [
        'https://images.pexels.com/photos/17000825/pexels-photo-17000825.jpeg?_gl=1*1dy0aq1*_ga*MTQyMzIyMDE3Ny4xNzg0MjE1NjE0*_ga_8JE65Q40S6*czE3ODQyMTU2MTMkbzEkZzEkdDE3ODQyMTg1MTEkajQ0JGwwJGgw',
        'https://images.pexels.com/photos/17000828/pexels-photo-17000828.jpeg?_gl=1*pfsz4g*_ga*MTQyMzIyMDE3Ny4xNzg0MjE1NjE0*_ga_8JE65Q40S6*czE3ODQyMTU2MTMkbzEkZzEkdDE3ODQyMTg1ODUkajQ5JGwwJGgw',
      ],
      city: 'Hamburg',
      country: 'Germany',
    },
  });

  const hyundai = await prisma.vehicle.upsert({
    where: { vin: 'KMH00000000000005' },
    update: {},
    create: {
      vin: 'KMH00000000000005',
      make: 'Hyundai',
      model: 'Kona Electric',
      year: 2022,
      mileage: 28000,
      batteryCapacityKwh: 64,
      batterySoH: 94,
      rangeKm: 470,
      registrationDate: new Date('2022-09-12'),
      condition: 'GOOD',
      photos: [
        'https://images.pexels.com/photos/33128503/pexels-photo-33128503.jpeg?_gl=1*tcppwj*_ga*MTQyMzIyMDE3Ny4xNzg0MjE1NjE0*_ga_8JE65Q40S6*czE3ODQyMjI1MzYkbzIkZzEkdDE3ODQyMjI2OTQkajI1JGwwJGgw',
      ],
      city: 'Cologne',
      country: 'Germany',
    },
  });

  const nissan = await prisma.vehicle.upsert({
    where: { vin: 'JN100000000000006' },
    update: {},
    create: {
      vin: 'JN100000000000006',
      make: 'Nissan',
      model: 'Leaf',
      year: 2021,
      mileage: 51000,
      batteryCapacityKwh: 62,
      batterySoH: 89,
      rangeKm: 360,
      registrationDate: new Date('2021-04-08'),
      condition: 'GOOD',
      photos: [
        'https://images.pexels.com/photos/19896350/pexels-photo-19896350.jpeg?_gl=1*azsd5u*_ga*MTQyMzIyMDE3Ny4xNzg0MjE1NjE0*_ga_8JE65Q40S6*czE3ODQyMjI1MzYkbzIkZzEkdDE3ODQyMjI4NDUkajQ3JGwwJGgw',
        'https://images.pexels.com/photos/33501918/pexels-photo-33501918.jpeg?_gl=1*rsmfct*_ga*MTQyMzIyMDE3Ny4xNzg0MjE1NjE0*_ga_8JE65Q40S6*czE3ODQyMjI1MzYkbzIkZzEkdDE3ODQyMjI4NjkkajIzJGwwJGgw',
      ],
      city: 'Frankfurt',
      country: 'Germany',
    },
  });

  return { tesla, vw, renault, bmw, hyundai, nissan };
}

type SeedAuctions = {
  draftAuction: { id: string };
  scheduledAuction: { id: string };
  activeAuction: { id: string };
  pendingReviewAuction: { id: string };
  unsoldAuction: { id: string };
  completedAuction: { id: string };
  cancelledAuction: { id: string };
};

async function createAuctions(vehicles: SeedVehicles): Promise<SeedAuctions> {
  const now = new Date();

  const activeStart = new Date(now);
  activeStart.setDate(activeStart.getDate() - 1);
  const activeEnd = new Date(now);
  activeEnd.setDate(activeEnd.getDate() + 3);

  const scheduledStart = new Date(now);
  scheduledStart.setDate(scheduledStart.getDate() + 5);
  const scheduledEnd = new Date(scheduledStart);
  scheduledEnd.setDate(scheduledEnd.getDate() + 3);

  const pendingReviewStart = new Date('2026-06-10T10:00:00');
  const pendingReviewEnd = new Date('2026-06-14T10:00:00');
  const completedStart = new Date('2026-07-01T10:00:00');
  const completedEnd = new Date('2026-07-05T10:00:00');

  const draftAuction = await prisma.auction.create({
    data: {
      vehicleId: vehicles.vw.id,
    } as never,
  });

  const scheduledAuction = await prisma.auction.create({
    data: {
      vehicleId: vehicles.bmw.id,
      status: AuctionStatus.SCHEDULED,
      startsAt: scheduledStart,
      endsAt: scheduledEnd,
      reservePrice: 42000,
      minIncrement: 500,
    } as never,
  });

  const activeAuction = await prisma.auction.create({
    data: {
      vehicleId: vehicles.tesla.id,
      status: AuctionStatus.LIVE,
      startsAt: activeStart,
      endsAt: activeEnd,
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

  const cancelledAuction = await prisma.auction.create({
    data: {
      vehicleId: vehicles.hyundai.id,
      status: AuctionStatus.CANCELLED,
      startsAt: new Date('2026-06-20T10:00:00'),
      endsAt: new Date('2026-06-23T10:00:00'),
      reservePrice: 27000,
      minIncrement: 250,
    } as never,
  });

  return {
    draftAuction,
    scheduledAuction,
    activeAuction,
    pendingReviewAuction,
    unsoldAuction,
    completedAuction,
    cancelledAuction,
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

  // Cancelled auction
  await prisma.bid.create({
    data: {
      auctionId: auctions.cancelledAuction.id,
      dealerId: dealerB.id,
      amount: 17200,
      createdAt: new Date('2026-05-13T15:00:00'),
    },
  });
}

async function createAuctionsAndBids(): Promise<void> {
  const existingAuctions = await prisma.auction.count();

  if (existingAuctions > 0) {
    return;
  }

  const [dealerA, dealerB, dealerC] = await prisma.user.findMany({
    where: { role: Role.DEALER },
    orderBy: { email: 'asc' },
  });

  const vehicles = await createVehicles();
  const auctions = await createAuctions(vehicles);
  await createBids(dealerA, dealerB, dealerC, auctions);
}

async function main() {
  await createUsers();
  await createAuctionsAndBids();

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
