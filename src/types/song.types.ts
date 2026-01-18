import type { Genre } from "./genre.types";

interface SongMetadata {
  release_year?: number;
}

export interface Song {
  id: string;
  title: string;
  description?: string;
  text?: string;
  language?: string;
  duration_seconds: number;
  url: string;
  image_url?: string;
  metadata?: SongMetadata;
  is_public: boolean;
  authors?: SongAuthor[];
  genres?: Genre[];
  likes_count?: number;
  dislikes_count?: number;
  is_favorite?: boolean;
  created_at: string;
  updated_at: string;
}

export interface CreateSongResponse {
  success: boolean;
  data: Song;
  message: string;
}

export interface UpdateSongResponse {
  success: boolean;
  data: Song;
  message: string;
}

export interface GetSongResponse {
  success: boolean;
  data: Song;
}

export interface GetSongsResponse {
  success: boolean;
  data: {
    songs: Song[];
    total: number;
    page: number;
    limit: number;
  };
}

export interface DeleteSongResponse {
  success: boolean;
  message: string;
}

export const SongAuthorsRole = {
  Singer: "singer",
  Composer: "composer", 
  Lyricist: "lyricist",
  Producer: "producer",
  Other: "other",
} as const;

export type SongAuthorsRole = typeof SongAuthorsRole[keyof typeof SongAuthorsRole];

export interface User {
  id: string;
  username: string;
  email: string;
  avatar?: string;
}

export interface SongAuthor {
  role: SongAuthorsRole;
  user_id: string;
  name: string;
  user?: User;
}

export interface SongFormValues {
  title: string;
  description: string;
  text: string;
  language: string;
  duration: number | "";
  releaseYear: number | "";
  isPublic: boolean;
  genres: Genre[];
  authors: SongAuthor[];
  image: File | string | null;
  song: File | string | null;
}

export interface Language {
  code: string;
  name: string;
  nativeName: string;
}