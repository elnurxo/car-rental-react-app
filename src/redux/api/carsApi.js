import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { API_BASE_URL } from "../../constants/index";

export const carApi = createApi({
  reducerPath: "carApi",
  baseQuery: fetchBaseQuery({ baseUrl: API_BASE_URL }),
  tagTypes: ["Car"],

  endpoints: (builder) => ({
    // ✅ GET all cars
    getCars: builder.query({
      query: () => "/cars",
      providesTags: ["Car"],
    }),

    // ✅ GET single car by ID
    getCarById: builder.query({
      query: (id) => `/cars/${id}`,
      providesTags: (result, error, id) => [{ type: "Car", id }],
    }),

    // ✅ ADD new car
    addCar: builder.mutation({
      query: (newCar) => ({
        url: "/cars",
        method: "POST",
        body: newCar,
      }),
      invalidatesTags: ["Car"],
    }),

    // ✅ UPDATE car by ID
    updateCar: builder.mutation({
      query: ({ id, data }) => ({
        url: `/cars/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: "Car", id }],
    }),

    // ✅ DELETE car by ID
    deleteCar: builder.mutation({
      query: (id) => ({
        url: `/cars/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Car"],
    }),
  }),
});

export const {
  useGetCarsQuery,
  useGetCarByIdQuery,
  useAddCarMutation,
  useUpdateCarMutation,
  useDeleteCarMutation,
} = carApi;


// const { data: cars, isLoading } = useGetCarsQuery();
// const [addCar] = useAddCarMutation();

// addCar({
//   brand: "Mazda",
//   model: "CX-5",
//   year: 2024,
//   type: "suv",
//   pricePerDay: 80,
//   availability: true,
//   imageUrl: "https://example.com/mazda.jpg",
// });

// const [updateCar] = useUpdateCarMutation();

// updateCar({ id: "1", data: { pricePerDay: 50, availability: false } });

// const [deleteCar] = useDeleteCarMutation();

// deleteCar("1");
