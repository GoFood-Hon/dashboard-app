import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import statsApi from "../../api/statsApi"

export const fetchDishSalesStats = createAsyncThunk("statistics/dishSalesStats", async (_, { rejectWithValue }) => {
  try {
    const response = await statsApi.getAllRestaurantsNoPagination()
    return response.data
  } catch (error) {
    return rejectWithValue(error.response.data || "Error fetching dish sales stats")
  }
})

// Slice
const statsSlice = createSlice({
  name: "statistics",
  initialState: {
    salesStats: [],
    loadingsalesstats: false,
    error: null
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchDishSalesStats.pending, (state) => {
        state.loadingsalesstats = true
      })
      .addCase(fetchDishSalesStats.fulfilled, (state, action) => {
        state.salesStats = action.payload
        state.loadingsalesstats = false
      })
      .addCase(fetchDishSalesStats.rejected, (state, action) => {
        state.error = action.payload
        state.loadingsalesstats = false
      })
  }
})

export default statsSlice.reducer
