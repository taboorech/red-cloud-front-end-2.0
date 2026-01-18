import type { SearchRequestParams } from "./main.types";

export interface GetPlaylistsRequest extends SearchRequestParams {}

export interface GetPlaylistsResponse {
  data: Playlist[];
}

interface Playlist {
  id: number;
  title: string;
  image_url?: string;
  owner_id: number;
  is_public: boolean;
  created_at: string;
  updated_at: string;
}