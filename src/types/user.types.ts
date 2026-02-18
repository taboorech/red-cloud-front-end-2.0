export interface User {
  id: number;
  username: string;
  email: string;
  avatar?: string;
  login: string;
}

export interface ProfileResponse {
  data: User;
}

export interface UpdateProfileRequest {
  username?: string;
  email?: string;
  avatar?: File | string | null;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  password: string;
}

export interface ProfileStats {
  likedCount: number;
  dislikedCount: number;
  listeningsCount: number;
  playlistsCount: number;
}

export interface ProfileStatsResponse {
  data: ProfileStats;
}