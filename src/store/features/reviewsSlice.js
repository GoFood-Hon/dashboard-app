import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import { showNotification } from "@mantine/notifications"
import reviewsApi from "../../api/reviewsApi"
import { ITEMS_PER_PAGE } from "../../utils/paginationConfig"

const initialState = {
  reviews: [],
  itemsPerPage: ITEMS_PER_PAGE,
  currentPage: 1,
  reviewsPerPage: [],
  totalReviews: 0,
  totalPagesCount: 0,
  reviewDetails: {},
  loadingReviews: false,
  loadingReviewDetails: false,
  updatingVisibility: false,
  error: null,
  rating: null,
}

export const fetchAllReviews = createAsyncThunk(
  "reviews/fetchAllReviews",
  async ({ restaurantId, limit, page, order, search, search_field }, { rejectWithValue }) => {
    try {
      const response = await reviewsApi.getAllReviews({ restaurantId, limit, page, order, search, search_field })

      if (response.error) {
        showNotification({
          title: "Error",
          message: response.message,
          color: "red",
          duration: 7000
        })
        return rejectWithValue(response.error)
      }

      return { data: response.data, results: response.results, page, ratingAverage: response.restaurantRating }
    } catch (error) {
      return rejectWithValue(error.response?.data || "Error fetching reviews")
    }
  }
)

export const fetchReviewById = createAsyncThunk("reviews/fetchReviewById", async ({ reviewId }, { rejectWithValue }) => {
  try {
    const response = await reviewsApi.getReviewById(reviewId)
    return response.data
  } catch (error) {
    return rejectWithValue(error.response?.data || "Error fetching kitchen types")
  }
})

export const updateReviewVisibility = createAsyncThunk(
  "reviews/updateReviewVisibility",
  async ({ reviewId, params }, { rejectWithValue }) => {
    try {
      const response = await reviewsApi.updateReviewVisibility(reviewId, params)
      showNotification({ title: "Éxito", message: "Se cambió la visibilidad de esta reseña", color: "green" })
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data || "Error updating review visibility")
    }
  }
)

// Slice
const reviewsSlice = createSlice({
  name: "reviews",
  initialState,
  reducers: {
    setCurrentPage: (state, action) => {
      state.currentPage = action.payload
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllReviews.pending, (state) => {
        state.loadingReviews = true
      })
      .addCase(fetchAllReviews.fulfilled, (state, action) => {
        const { data, results, page, ratingAverage } = action.payload
        state.reviewsPerPage[page] = data
        state.loadingReviews = false
        state.currentPage = page
        state.rating = ratingAverage
        state.totalReviews = results
        state.totalPagesCount = Math.ceil(results / action.meta.arg.limit)
      })
      .addCase(fetchAllReviews.rejected, (state, action) => {
        state.error = action.payload
        state.loadingReviews = false
      })
      .addCase(fetchReviewById.pending, (state) => {
        state.loadingReviewDetails = true
      })
      .addCase(fetchReviewById.fulfilled, (state, action) => {
        state.reviewDetails = action.payload
        state.loadingReviewDetails = false
      })
      .addCase(fetchReviewById.rejected, (state, action) => {
        state.error = action.payload
        state.loadingReviewDetails = false
      })
      .addCase(updateReviewVisibility.pending, (state, action) => {
        state.updatingVisibility = true
      })
      .addCase(updateReviewVisibility.fulfilled, (state, action) => {
        const index = state.reviews.findIndex((type) => type.id === action.payload.id)
        state.kitchenTypes[index] = action.payload
      })
      .addCase(updateReviewVisibility.rejected, (state, action) => {
        state.error = action.payload
        state.updatingVisibility = false
      })
  }
})

export const { setCurrentPage } = reviewsSlice.actions

export default reviewsSlice.reducer
