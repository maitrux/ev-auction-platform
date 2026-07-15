import { AuctionResult, Role } from '@prisma/client';
import { AuctionStatus } from '../src/common/constants/auction-status';
import 'dotenv/config';
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

async function createAuctionsAndBids(): Promise<void> {
  const existingAuctions = await prisma.auction.count();

  if (existingAuctions > 0) {
    return;
  }

  const dealers = await prisma.user.findMany({
    where: { role: Role.DEALER },
    orderBy: { email: 'asc' },
  });

  const [dealerA, dealerB, dealerC] = dealers;

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
      photos: [],
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
      photos: [],
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
      photos: [],
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
      photos: [],
      city: 'Hamburg',
      country: 'Germany',
    },
  });

  const now = new Date();
  const activeStart = new Date(now);
  activeStart.setDate(activeStart.getDate() - 1);
  const activeEnd = new Date(now);
  activeEnd.setDate(activeEnd.getDate() + 3);

  const scheduledStart = new Date(now);
  scheduledStart.setDate(scheduledStart.getDate() + 5);
  const scheduledEnd = new Date(scheduledStart);
  scheduledEnd.setDate(scheduledEnd.getDate() + 3);

  const completedStart = new Date('2026-07-01T10:00:00');
  const completedEnd = new Date('2026-07-05T10:00:00');

  const activeAuction = await prisma.auction.create({
    data: {
      vehicleId: tesla.id,
      status: AuctionStatus.ACTIVE,
      startsAt: activeStart,
      endsAt: activeEnd,
      reservePrice: 25000,
      minIncrement: 250,
    } as never,
  });

  await prisma.auction.create({
    data: {
      vehicleId: vw.id,
    } as never,
  });

  await prisma.auction.create({
    data: {
      vehicleId: bmw.id,
      status: AuctionStatus.SCHEDULED,
      startsAt: scheduledStart,
      endsAt: scheduledEnd,
      reservePrice: 42000,
      minIncrement: 500,
    } as never,
  });

  const completedAuction = await prisma.auction.create({
    data: {
      vehicleId: renault.id,
      status: AuctionStatus.COMPLETED,
      startsAt: completedStart,
      endsAt: completedEnd,
      reservePrice: 15000,
      minIncrement: 200,
      result: AuctionResult.SOLD,
    } as never,
  });

  await prisma.bid.create({
    data: {
      auctionId: activeAuction.id,
      dealerId: dealerC.id,
      amount: 26900,
      createdAt: new Date(now.getTime() - 2 * 60 * 60 * 1000),
    },
  });

  await prisma.bid.create({
    data: {
      auctionId: activeAuction.id,
      dealerId: dealerB.id,
      amount: 27250,
      createdAt: new Date(now.getTime() - 1 * 60 * 60 * 1000),
    },
  });

  await prisma.bid.create({
    data: {
      auctionId: activeAuction.id,
      dealerId: dealerA.id,
      amount: 27500,
      createdAt: new Date(now.getTime() - 30 * 60 * 1000),
    },
  });

  const winningBid = await prisma.bid.create({
    data: {
      auctionId: completedAuction.id,
      dealerId: dealerA.id,
      amount: 18200,
      createdAt: new Date('2026-07-04T14:00:00'),
    },
  });

  await prisma.bid.create({
    data: {
      auctionId: completedAuction.id,
      dealerId: dealerB.id,
      amount: 17800,
      createdAt: new Date('2026-07-04T12:00:00'),
    },
  });

  await prisma.auction.update({
    where: { id: completedAuction.id },
    data: { winningBidId: winningBid.id },
  });
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
