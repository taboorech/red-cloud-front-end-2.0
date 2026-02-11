import type { User } from "./user.types";

export interface Friend extends User {
  isOnline?: boolean;
  lastSeen?: string;
}

export interface Friendship {
  id: number;
  user_id: number;
  friend_id: number;
  status: 'pending' | 'accepted' | 'blocked';
  created_at: string;
  updated_at: string;
  friend: Friend;
}

export interface FriendsOnlineListData {
  friends: Friend[];
  timestamp: string;
}

export interface FriendsResponse {
  status: string;
  data: Friendship[];
}

export interface AddFriendResponse {
  status: string;
}

export interface AcceptFriendRequestResponse {
  status: string;
}

export interface RemoveFriendResponse {
  status: string;
}
