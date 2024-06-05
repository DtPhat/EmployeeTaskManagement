import { Role, Task, User } from '../types'
import { api } from './api'

type TasksResponse = {
  data: Task[]
}

export const taskAPI = api.injectEndpoints({
  endpoints: (builder) => ({
    getTasks: builder.query<TasksResponse, unknown>({
      query: () => ({
        url: `/tasks`,
        method: 'GET',
      }),
      providesTags: ['Task'],
    }),

    createTask: builder.mutation<unknown, unknown>({
      query: (data) => ({
        url: `/tasks`,
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Task'],
    }),

    deleteTask: builder.mutation({
      query: (id) => ({
        url: `/tasks/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Task'],
    }),

  updateTask: builder.mutation({
      query: ({ id, data }) => ({
        url: `/tasks/${id}`,
        method: 'PUT',
        body: data
      }),
      invalidatesTags: ['Task'],
    }),

    updateTaskStatus: builder.mutation({
      query: ({ id, data }) => ({
        url: `/tasks/${id}/status`,
        method: 'PUT',
        body: data
      }),
      invalidatesTags: ['Task'],
    }),

  })
})



export const {
  useGetTasksQuery,
  useCreateTaskMutation,
  useDeleteTaskMutation,
  useUpdateTaskMutation,
  useUpdateTaskStatusMutation
} = taskAPI