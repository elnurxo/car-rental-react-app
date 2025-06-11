import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { API_BASE_URL } from "../../constants/index";

export const userApi = createApi({
  reducerPath: "usersApi",
  baseQuery: fetchBaseQuery({ baseUrl: API_BASE_URL }),
  tagTypes: ["User"],
  endpoints: (builder) => ({
    getUserById: builder.query({
      query: (id) => `/users/${id}`,
      providesTags: (result, error, id) => [{ type: "User", id }],
    }),
    updateUser: builder.mutation({
      query: ({ id, data }) => ({
        url: `/users/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: "User", id }],
    }),
    deleteUser: builder.mutation({
      query: (id) => ({
        url: `/users/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, id) => [{ type: "User", id }],
    }),
    getAllUsers: builder.query({
      query: () => `/users`,
      providesTags: ["User"],
    }),
  }),
});

export const {
  useLazyGetUserByIdQuery,
  useUpdateUserMutation,
  useDeleteUserMutation,
  useGetAllUsersQuery,
} = userApi;

// UPDATE EXAMPLE USAGE
// const [updateUser] = useUpdateUserMutation();

// const handleUpdate = () => {
//   updateUser({ id: user.id, data: { name: "USER Updated" } });
// };
