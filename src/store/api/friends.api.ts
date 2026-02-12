import { axiosBaseQuery } from '../../api/axios-base-query';
import { createApi } from '@reduxjs/toolkit/query/react';
import type { 
  FriendsResponse,
  AddFriendResponse,
  AcceptFriendRequestResponse, 
  RemoveFriendResponse,
} from '../../types/friend.types';
import type { SearchRequestParams } from '../../types/main.types';


export const friendsApi = createApi({
  reducerPath: 'friendsApi',
  baseQuery: axiosBaseQuery({
    baseUrl: '/v1/friends',
  }),
  tagTypes: ['Friend'],
  endpoints: (builder) => ({
    getFriends: builder.query<FriendsResponse, SearchRequestParams | void>({
      query: (params = {}) => ({
        url: '',
        method: 'GET',
        params,
      }),
      providesTags: ['Friend'],
    }),
    
    addFriend: builder.mutation<AddFriendResponse, number>({
      query: (friendId) => ({
        url: `/${friendId}`,
        method: 'POST',
      }),
      invalidatesTags: ['Friend'],
    }),
    
    acceptFriendRequest: builder.mutation<AcceptFriendRequestResponse, number>({
      query: (requestId) => ({
        url: `/${requestId}`,
        method: 'PUT',
      }),
      invalidatesTags: ['Friend'],
    }),
    
    removeFriend: builder.mutation<RemoveFriendResponse, number>({
      query: (friendId) => ({
        url: `/${friendId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Friend'],
    }),
  }),
});

export const {
  useGetFriendsQuery,
  useAddFriendMutation,
  useAcceptFriendRequestMutation,
  useRemoveFriendMutation,
} = friendsApi;