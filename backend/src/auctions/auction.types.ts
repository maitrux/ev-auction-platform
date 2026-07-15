import { Prisma } from '@prisma/client';

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

export type AuctionDetailRecord = Prisma.AuctionGetPayload<{
  include: typeof auctionDetailInclude;
}>;
