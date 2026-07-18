export const createAuctionWithVehicleExample = {
  saveAsDraft: true,
  vehicle: {
    vin: 'WVWZZZE1ZPP012345',
    make: 'Volkswagen',
    model: 'ID.3 Pro',
    year: 2023,
    mileageKm: 28500,
    batteryCapacityKwh: 58,
    batterySoH: 96,
    rangeKm: 420,
    registrationDate: '2023-05-12',
    condition: 'GOOD',
    conditionNotes:
      'Minor scratches on the rear bumper. Interior is clean and battery diagnostics show normal degradation.',
    photos: [
      'https://images.pexels.com/photos/9799740/pexels-photo-9799740.jpeg',
    ],
    city: 'Munich',
    country: 'Germany',
  },
  auction: {
    startsAt: '2026-07-20T09:00:00.000Z',
    endsAt: '2026-07-21T09:00:00.000Z',
    reservePrice: 18500,
    minIncrement: 250,
  },
} as const;

export const updateAuctionPublishExample = {
  publish: true,
  startsAt: '2026-07-20T09:00:00.000Z',
  endsAt: '2026-07-21T09:00:00.000Z',
  reservePrice: 18500,
  minIncrement: 250,
} as const;

export const updateAuctionCancelExample = {
  status: 'CANCELED',
} as const;

export const createBidExample = {
  auctionId: '00000000-0000-0000-0000-000000000001',
  amount: 19000,
} as const;
