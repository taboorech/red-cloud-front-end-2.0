export interface GeneratePlaylistCoverParams {
  playlistId: string;
  prompt?: string;
}

export interface GeneratePlaylistCoverResponse {
  data: string;
}

export interface GenerateImageParams {
  prompt: string;
}

export interface GenerateImageResponse {
  data: {
    imageUrl: string;
  };
}

export interface GenerateLyricsParams {
  audioFile?: File;
  songId?: string;
  model?: string;
}

export interface GenerateLyricsResponse {
  data: string;
}

export interface AdminAIActivityParams {
  contentType?: string;
  startDate?: string;
  endDate?: string;
  limit?: number;
  offset?: number;
}

export interface AIActivityMetadata {
  objectId?: string;
  model: string;
  provider: string;
  prompt?: string;
  audioSource?: string;
  textLength?: number;
}

export interface AIActivity {
  id: number;
  user_id: number;
  content_type: string;
  result?: string;
  input_tokens?: number;
  output_tokens?: number;
  cost?: number;
  metadata?: AIActivityMetadata;
  created_at: string;
  updated_at: string;
  user?: {
    id: number;
    username: string;
    email: string;
    avatar?: string;
  };
}

export interface AIUserStats {
  userId: number;
  totalCost: number;
  totalTokens: { input: number; output: number };
  activityCount: number;
}

export interface AITotalStats {
  totalCost: number;
  totalTokens: { input: number; output: number };
  totalActivities: number;
  totalUsers: number;
}

export interface AdminAIActivityResponse {
  data: {
    activities: AIActivity[];
    userStats: AIUserStats[];
    totalStats: AITotalStats;
    total: number;
  };
}
