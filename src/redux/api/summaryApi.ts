import { baseApi } from "./baseApi";

const summaryApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getUserOverview: builder.query({
      query: (params) => ({
        url: "/summary/users-overview",
        method: "GET",
        params,
      }),
    }),
    getEarningOverview: builder.query({
      query: (params) => ({
        url: "/summary/earnings-overview",
        method: "GET",
        params,
      }),
    }),
    getStats: builder.query({
      query: (params) => ({
        url: "/summary/stats",
        method: "GET",
        params,
      }),
    }),
  }),
});

export const { useGetUserOverviewQuery, useGetStatsQuery, useGetEarningOverviewQuery } = summaryApi;