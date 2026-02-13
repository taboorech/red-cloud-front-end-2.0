import type { Song } from "./song.types";
import type { User } from "./user.types";
import type { Playlist } from "./playlist.types";

export const SearchType = {
  ALL: "all",
  SONGS: "songs",
  USERS: "users",
  PLAYLISTS: "playlists",
} as const;

export type SearchType = typeof SearchType[keyof typeof SearchType];

export interface SearchRequest {
  query: string;
  type?: SearchType;
}

export interface SearchResults {
  songs: Song[];
  users: User[];
  playlists: Playlist[];
}

export interface SearchResponse {
  data: SearchResults;
}
