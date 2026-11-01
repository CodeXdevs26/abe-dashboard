import { baseApi } from "./baseApi";

const paymentApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getPayments: builder.query({
      query: (params) => ({
        url: "/payments",
        method: "GET",
        params,
      }),
      providesTags: ["payment"],
    }),
    getEarningsStats: builder.query({
      query: (params) => ({
        url: "/payments/earning-stats",
        method: "GET",
        params,
      }),
      providesTags: ["payment"],
    }),
  }),
});

export const { useGetPaymentsQuery, useGetEarningsStatsQuery } = paymentApi;