import { Role, Task, User } from '../types'
import { api } from './api'

type TasksResponse = {
  data: Task[]
}

export const userAPI = api.injectEndpoints({
  endpoints: (builder) => ({
    getTasks: builder.query<TasksResponse, unknown>({
      query: () => ({
        url: `/tasks`,
        method: 'GET',
      }),
      providesTags: ['Task'],
    }),

  })
})

export const {
  useGetTasksQuery
} = userAPI