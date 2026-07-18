import { z } from 'zod';

/** ISO date-time or date strings, for OpenAPI documentation only. */
export const openapiDateSchema = z.union([z.iso.datetime(), z.iso.date()]);
