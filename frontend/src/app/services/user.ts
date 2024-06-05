import { Role, User } from '../types'
import { api } from './api'

type UsersResponse = {
  data: User[]
}

type UserResponse = {
  data: User
}
type GetUserQuery = {
  role?: Role
}

export const userAPI = api.injectEndpoints({
  endpoints: (builder) => ({
    sendPhoneAccessCode: builder.mutation({
      query: (data) => ({
        url: `/auth/phone`,
        method: 'POST',
        body: data
      })
    }),

    validatePhoneAccessCode: builder.mutation({
      query: (data) => ({
        url: `/auth/phone/validate`,
        method: 'POST',
        body: data
      })
    }),

    getUsers: builder.query<UsersResponse, GetUserQuery>({
      query: ({ role = "" }) => ({
        url: `/users?role=${role}`,
        method: 'GET',
      }),
      providesTags: ['User'],
    }),

    getUser: builder.mutation<UserResponse, GetUserQuery>({
      query: (id) => ({
        url: `/users/${id}`,
        method: 'GET',
      }),
    }),

    getProfile: builder.query<UserResponse, unknown>({
      query: () => ({
        url: `/users/profile`,
        method: 'GET',
      }),
      providesTags: ['User'],
    }),

    updateProfile: builder.mutation({
      query: (data) => ({
        url: `/users/profile`,
        method: 'PUT',
        body: data
      }),
      invalidatesTags: ['User'],
    }),


    createUsers: builder.mutation({
      query: (data) => ({
        url: `/users`,
        method: 'POST',
        body: data
      }),
      invalidatesTags: ['User'],
    }),

    sendEmailAccessCode: builder.mutation({
      query: (data) => ({
        url: `/auth/email`,
        method: 'POST',
        body: data
      })
    }),

    validateEmailAccessCode: builder.mutation({
      query: (data) => ({
        url: `/auth/email/validate`,
        method: 'POST',
        body: data
      })
    }),

    updateUser: builder.mutation({
      query: ({ id, data }) => ({
        url: `/users/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['User'],
    }),

    deleteUser: builder.mutation({
      query: (id) => ({
        url: `/users/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['User'],
    }),

    verifyUser: builder.query({
      query: (token) => ({
        url: `/users/verify?token=${token}`,
        method: 'GET',
      }),
    }),

  })
})

export const {
  useSendPhoneAccessCodeMutation,
  useValidatePhoneAccessCodeMutation,
  useSendEmailAccessCodeMutation,
  useValidateEmailAccessCodeMutation,
  useGetUsersQuery,
  useCreateUsersMutation,
  useGetUserMutation,
  useUpdateUserMutation,
  useDeleteUserMutation,
  useGetProfileQuery,
  useUpdateProfileMutation,
  useVerifyUserQuery
} = userAPI