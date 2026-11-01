import { baseApi } from "./baseApi";

export type FirstResponderDiscountsPayload = {
  police_officer: number;
  firefighter: number;
  ems_paramedic: number;
  active_military: number;
  veteran: number;
  nurse: number;
  doctor: number;
};

export type FirstResponderDiscounts = FirstResponderDiscountsPayload & {
  _id?: string;
  key?: string;
  __v?: number;
  createdAt?: string;
  updatedAt?: string;
};

const firstResponderDiscountsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getFirstResponderDiscounts: builder.query({
      query: () => ({
        url: "/first-responder-discounts",
        method: "GET",
      }),
      providesTags: ["firstResponderDiscounts"],
    }),
    updateFirstResponderDiscounts: builder.mutation({
      query: (data: FirstResponderDiscountsPayload) => ({
        url: "/first-responder-discounts",
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["firstResponderDiscounts"],
    }),
  }),
});

export const {
  useGetFirstResponderDiscountsQuery,
  useUpdateFirstResponderDiscountsMutation,
} = firstResponderDiscountsApi;
