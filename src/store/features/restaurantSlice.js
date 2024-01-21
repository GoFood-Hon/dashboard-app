import restaurantsApi from "../../api/restaurantApi"
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import { ITEMS_PER_PAGE } from "../../utils/paginationConfig"

const initialState = {
  restaurants: [],
  currentPage: 1,
  itemsPerPage: ITEMS_PER_PAGE,
  totalItems: 0,
  filters: {
    startDate: null,
    endDate: null,
    status: null,
    startPrice: null,
    endPrice: null
  }
}
/*
 * GET RESTAURANTS
 */

export const fetchRestaurants = createAsyncThunk(
  "restaurants/fetchRestaurants",
  async ({ limit, page, order, category }, { dispatch }) => {
    try {
      const response = await restaurantsApi.getAllRestaurants({
        limit,
        page,
        order
      })

      dispatch(setRestaurants(response.data))
      return response
    } catch (error) {
      dispatch(setError("Error fetching menus"))
      throw error
    }
  }
)

export const restaurantsSlice = createSlice({
  name: "restaurants",
  initialState,
  reducers: {
    setFilters: (state, action) => {
      state.filters = action.payload
    },
    setPage: (state, action) => {
      state.currentPage = action.payload
    },
    setRestaurants: (state, action) => {
      state.restaurants = action.payload
      state.status = "succeeded"
    },
    setError: (state, action) => {
      state.status = "failed"
      state.error = action.payload
    },
    setLoading: (state, action) => {
      state.loading = action.payload
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchRestaurants.pending, (state) => {
        state.status = "loading"
      })
      .addCase(fetchRestaurants.fulfilled, (state, action) => {
        state.status = "succeeded"
        state.totalItems = action.payload.results
        state.value = action.payload
      })
      .addCase(fetchRestaurants.rejected, (state, action) => {
        state.status = "failed"
        state.error = action.error
      })
  }
})

export const { setRestaurants, setPage, setFilters } = restaurantsSlice.actions

export const selectAllRestaurants = (state) => state.restaurants.restaurants

export default restaurantsSlice.reducer
