import { Prisma } from '@prisma/client';

export const dealerAuctionListInclude = {
  vehicle: {
    select: {
      make: true,
      model: true,
      year: true,
      photos: true,
      city: true,
      country: true,
      mileage: true,
    },
  },
} satisfies Prisma.AuctionInclude;

export const auctionListInclude = {
  vehicle: {
    select: {
      make: true,
      model: true,
      year: true,
    },
  },
  bids: {
    orderBy: { amount: 'desc' as const },
    take: 1,
    include: {
      dealer: {
        select: { name: true },
      },
    },
  },
  _count: {
    select: { bids: true },
  },
} satisfies Prisma.AuctionInclude;

export const auctionDetailInclude = {
  vehicle: true,
  bids: {
    orderBy: { createdAt: 'desc' as const },
    include: {
      dealer: {
        select: { name: true },
      },
    },
  },
  winningBid: {
    include: {
      dealer: {
        select: { name: true },
      },
    },
  },
  _count: {
    select: { bids: true },
  },
} satisfies Prisma.AuctionInclude;

export type AuctionListRecord = Prisma.AuctionGetPayload<{
  include: typeof auctionListInclude;
}>;

export type DealerAuctionListRecord = Prisma.AuctionGetPayload<{
  include: typeof dealerAuctionListInclude;
}>;

export const dealerAuctionDetailInclude = {
  vehicle: true,
  bids: {
    select: {
      id: true,
      amount: true,
      createdAt: true,
      dealerId: true,
    },
    orderBy: { createdAt: 'desc' as const },
  },
} satisfies Prisma.AuctionInclude;

export type DealerAuctionDetailRecord = Prisma.AuctionGetPayload<{
  include: typeof dealerAuctionDetailInclude;
}>;

export type AuctionDetailRecord = Prisma.AuctionGetPayload<{
  include: typeof auctionDetailInclude;
}>;
