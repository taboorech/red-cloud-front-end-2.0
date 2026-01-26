import { z as zod } from 'zod';

export const playlistSchema = zod.object({
  title: zod
    .string()
    .min(1, 'Title is required')
    .min(2, 'Title must be at least 2 characters')
    .max(100, 'Title must be less than 100 characters'),
  isPublic: zod.boolean().default(true),
  image: zod.union([
    zod.instanceof(File),
    zod.url().nullable(),
    zod.null()
  ]).optional(),
});
