export const UserRole = {
  USER: 'user',
  OPERATOR: 'operator',
  ADMIN: 'admin',
} as const;

export type UserRole = (typeof UserRole)[keyof typeof UserRole];

export interface UserBan {
  id: string;
  user_id: string;
  reason: string;
  is_banned: boolean;
  banned_at: string | null;
}

export interface User {
  id: number;
  username: string;
  email: string;
  avatar?: string;
  login: string;
  role?: string;
  country?: string;
  userBans?: UserBan[];
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