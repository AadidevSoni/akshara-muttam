import { apiSlice } from "./apiSlice";
import { USERS_URL } from "../constants";

export const userApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation({ 
      query: (data) => ({
        url: `${USERS_URL}/auth`,
        method: "POST",
        body: data,
        credentials: 'include',
      }),
    }),

    logout: builder.mutation({
      query: () => ({
        url: `${USERS_URL}/logout`,
        method: "POST",
        credentials: 'include',
      })
    }),

    addPlayer: builder.mutation({
      query: (data) => ({
        url: `${USERS_URL}/players`,
        method: 'POST',
        body: data,
        credentials: 'include',
      }),
      invalidatesTags: ['Player'],
    }),

    getPlayers: builder.query({
      query: () => ({
        url: `${USERS_URL}/players`,
        credentials: 'include',
      }),
      providesTags: ['Player'],
    }),

    getPlayerById: builder.query({
      query: (id) => ({
        url: `${USERS_URL}/${id}`,
        credentials: 'include',
      }),
      providesTags: ['Player'],
    }),

    updatePlayer: builder.mutation({
      query: ({ id, data }) => ({
        url: `${USERS_URL}/${id}`,
        method: 'PUT',
        body: data,
        credentials: 'include',
      }),
      invalidatesTags: ['Player'],
    }),

    deletePlayer: builder.mutation({
      query: (id) => ({
        url: `${USERS_URL}/${id}`,
        method: 'DELETE',
        credentials: 'include',
      }),
      invalidatesTags: ['Player'],
    }),

    addExcelPlayer: builder.mutation({
      query: (data) => ({
        url: `${USERS_URL}/upload-excel`,
        method: 'POST',
        credentials: 'include',
        body: data,
        headers: {
          'Content-Type': 'application/json'
        }
      }),
      invalidatesTags: ['Player'],
    }),
  }),
});

export const {
  useLoginMutation,
  useLogoutMutation,
  useAddPlayerMutation,
  useGetPlayersQuery,
  useGetPlayerByIdQuery,
  useUpdatePlayerMutation,
  useDeletePlayerMutation,
  useAddExcelPlayerMutation
} = userApiSlice;
