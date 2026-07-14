import { PrismaPg } from '@prisma/adapter-pg';
import type { SqlMigrationAwareDriverAdapterFactory } from '@prisma/driver-adapter-utils';
import { PrismaClient } from '@prisma/client';

type PrismaClientOptions = NonNullable<
  ConstructorParameters<typeof PrismaClient>[0]
>;

type PrismaPgConstructor = new (config: {
  connectionString: string;
}) => SqlMigrationAwareDriverAdapterFactory;

function getDatabaseUrl(): string {
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) {
    throw new Error('DATABASE_URL is not set');
  }

  return databaseUrl;
}

function createPgAdapter(
  databaseUrl: string,
): SqlMigrationAwareDriverAdapterFactory {
  const Adapter = PrismaPg as unknown as PrismaPgConstructor;
  return new Adapter({ connectionString: databaseUrl });
}

export function createPrismaClient(): PrismaClient {
  const options: PrismaClientOptions = {
    adapter: createPgAdapter(getDatabaseUrl()),
  };

  return new PrismaClient(options);
}
