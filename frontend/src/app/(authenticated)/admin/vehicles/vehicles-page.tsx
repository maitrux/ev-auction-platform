"use client";

import type { Vehicle } from "@/types";
import { useState } from "react";
import { AddVehicleDialog } from "./add-vehicle-dialog";
import { VehiclesTable } from "./vehicles-table";

interface VehiclesPageProps {
  vehicles: Vehicle[];
  error: string | null;
}

export function VehiclesPage({ vehicles, error }: VehiclesPageProps) {
  const [dialogOpen, setDialogOpen] = useState(false);

  return (
    <>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Vehicles</h1>

        {!error && (
          <button
            type="button"
            onClick={() => setDialogOpen(true)}
            className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
          >
            Add vehicle
          </button>
        )}
      </div>

      {error && (
        <div
          className="mb-4 rounded bg-red-100 p-3 text-sm text-red-700"
          role="alert"
        >
          {error}
        </div>
      )}

      {!error && <VehiclesTable vehicles={vehicles} />}

      <AddVehicleDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
      />
    </>
  );
}
