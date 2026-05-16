import type { User } from "./user.types";
import type { Song } from "./song.types";

export interface FriendListening {
  userId: number;
  song: Song;
  currentTime: number;
  duration: number;
  isPlaying: boolean;
  updatedAt: number;
}

export interface SocketFriend {
  userId: number; 
  status: string; 
  timestamp: string
}

export interface Friend extends User {
  isOnline?: boolean;
  lastSeen?: string;
  listening?: FriendListening;
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
