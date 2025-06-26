import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import { showNotification } from "@mantine/notifications"
import reviewsApi from "../../api/reviewsApi"

const initialState = {
  reviews: [],
  reviewDetails: {},
  loadingReviews: false,
  loadingReviewDetails: false,
  updatingVisibility: false,
  error: null
}

export const fetchAllReviews = createAsyncThunk("reviews/fetchAllReviews", async ({ restaurantId }, { rejectWithValue }) => {
  try {
    const response = await reviewsApi.getAllReviews(restaurantId)
    return response.data
  } catch (error) {
    return rejectWithValue(error.response?.data || "Error fetching kitchen types")
  }
})

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
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllReviews.pending, (state) => {
        state.loadingReviews = true
      })
      .addCase(fetchAllReviews.fulfilled, (state, action) => {
        state.reviews = action.payload
        state.loadingReviews = false
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

export default reviewsSlice.reducer
