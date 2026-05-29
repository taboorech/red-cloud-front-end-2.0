export const UserRole = {
  USER: 'user',
  OPERATOR: 'operator',
  ADMIN: 'admin',
  OWNER: 'owner',
} as const;

export type UserRole = (typeof UserRole)[keyof typeof UserRole];

export const ASSIGNABLE_USER_ROLES = [
  UserRole.USER,
  UserRole.OPERATOR,
  UserRole.ADMIN,
] as const;

export interface UserBan {
  id: string;
  user_id: string;
  reason: string;
  is_banned: boolean;
  banned_at: string | null;
}

export interface UserSubscriptionSummary {
  plan_id: number;
  plan_title: string | null;
  expires_at?: string | null;
  status?: string;
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
  subscription?: UserSubscriptionSummary;
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