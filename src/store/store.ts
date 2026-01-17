import { configureStore } from '@reduxjs/toolkit'
import { subscriptionApi } from './api/subscription.api'
import { lyricsApi } from './api/lyrics.api'
import { songsApi } from './api/songs.api'
import { genresApi } from './api/genres.api'
import { aiApi } from './api/ai.api'
import { usersApi } from './api/users.api'

export const store = configureStore({
  reducer: {
    [subscriptionApi.reducerPath]: subscriptionApi.reducer,
    [lyricsApi.reducerPath]: lyricsApi.reducer,
    [songsApi.reducerPath]: songsApi.reducer,
    [genresApi.reducerPath]: genresApi.reducer,
    [aiApi.reducerPath]: aiApi.reducer,
    [usersApi.reducerPath]: usersApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(subscriptionApi.middleware)
      .concat(lyricsApi.middleware)
      .concat(songsApi.middleware)
      .concat(genresApi.middleware)
      .concat(aiApi.middleware)
      .concat(usersApi.middleware),
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
