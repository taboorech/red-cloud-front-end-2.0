import { z } from "zod";
import { SongAuthorsRole } from "../types/song.types";

const genreSchema = z.array(
  z.object({
    id: z.number().int().positive("Genre ID must be a positive integer"),
    title: z.string().min(1, "Genre title is required"),
  }),
);

const userIdValidation = z.object({
  userId: z.number().int().positive("User ID must be a positive integer"),
  name: z.string().min(1, "User name is required"),
});

export const songSchema = z.object({
  title: z.string().min(1, "Title is required").max(255, "Title is too long"),
  description: z.string().optional(),
  text: z.string().optional(),
  language: z.string().optional(),
  duration: z.number().int().positive("Duration must be a positive number"),
  releaseYear: z
    .number()
    .int()
    .positive("Release year must be positive")
    .optional(),
  isPublic: z.boolean().optional(),
  genres: genreSchema.optional(),
  authors: z
    .array(
      z
        .object({
          role: z.enum(Object.values(SongAuthorsRole) as [string, ...string[]]),
        })
        .extend(userIdValidation.shape),
    )
    .optional(),
});

export type SongSchemaType = z.infer<typeof songSchema>;
