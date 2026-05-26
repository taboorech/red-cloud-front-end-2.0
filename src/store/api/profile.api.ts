import { createApi } from "@reduxjs/toolkit/query/react";
import { axiosBaseQuery } from "../../api/axios-base-query";
import type {
  User,
  ProfileResponse,
  UpdateProfileRequest,
  ChangePasswordRequest,
  ProfileStats,
  ProfileStatsResponse,
} from "../../types/user.types";
import type {
  PrivacySettings,
  UpdatePrivacyRequest,
  ExclusionMutationArgs,
} from "../../types/privacy.types";

export const profileApi = createApi({
  reducerPath: "profileApi",
  baseQuery: axiosBaseQuery(),
  tagTypes: ["Profile", "Privacy"],
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
    getProfileStats: builder.query<ProfileStats, void>({
      query: () => ({
        url: "/v1/profile/stats",
        method: "GET",
      }),
      transformResponse: (response: ProfileStatsResponse) => response.data,
      providesTags: ["Profile"],
    }),
    getPrivacy: builder.query<PrivacySettings, void>({
      query: () => ({
        url: "/v1/profile/privacy",
        method: "GET",
      }),
      transformResponse: (response: { data: PrivacySettings }) => response.data,
      providesTags: ["Privacy"],
    }),
    updatePrivacy: builder.mutation<
      Pick<PrivacySettings, "listening_visibility" | "presence_visibility">,
      UpdatePrivacyRequest
    >({
      query: (body) => ({
        url: "/v1/profile/privacy",
        method: "PATCH",
        data: body,
      }),
      transformResponse: (response: {
        data: Pick<PrivacySettings, "listening_visibility" | "presence_visibility">;
      }) => response.data,
      async onQueryStarted(patch, { dispatch, queryFulfilled }) {
        const patchResult = dispatch(
          profileApi.util.updateQueryData("getPrivacy", undefined, (draft) => {
            Object.assign(draft, patch);
          }),
        );
        try {
          await queryFulfilled;
        } catch {
          patchResult.undo();
        }
      },
      invalidatesTags: ["Privacy"],
    }),
    hideActivityFrom: builder.mutation<void, ExclusionMutationArgs>({
      query: ({ friendId, scope }) => ({
        url: `/v1/profile/privacy/hide-from/${scope}/${friendId}`,
        method: "POST",
      }),
      async onQueryStarted({ friendId, scope }, { dispatch, queryFulfilled }) {
        const key =
          scope === "presence"
            ? "hidden_presence_user_ids"
            : "hidden_listening_user_ids";
        const patchResult = dispatch(
          profileApi.util.updateQueryData("getPrivacy", undefined, (draft) => {
            if (!draft[key].includes(friendId)) draft[key].push(friendId);
          }),
        );
        try {
          await queryFulfilled;
        } catch {
          patchResult.undo();
        }
      },
      invalidatesTags: ["Privacy"],
    }),
    unhideActivityFrom: builder.mutation<void, ExclusionMutationArgs>({
      query: ({ friendId, scope }) => ({
        url: `/v1/profile/privacy/hide-from/${scope}/${friendId}`,
        method: "DELETE",
      }),
      async onQueryStarted({ friendId, scope }, { dispatch, queryFulfilled }) {
        const key =
          scope === "presence"
            ? "hidden_presence_user_ids"
            : "hidden_listening_user_ids";
        const patchResult = dispatch(
          profileApi.util.updateQueryData("getPrivacy", undefined, (draft) => {
            draft[key] = draft[key].filter((id) => id !== friendId);
          }),
        );
        try {
          await queryFulfilled;
        } catch {
          patchResult.undo();
        }
      },
      invalidatesTags: ["Privacy"],
    }),
  }),
});

export const {
  useGetProfileQuery,
  useUpdateProfileMutation,
  useChangePasswordMutation,
  useGetProfileStatsQuery,
  useGetPrivacyQuery,
  useUpdatePrivacyMutation,
  useHideActivityFromMutation,
  useUnhideActivityFromMutation,
} = profileApi;