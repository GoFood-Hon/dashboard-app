import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import { ITEMS_PER_PAGE } from "../../utils/paginationConfig"
import branchesApi from "../../api/branchesApi"

const initialState = {
  branches: [],
  currentPage: 1,
  itemsPerPage: ITEMS_PER_PAGE,
  totalItems: 0,
  filters: {
    startDate: null,
    endDate: null,
    status: null,
    startPrice: null,
    endPrice: null,
    dateSort: null
  }
}

/*
 * GET BRANCHES
 */

export const fetchBranches = createAsyncThunk(
  "branches/fetchBranches",
  async ({ limit, page, order, restaurantId, filters }, { dispatch }) => {
    try {
      let formattedStartDate = null
      let formattedEndDate = null
      let formattedStatus = null
      let formattedPrice = null
      let dateSort = null

      if (filters) {
        const { startDate, endDate, status, startPrice, endPrice, dateSort: filterDateSort } = filters

        if (startDate) {
          formattedStartDate = startDate.toISOString().split("T")[0]
        }

        if (endDate) {
          formattedEndDate = endDate.toISOString().split("T")[0]
        }

        if (status) {
          formattedStatus = status === "Todos" ? null : status === "Habilitado" ? "true" : "false"
        }

        if (startPrice || endPrice) {
          formattedPrice = `${startPrice || ""}-${endPrice || ""}`
        }

        dateSort = filterDateSort || null
      }

      const response = await branchesApi.getAllBranches({
        limit,
        page,
        order,
        restaurantId,
        startDate: formattedStartDate,
        endDate: formattedEndDate,
        status: formattedStatus,
        price: formattedPrice,
        dateSort
      })

      dispatch(setBranches(response.data))
      return response
    } catch (error) {
      dispatch(setError("Error fetching branches"))
      throw error
    }
  }
)

/*
 * UPDATE BRANCHES
 */

/*
 * BRANCHES SLICE
 */

export const branchesSlice = createSlice({
  name: "branches",
  initialState,
  reducers: {
    setFilters: (state, action) => {
      state.filters = action.payload
    },
    setPage: (state, action) => {
      state.currentPage = action.payload
    },
    setBranches: (state, action) => {
      state.branches = action.payload
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
      .addCase(fetchBranches.pending, (state) => {
        state.status = "loading"
      })
      .addCase(fetchBranches.fulfilled, (state, action) => {
        state.status = "succeeded"
        state.totalItems = action.payload.results
        state.value = action.payload
      })
      .addCase(fetchBranches.rejected, (state, action) => {
        state.status = "failed"
        state.error = action.error
      })
  }
})

export const { setBranches, setError, setPage, setFilters } = branchesSlice.actions

export const setLoading = (state) => state.branches.loading

export const selectAllBranches = (state) => state.branches.branches

export const selectBranchesStatus = (state) => state.branches.status

export const selectBranchesError = (state) => state.branches.error

export default branchesSlice.reducer
