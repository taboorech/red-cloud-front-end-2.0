import { configureStore } from '@reduxjs/toolkit'
import { subscriptionApi } from './api/subscription.api'
import { lyricsApi } from './api/lyrics.api'

export const store = configureStore({
  reducer: {
    [subscriptionApi.reducerPath]: subscriptionApi.reducer,
    [lyricsApi.reducerPath]: lyricsApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(subscriptionApi.middleware)
      .concat(lyricsApi.middleware),
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
