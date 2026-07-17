import { z } from 'zod';

export const createBidSchema = z.object({
  auctionId: z.uuid(),
  amount: z.number().positive(),
});

export type CreateBidInput = z.infer<typeof createBidSchema>;
