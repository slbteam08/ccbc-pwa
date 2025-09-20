import { createApi } from "@reduxjs/toolkit/query/react";
import axios, { AxiosError } from "axios";
import type { AxiosRequestConfig } from "axios";
import type { BaseQueryFn } from "@reduxjs/toolkit/query";
import { getGlobalLogoutFunction } from "@/utils/logoutService";
import { endpoints } from "./endpoints";

/**
 * Custom axios instance with JWT authentication and error handling
 */
const axiosInstance = axios.create({
  baseURL: "/api",
  headers: {
    "Content-Type": "application/json",
  },
});

/**
 * Request interceptor to add JWT token from localStorage
 */
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("jwt");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

/**
 * Response interceptor to handle 403 errors and logout
 */
axiosInstance.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response?.status === 403) {
      console.log(
        "🔴 Axios Interceptor: 403 error detected, triggering logout"
      );
      // Clear JWT token and trigger logout dialog
      localStorage.removeItem("jwt");

      // Get the global logout function and show dialog
      const globalLogout = getGlobalLogoutFunction();
      console.log(
        "🔴 Axios Interceptor: Global logout function:",
        globalLogout
      );
      if (globalLogout) {
        console.log("🔴 Axios Interceptor: Calling global logout function");
        globalLogout("Your session has expired. Please log in again.");
      } else {
        console.log(
          "🔴 Axios Interceptor: No global logout function available"
        );
      }
    }
    return Promise.reject(error);
  }
);

/**
 * Custom base query function using axios
 */
const axiosBaseQuery =
  (
    { baseUrl }: { baseUrl: string } = { baseUrl: "" }
  ): BaseQueryFn<
    {
      url: string;
      method?: AxiosRequestConfig["method"];
      data?: AxiosRequestConfig["data"];
      params?: AxiosRequestConfig["params"];
      headers?: AxiosRequestConfig["headers"];
    },
    unknown,
    unknown
  > =>
  async ({ url, method = "get", data, params, headers }) => {
    try {
      const result = await axiosInstance({
        url: baseUrl + url,
        method,
        data,
        params,
        headers,
      });
      return { data: result.data };
    } catch (axiosError) {
      const err = axiosError as AxiosError;

      // Handle 403 errors in RTK Query as well
      if (err.response?.status === 403) {
        console.log("🔴 RTK Query: 403 error detected, triggering logout");
        localStorage.removeItem("jwt");
        const globalLogout = getGlobalLogoutFunction();
        console.log("🔴 RTK Query: Global logout function:", globalLogout);
        if (globalLogout) {
          console.log("🔴 RTK Query: Calling global logout function");
          globalLogout("Your session has expired. Please log in again.");
        } else {
          console.log("🔴 RTK Query: No global logout function available");
        }
      }

      return {
        error: {
          status: err.response?.status,
          data: err.response?.data || err.message,
        },
      };
    }
  };

/**
 * Base API slice using RTK Query with custom axios base query
 * Provides a foundation for making API calls with caching and automatic refetching
 */
export const apiSlice = createApi({
  reducerPath: "api",
  baseQuery: axiosBaseQuery({ baseUrl: "" }),
  tagTypes: ["Post", "User"], // Define tag types for cache invalidation
  endpoints: (builder) => ({
    // Example endpoint - can be extended with actual API endpoints
    getHealthCheck: builder.query<{ status: string }, void>({
      query: () => ({ url: "/health" }),
    }),

    /**
     * User login endpoint
     * @param credentials - User login credentials (username and password)
     * @returns JWT token and user information
     */
    login: builder.mutation<
      { token: string; user: { id: string; email: string; name: string } },
      { username: string; password: string }
    >({
      query: (credentials) => ({
        url: endpoints.login,
        method: "POST",
        data: credentials,
      }),
    }),

    /**
     * Get current user profile (requires authentication)
     * @returns Current user profile information
     */
    getProfile: builder.query<
      { id: string; email: string; name: string; role: string },
      void
    >({
      query: () => ({ url: "/auth/profile" }),
      providesTags: ["User"],
    }),

    /**
     * Refresh authentication token
     * @returns New JWT token
     */
    refreshToken: builder.mutation<{ token: string }, void>({
      query: () => ({
        url: "/auth/refresh",
        method: "POST",
      }),
    }),

    /**
     * User logout endpoint
     * @returns Success message
     */
    logout: builder.mutation<{ message: string }, void>({
      query: () => ({
        url: "/auth/logout",
        method: "POST",
      }),
      invalidatesTags: ["User"],
    }),
  }),
});

// Export hooks for usage in functional components
export const {
  useGetHealthCheckQuery,
  useLoginMutation,
  useGetProfileQuery,
  useRefreshTokenMutation,
  useLogoutMutation,
} = apiSlice;
