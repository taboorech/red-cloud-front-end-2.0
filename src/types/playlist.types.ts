import type { SearchRequestParams } from "./main.types";
import type { Song } from "./song.types";

export interface GetPlaylistsRequest extends SearchRequestParams {}

export interface GetPlaylistsResponse {
  data: Playlist[];
}

export interface Playlist {
  id: number;
  title: string;
  image_url?: string;
  owner_id: number;
  is_public: boolean;
  created_at: string;
  updated_at: string;
  songs?: Song[];
}

export type PlaylistFormValues = {
  title: string;
  isPublic: boolean;
  image?: File | string | null;
};