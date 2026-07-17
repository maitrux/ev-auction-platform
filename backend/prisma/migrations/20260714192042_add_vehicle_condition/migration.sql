/*
  Warnings:

  - You are about to drop the column `batteryCapacity` on the `Vehicle` table. All the data in the column will be lost.
  - You are about to drop the column `range` on the `Vehicle` table. All the data in the column will be lost.
  - Added the required column `batteryCapacityKwh` to the `Vehicle` table without a default value. This is not possible if the table is not empty.
  - Added the required column `condition` to the `Vehicle` table without a default value. This is not possible if the table is not empty.
  - Added the required column `rangeKm` to the `Vehicle` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Vehicle` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "VehicleCondition" AS ENUM ('EXCELLENT', 'GOOD', 'FAIR', 'POOR');

-- AlterTable
ALTER TABLE "Vehicle" DROP COLUMN "batteryCapacity",
DROP COLUMN "range",
ADD COLUMN     "batteryCapacityKwh" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "condition" "VehicleCondition" NOT NULL,
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "rangeKm" INTEGER NOT NULL,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;
