"use server";

import type { CreateVehicleInput } from "@/types";
import { createVehicle, type CreateVehicleResult } from "./vehicles";

export async function createVehicleAction(
  data: CreateVehicleInput,
): Promise<CreateVehicleResult> {
  return createVehicle(data);
}
