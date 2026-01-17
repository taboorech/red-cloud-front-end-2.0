export interface Song {
  id: string;
  title: string;
  artist: string;
  album?: string;
  duration: number;
  genre?: string;
  year?: number;
  imageUrl?: string;
  audioUrl: string;
  isLiked: boolean;
  isFavorite: boolean;
  likesCount: number;
  dislikesCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateSongRequest {
  title: string;
  artist: string;
  album?: string;
  genre?: string;
  year?: number;
  song: File;
  image?: File;
}

export interface UpdateSongRequest {
  title?: string;
  artist?: string;
  album?: string;
  genre?: string;
  year?: number;
  image?: File;
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
  userId: string;
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
  genres: string[];
  authors: SongAuthor[];
  coverImage: File | string | null;
}

export interface Language {
  code: string;
  name: string;
  nativeName: string;
}