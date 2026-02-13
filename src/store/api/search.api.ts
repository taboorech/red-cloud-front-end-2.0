import { createApi } from "@reduxjs/toolkit/query/react";
import { axiosBaseQuery } from "../../api/axios-base-query";
import type {
  SearchRequest,
  SearchResults,
  SearchResponse,
} from "../../types/search.types";
import { SearchType } from "../../types/search.types";

export const searchApi = createApi({
  reducerPath: "searchApi",
  baseQuery: axiosBaseQuery(),
  endpoints: (builder) => ({
    search: builder.query<SearchResults, SearchRequest>({
      query: ({ query, type = SearchType.ALL }) => ({
        url: "/v1/search",
        method: "GET",
        params: { query, type },
      }),
      transformResponse: (response: SearchResponse) => response.data,
    }),
  }),
});

export const { useSearchQuery, useLazySearchQuery } = searchApi;
