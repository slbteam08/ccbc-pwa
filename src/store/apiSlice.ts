import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

/**
 * Base API slice using RTK Query
 * Provides a foundation for making API calls with caching and automatic refetching
 */
export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl: '/api',
    prepareHeaders: (headers) => {
      // Add any default headers here
      headers.set('Content-Type', 'application/json')
      return headers
    },
  }),
  tagTypes: ['Post', 'User'], // Define tag types for cache invalidation
  endpoints: (builder) => ({
    // Example endpoint - can be extended with actual API endpoints
    getHealthCheck: builder.query<{ status: string }, void>({
      query: () => '/health',
    }),
  }),
})

// Export hooks for usage in functional components
export const { useGetHealthCheckQuery } = apiSlice