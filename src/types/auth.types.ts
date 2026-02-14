export interface LoginRequest {
  email: string;
  password: string;
}

export interface SignUpRequest {
  email: string;
  username: string;
  login: string;
  phone: string;
  password: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface AuthResponse {
  data: AuthTokens;
}

export interface GoogleAuthUrlResponse {
  data: string;
}

export interface RefreshResponse {
  data: AuthTokens;
}
