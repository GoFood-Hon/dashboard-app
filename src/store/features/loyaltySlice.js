import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import loyaltyApi from "../../api/loyaltyApi"
import { ITEMS_PER_PAGE } from "../../utils/paginationConfig"

// Async thunks para interactuar con los endpoints
export const fetchLoyaltyProgramsByRestaurant = createAsyncThunk(
  "loyalty/fetchLoyaltyProgramsByRestaurant",
  async ({ restaurantId, page, limit, order, orderBy }, { rejectWithValue }) => {
    try {
      const response = await loyaltyApi.getLoyaltyProgramsByRestaurant({ restaurantId, page, limit, order, orderBy })
      return { data: response.data, results: response.results, page }
    } catch (error) {
      return rejectWithValue(error.response.data)
    }
  }
)

export const fetchAllLoyaltyPrograms = createAsyncThunk(
  "loyalty/fetchAllLoyaltyPrograms",
  async ({ page, limit, order, orderby, search, search_field, status }, { rejectWithValue }) => {
    try {
      const response = await loyaltyApi.getAllLoyaltyPrograms({ page, limit, order, orderby, search, search_field, status })
      return { data: response.data, results: response.results, page }
    } catch (error) {
      return rejectWithValue(error.response.data)
    }
  }
)

export const createLoyaltyProgram = createAsyncThunk("loyalty/createLoyaltyProgram", async (params, { rejectWithValue }) => {
  try {
    const response = await loyaltyApi.createLoyaltyProgram(params)
    return response.data
  } catch (error) {
    return rejectWithValue(error.response.data)
  }
})

export const updateLoyaltyProgram = createAsyncThunk(
  "loyalty/updateLoyaltyProgram",
  async ({ id, params }, { rejectWithValue }) => {
    try {
      const response = await loyaltyApi.updateLoyaltyProgram(id, params)
      return response.data
    } catch (error) {
      return rejectWithValue(error.response.data)
    }
  }
)

export const deleteCardReward = createAsyncThunk("loyalty/deleteCardReward", async (id, { rejectWithValue }) => {
  try {
    await loyaltyApi.deleteCardReward(id)
    return id
  } catch (error) {
    return rejectWithValue(error.response.data)
  }
})

// Slice
const loyaltySlice = createSlice({
  name: "loyalty",
  initialState: {
    programs: [],
    itemsPerPage: ITEMS_PER_PAGE,
    programsPerPage: [],
    totalPrograms: 0,
    totalPagesCount: 0,
    currentPage: 1,
    loadingPrograms: false,
    updatinPrograms: false,
    loading: false,
    error: null
  },
  reducers: {
    resetError(state) {
      state.error = null
    },
    setPage: (state, action) => {
      state.currentPage = action.payload
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch Loyalty Programs by Restaurant
      .addCase(fetchLoyaltyProgramsByRestaurant.pending, (state) => {
        state.loadingPrograms = true
      })
      .addCase(fetchLoyaltyProgramsByRestaurant.fulfilled, (state, action) => {
        const { data, results, page } = action.payload
        state.programsPerPage[page] = data

        state.loadingPrograms = false
        state.currentPage = page
        state.totalPrograms = results
        state.totalPagesCount = Math.ceil(results / action.meta.arg.limit)
      })
      .addCase(fetchLoyaltyProgramsByRestaurant.rejected, (state, action) => {
        state.loadingPrograms = false
        state.error = action.payload
      })

      // Fetch All Loyalty Programs
      .addCase(fetchAllLoyaltyPrograms.pending, (state) => {
        state.loadingPrograms = true
      })
      .addCase(fetchAllLoyaltyPrograms.fulfilled, (state, action) => {
        const { data, results, page } = action.payload
        state.programsPerPage[page] = data

        state.loadingPrograms = false
        state.currentPage = page
        state.totalPrograms = results
        state.totalPagesCount = Math.ceil(results / action.meta.arg.limit)
      })
      .addCase(fetchAllLoyaltyPrograms.rejected, (state, action) => {
        state.loadingPrograms = false
        state.error = action.payload
      })

      // Create Loyalty Program
      .addCase(createLoyaltyProgram.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(createLoyaltyProgram.fulfilled, (state, action) => {
        state.loading = false
        state.programs.push(action.payload)
      })
      .addCase(createLoyaltyProgram.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })

      // Update Loyalty Program
      .addCase(updateLoyaltyProgram.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(updateLoyaltyProgram.fulfilled, (state, action) => {
        state.loading = false
        const index = state.programs.findIndex((program) => program.id === action.payload.id)
        if (index !== -1) {
          state.programs[index] = action.payload
        }
      })
      .addCase(updateLoyaltyProgram.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })

      // Delete Card Reward
      .addCase(deleteCardReward.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(deleteCardReward.fulfilled, (state, action) => {
        state.loading = false
        state.programs = state.programs.filter((reward) => reward.id !== action.payload)
      })
      .addCase(deleteCardReward.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
  }
})

export const { resetError, setPage } = loyaltySlice.actions

export default loyaltySlice.reducer
