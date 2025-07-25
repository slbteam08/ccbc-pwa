import { configureStore } from '@reduxjs/toolkit'
import { setupListeners } from '@reduxjs/toolkit/query'
import { apiSlice } from './apiSlice.js'
import authReducer from './authSlice'

/**
 * Configure the Redux store with RTK Query
 * Includes the API slice and sets up listeners for refetchOnFocus/refetchOnReconnect
 */
export const store = configureStore({
  reducer: {
    api: apiSlice.reducer,
    auth: authReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(apiSlice.middleware),
})

// Setup listeners for RTK Query
setupListeners(store.dispatch)

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch