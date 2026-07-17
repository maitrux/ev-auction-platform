/*
  Warnings:

  - Added the required column `updatedAt` to the `Auction` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "AuctionStatus" AS ENUM ('DRAFT', 'SCHEDULED', 'LIVE', 'ENDED', 'CANCELED');

-- AlterTable
ALTER TABLE "Auction" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "status" "AuctionStatus" NOT NULL DEFAULT 'DRAFT',
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
ALTER COLUMN "startsAt" DROP NOT NULL,
ALTER COLUMN "endsAt" DROP NOT NULL,
ALTER COLUMN "reservePrice" DROP NOT NULL,
ALTER COLUMN "minIncrement" DROP NOT NULL;
