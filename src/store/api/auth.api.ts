import { createApi } from "@reduxjs/toolkit/query/react";
import { axiosBaseQuery } from "../../api/axios-base-query";
import type {
  LoginRequest,
  SignUpRequest,
  AuthResponse,
  GoogleAuthUrlResponse,
  RefreshResponse,
} from "../../types/auth.types";

export const authApi = createApi({
  reducerPath: "authApi",
  baseQuery: axiosBaseQuery(),
  endpoints: (builder) => ({
    login: builder.mutation<AuthResponse["data"], LoginRequest>({
      query: (body) => ({
        url: "/v1/auth/login",
        method: "POST",
        data: body,
      }),
      transformResponse: (response: AuthResponse) => response.data,
    }),

    signUp: builder.mutation<AuthResponse["data"], SignUpRequest>({
      query: (body) => ({
        url: "/v1/auth/signup",
        method: "POST",
        data: body,
      }),
      transformResponse: (response: AuthResponse) => response.data,
    }),

    getGoogleAuthUrl: builder.query<string, void>({
      query: () => ({
        url: "/v1/auth/connection-link",
        method: "GET",
      }),
      transformResponse: (response: GoogleAuthUrlResponse) => response.data,
    }),

    refreshTokens: builder.mutation<RefreshResponse["data"], void>({
      query: () => ({
        url: "/v1/auth/refresh",
        method: "GET",
      }),
      transformResponse: (response: RefreshResponse) => response.data,
    }),

    logout: builder.mutation<void, void>({
      query: () => ({
        url: "/v1/auth/logout",
        method: "GET",
      }),
    }),
  }),
});

export const {
  useLoginMutation,
  useSignUpMutation,
  useLazyGetGoogleAuthUrlQuery,
  useRefreshTokensMutation,
  useLogoutMutation,
} = authApi;
