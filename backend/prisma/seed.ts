import { Role } from '@prisma/client';
import 'dotenv/config';
import { createPrismaClient } from '../src/prisma/create-prisma-client';

const prisma = createPrismaClient();

async function createUsers(): Promise<void> {
  await prisma.user.createMany({
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
    ],
  });
}

async function createVehicles(): Promise<void> {
  await prisma.vehicle.createMany({
    data: [
      {
        vin: '5YJ3E1EA7KF000001',
        make: 'Tesla',
        model: 'Model 3',
        year: 2022,
        mileage: 45000,

        batteryCapacityKwh: 75,
        batterySoH: 92,
        rangeKm: 450,

        registrationDate: new Date('2022-05-01'),

        condition: 'GOOD',
        conditionNotes: 'Minor scratches on rear bumper.',

        photos: [],

        city: 'Munich',
        country: 'Germany',
      },
      {
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
      {
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
        conditionNotes:
          'Visible wear on interior. Battery still performs well.',

        photos: [],

        city: 'Paris',
        country: 'France',
      },
    ],
  });
}

async function main() {
  await createUsers();
  await createVehicles();

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
