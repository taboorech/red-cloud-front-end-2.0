import { createApi } from "@reduxjs/toolkit/query/react";
import { axiosBaseQuery } from "../../api/axios-base-query";
import type { Song, GetSongsResponse } from "../../types/song.types";
import type { GetRecommendationsParams } from "../../types/recommendation.types";

export const recommendationApi = createApi({
  reducerPath: "recommendationApi",
  baseQuery: axiosBaseQuery(),
  endpoints: (builder) => ({
    getRecommendations: builder.query<Song[], GetRecommendationsParams>({
      query: ({ strategy = "mixed", limit = 20, offset = 0 } = {}) => ({
        url: "/v1/recommendations",
        method: "GET",
        params: { strategy, limit, offset },
      }),
      transformResponse: (response: GetSongsResponse) => response.data,
    }),
  }),
});

export const { useGetRecommendationsQuery } = recommendationApi;
