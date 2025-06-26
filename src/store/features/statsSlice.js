import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import statsApi from "../../api/statsApi"

const initialState = {
  cardsStats: [],
  sellsData: [],
  ordersData: [],
  mostSelledProducts: [],
  mostSelledMenus: [],
  loadingStats: false,
  startDate: null,
  endDate: null,
  selectedFilter: "Esta semana",
  showDatePickers: false,
  error: null,
  hasFetchedStats: false
}

export const mainCardsStats = createAsyncThunk(
  "statistics/mainCardsStats",
  async ({ restaurantId, startDate, endDate }, { rejectWithValue }) => {
    try {
      const response = await statsApi.getMainCardsStats({ restaurantId, startDate, endDate })
      return response.data
    } catch (error) {
      return rejectWithValue(error.response.data || "Error fetching main cards stats")
    }
  }
)

export const mainAdminCardsStats = createAsyncThunk(
  "statistics/mainAdminCardsStats",
  async ({ startDate, endDate }, { rejectWithValue }) => {
    try {
      const response = await statsApi.getMainAdminCardsStats({ startDate, endDate })
      return response.data
    } catch (error) {
      return rejectWithValue(error.response.data || "Error fetching main admin cards stats")
    }
  }
)

export const getOrdersData = createAsyncThunk(
  "statistics/ordersData",
  async ({ restaurantId, sucursalId, startDate, endDate, type }, { rejectWithValue }) => {
    try {
      const response = await statsApi.getSellsAndOrdersData({ restaurantId, sucursalId, startDate, endDate, type })
      return response.data
    } catch (error) {
      return rejectWithValue(error.response.data || "Error fetching sells data")
    }
  }
)

export const getSellsData = createAsyncThunk(
  "statistics/sellsData",
  async ({ restaurantId, sucursalId, startDate, endDate, type }, { rejectWithValue }) => {
    try {
      const response = await statsApi.getSellsAndOrdersData({ restaurantId, sucursalId, startDate, endDate, type })
      return response.data
    } catch (error) {
      return rejectWithValue(error.response.data || "Error fetching sells data")
    }
  }
)

export const getMostSelledProducts = createAsyncThunk(
  "statistics/getMostSelledProducts",
  async ({ restaurantId, startDate, endDate }, { rejectWithValue }) => {
    try {
      const response = await statsApi.getMostSelledProducts({ restaurantId, startDate, endDate })
      return response.data
    } catch (error) {
      return rejectWithValue(error.response.data || "Error fetching most selled products")
    }
  }
)

export const getMostSelledMenus = createAsyncThunk(
  "statistics/getMostSelledMenus",
  async ({ restaurantId, startDate, endDate }, { rejectWithValue }) => {
    try {
      const response = await statsApi.getMostSelledMenus({ restaurantId, startDate, endDate })
      return response.data
    } catch (error) {
      return rejectWithValue(error.response.data || "Error fetching most selled menus")
    }
  }
)

const statsSlice = createSlice({
  name: "statistics",
  initialState,
  reducers: {
    setDateRange: (state, action) => {
      const { startDate, endDate } = action.payload
      state.startDate = startDate
      state.endDate = endDate
    },
    setSelectedFilter: (state, action) => {
      state.selectedFilter = action.payload
    },
    setShowDatePickers: (state, action) => {
      state.showDatePickers = action.payload
    },
    setHasFetchedStats: (state, action) => {
      state.hasFetchedStats = action.payload
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(mainCardsStats.pending, (state) => {
        state.loadingStats = true
      })
      .addCase(mainCardsStats.fulfilled, (state, action) => {
        state.cardsStats = action.payload
        state.loadingStats = false
      })
      .addCase(mainCardsStats.rejected, (state, action) => {
        state.error = action.payload
        state.loadingStats = false
      })
      .addCase(mainAdminCardsStats.pending, (state) => {
        state.loadingStats = true
      })
      .addCase(mainAdminCardsStats.fulfilled, (state, action) => {
        state.cardsStats = action.payload
        state.loadingStats = false
      })
      .addCase(mainAdminCardsStats.rejected, (state, action) => {
        state.error = action.payload
        state.loadingStats = false
      })
      .addCase(getOrdersData.pending, (state) => {
        state.loadingStats = true
      })
      .addCase(getOrdersData.fulfilled, (state, action) => {
        state.ordersData = action.payload
        state.loadingStats = false
      })
      .addCase(getOrdersData.rejected, (state, action) => {
        state.error = action.payload
        state.loadingStats = false
      })
      .addCase(getSellsData.pending, (state) => {
        state.loadingStats = true
      })
      .addCase(getSellsData.fulfilled, (state, action) => {
        state.sellsData = action.payload
        state.loadingStats = false
      })
      .addCase(getSellsData.rejected, (state, action) => {
        state.error = action.payload
        state.loadingStats = false
      })
      .addCase(getMostSelledProducts.pending, (state) => {
        state.loadingStats = true
      })
      .addCase(getMostSelledProducts.fulfilled, (state, action) => {
        state.mostSelledProducts = action.payload
        state.loadingStats = false
      })
      .addCase(getMostSelledProducts.rejected, (state, action) => {
        state.error = action.payload
        state.loadingStats = false
      })
      .addCase(getMostSelledMenus.pending, (state) => {
        state.loadingStats = true
      })
      .addCase(getMostSelledMenus.fulfilled, (state, action) => {
        state.mostSelledMenus = action.payload
        state.loadingStats = false
      })
      .addCase(getMostSelledMenus.rejected, (state, action) => {
        state.error = action.payload
        state.loadingStats = false
      })
  }
})

export const { setDateRange, setSelectedFilter, setShowDatePickers, setHasFetchedStats } = statsSlice.actions
export default statsSlice.reducer
