import { api } from './api'

export const userAPI = api.injectEndpoints({
  endpoints: (builder) => ({
    getMessages: builder.mutation({
      query: (room) => ({
        url: `/messages/${room}`,
        method: 'GET',
      })
    }),
  })
})

export const {
  useGetMessagesMutation
} = userAPI