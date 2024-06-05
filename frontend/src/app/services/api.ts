import { toast } from '@/components/ui/use-toast'
import { logout } from '@/app/slices/auth'
import type {
  BaseQueryFn,
  FetchArgs,
  FetchBaseQueryError,
} from '@reduxjs/toolkit/query'
import { createApi, fetchBaseQuery, retry } from '@reduxjs/toolkit/query/react'
import { RootState } from '../store'

export const BASE_URL = 'http://localhost:5000'

const baseQuery = fetchBaseQuery({
  baseUrl: BASE_URL,
  prepareHeaders: (headers, { getState }) => {
    const token = (getState() as RootState).auth.userToken
    if (token) {
      headers.set('Authorization', `Bearer ${token}`)
    }
    return headers
  },
})

const baseQueryWithReauth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions)
  if (result.error?.status === 403 || result.error?.status === 401) {
    toast({
      variant: "destructive",
      title: "Unauthorized",
      description: "Please login again to continue",
    })
    api.dispatch(logout())
  }
  return result
}

const baseQueryWithRetry = retry(baseQueryWithReauth, { maxRetries: 1 })

export const api = createApi({
  baseQuery: baseQueryWithRetry,
  tagTypes: [
    'User',
    'Task'
  ],
  endpoints: () => ({}),
})

export const enhancedApi = api.enhanceEndpoints({
  endpoints: () => ({
  }),
})

export const extendedFetch = async (endpoint: string, token?: string) => {
  try {
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    })
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.log(error)
  }
}