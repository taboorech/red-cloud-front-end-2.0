import { createApi } from "@reduxjs/toolkit/query/react";
import { axiosBaseQuery } from "../../api/axios-base-query";
import type {
  User,
  ProfileResponse,
  UpdateProfileRequest,
  ChangePasswordRequest,
} from "../../types/user.types";

export const profileApi = createApi({
  reducerPath: "profileApi",
  baseQuery: axiosBaseQuery(),
  tagTypes: ["Profile"],
  endpoints: (builder) => ({
    getProfile: builder.query<User, void>({
      query: () => ({
        url: "/v1/profile",
        method: "GET",
      }),
      transformResponse: (response: ProfileResponse) => response.data,
      providesTags: ["Profile"],
    }),
    updateProfile: builder.mutation<User, UpdateProfileRequest>({
      query: (body) => {
        const formData = new FormData();
        if (body.username) formData.append("username", body.username);
        if (body.email) formData.append("email", body.email);
        if (body.avatar instanceof File) formData.append("avatar", body.avatar);

        return {
          url: "/v1/profile",
          method: "PUT",
          data: formData,
        };
      },
      transformResponse: (response: ProfileResponse) => response.data,
      invalidatesTags: ["Profile"],
    }),
    changePassword: builder.mutation<void, ChangePasswordRequest>({
      query: (body) => ({
        url: "/v1/profile/password",
        method: "PUT",
        data: body,
      }),
    }),
  }),
});

export const {
  useGetProfileQuery,
  useUpdateProfileMutation,
  useChangePasswordMutation,
} = profileApi;