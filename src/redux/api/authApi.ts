import { baseApi } from "./baseApi";

const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    signIn: builder.mutation({
      query: (data) => {
        return {
          url: "/auth/login",
          method: "POST",
          body: data,
        };
      },
      invalidatesTags: ["profile"],
    }),
    sendOtp: builder.mutation({
      query: (data) => {
        return {
          url: "/auth/send-otp",
          method: "POST",
          body: data,
        };
      },
    }),
    verifyOtp: builder.mutation({
      query: (data) => {
        return {
          url: "/auth/verify-otp",
          method: "POST",
          body: data,
        };
      },
    }),
    setForgottenPassword: builder.mutation({
      query: (data) => {
        return {
          url: "/auth/reset-forgotten-password",
          method: "POST",
          body: data,
        };
      },
    }),
    changePassword: builder.mutation({
      query: (data) => {
        return {
          url: "/auth/change-password",
          method: "POST",
          body: data,
        };
      },
    }),
    getAllUsers: builder.query({
      query: (params) => ({
        url: "/auth/get-all-users",
        method: "GET",
        params: params,
      }),
      providesTags: ["user"],
    }),
    getSingleUser: builder.query({
      query: ({ id, params }) => ({
        url: `/auth/users/${id}`,
        method: "GET",
        params: params,
      }),
      providesTags: ["user"],
    }),
    getSingleUserByAuthId: builder.query({
      query: (authId) => ({
        url: `/auth/get-single-user/${authId}`,
        method: "GET",
      }),
      providesTags: ["user"],
    }),
    approveUser: builder.mutation({
      query: (id) => ({
        url: `/auth/approve/${id}`,
        method: "PATCH",
      }),
      invalidatesTags: ["user", "profile"],
    }),
    updateApprovalStatus: builder.mutation({
      query: ({ authId, status }) => ({
        url: `/auth/approval-status/${authId}`,
        method: "PATCH",
        body: { status },
      }),
      invalidatesTags: ["user", "profile"],
    }),
    blockUser: builder.mutation({
      query: (id) => ({
        url: `/auth/block/${id}`,
        method: "PATCH",
      }),
      invalidatesTags: ["user", "profile"],
    }),
    changeUserStatus: builder.mutation({
      query: (email) => ({
        url: `/auth/change-user-status/${email}`,
        method: "PATCH",
      }),
      invalidatesTags: ["user", "profile"],
    }),
    giveFreeTrial: builder.mutation({
      query: (email) => ({
        url: `/auth/give-free-trial/${email}`,
        method: "POST",
      }),
      invalidatesTags: ["user", "profile"],
    }),
  }),
});

export const {
  useSignInMutation,
  useVerifyOtpMutation,
  useSendOtpMutation,
  useSetForgottenPasswordMutation,
  useChangePasswordMutation,
  useGetAllUsersQuery,
  useGetSingleUserQuery,
  useGetSingleUserByAuthIdQuery,
  useBlockUserMutation,
  useApproveUserMutation,
  useUpdateApprovalStatusMutation,
  useChangeUserStatusMutation,
  useGiveFreeTrialMutation,
} = authApi;
