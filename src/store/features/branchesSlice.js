import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import { ITEMS_PER_PAGE_CARDS } from "../../utils/paginationConfig"
import branchesApi from "../../api/branchesApi"
import toast from "react-hot-toast"
import { convertToDecimal } from "../../utils"
import { showNotification } from "@mantine/notifications"

const initialState = {
  branches: [],
  itemsPerPage: ITEMS_PER_PAGE_CARDS,
  branchesPerPage: [],
  totalBranches: 0,
  totalPagesCount: 0,
  currentPage: 1,
  loadingBranches: false,
  updatingBranches: false,
  creatingBranches: false,
  currentBranch: null,
  totalItems: 0,
  imageUrl: "",
  shippingRange: 0
}

export const fetchBranches = createAsyncThunk(
  "branches/fetchBranches",
  async ({ limit, page, order, restaurantId, search, search_field }, { rejectWithValue }) => {
    try {
      const response = await branchesApi.getBranchesByRestaurant({
        limit,
        page,
        order,
        restaurantId,
        search,
        search_field
      })
      return { data: response.data, results: response.results, page }
    } catch (error) {
      return rejectWithValue(error.response?.data || "Error fetching branches")
    }
  }
)

export const fetchNoPaginatedBranches = createAsyncThunk(
  "branches/fetchNoPaginatedBranches",
  async ({ restaurantId }, { getState, rejectWithValue }) => {
    const state = getState().branches

    if (state.branches && state.branches.length > 0) {
      return state.branches
    }

    try {
      const response = await branchesApi.getNoPaginatedBranches({
        restaurantId,
        order: "DESC",
        orderBy: "created_at"
      })
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data || "Error fetching branches")
    }
  }
)

const updateFormData = (data, propertyToUpdate) => {
  const formData = new FormData()
  if (propertyToUpdate === "isActive") {
    formData.append("isActive", data.isActive)
  } else {
    formData.append("name", data.name)
    formData.append("description", data.description)
    formData.append("category", data.category)
    formData.append("price", convertToDecimal(data.price))
  }

  return formData
}

export const updateBranches = createAsyncThunk(
  "complements/updateBranches",
  async ({ data, propertyToUpdate = "all" }, { dispatch }) => {
    try {
      const formData = updateFormData(data, propertyToUpdate)

      const response = await branchesApi.updateBranches(formData, data?.id)

      if (response.error) {
        showNotification({
          title: "Error",
          message: response.message,
          color: "red",
          duration: 7000
        })
      } else {
        showNotification({
          title: "¡Estado actualizado!",
          message: `La sucursal ${response.data.name} fue ${response.data.isActive ? "habilitada" : "deshabilitada"}`,
          color: "green",
          radius: "md"
        })
      }
      return response.data
    } catch (error) {
      dispatch(setError("Error updating branch"))
      toast.error("Fallo al actualizar el sucursal. Por favor intente de nuevo.", {
        duration: 7000
      })

      throw error
    }
  }
)

export const updateBranchStatus = createAsyncThunk(
  "complements/updateBranches",
  async ({ data, propertyToUpdate = "all" }, { rejectWithValue }) => {
    try {
      const formData = updateFormData(data, propertyToUpdate)

      const response = await branchesApi.updateBranches(formData, data?.id)

      if (response.error) {
        showNotification({
          title: "Error",
          message: response.message,
          color: "red",
          duration: 7000
        })

        return rejectWithValue(response.message)
      }
      return response.data
    } catch (error) {
      showNotification({
        title: "Error",
        message: error,
        color: "red",
        duration: 7000
      })

      throw error
    }
  }
)

/*
 * BRANCHES SLICE
 */

export const branchesSlice = createSlice({
  name: "branches",
  initialState,
  reducers: {
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
    },
    setShippingRange: (state, action) => {
      state.shippingRange = action.payload
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchBranches.pending, (state) => {
        state.loadingBranches = true
      })
      .addCase(fetchBranches.fulfilled, (state, action) => {
        const { data, results, page } = action.payload
        state.branchesPerPage[page] = data

        state.loadingBranches = false
        state.currentPage = page
        state.totalBranches = results
        state.totalPagesCount = Math.ceil(results / action.meta.arg.limit)
      })
      .addCase(fetchBranches.rejected, (state, action) => {
        state.loadingBranches = false
        state.error = action.error
      })
      .addCase(fetchNoPaginatedBranches.pending, (state) => {
        state.loadingBranches = true
      })
      .addCase(fetchNoPaginatedBranches.fulfilled, (state, action) => {
        state.branches = action.payload
        state.loadingBranches = false
      })
      .addCase(fetchNoPaginatedBranches.rejected, (state, action) => {
        state.loadingBranches = false
        state.error = action.error
      })
      .addCase(updateBranchStatus.fulfilled, (state, action) => {
        const { id, isActive } = action.payload
        const currentPageBranches = state.branchesPerPage[state.currentPage]
        const index = currentPageBranches.findIndex((branch) => branch?.id === id)

        if (index !== -1) {
          currentPageBranches[index] = { ...currentPageBranches[index], isActive }
        }
      })
  }
})

export const { setBranches, setError, setPage, setFilters, setBranchData, setImageUrl, setShippingRange } = branchesSlice.actions

export const setLoading = (state) => state.branches.loading

export const selectAllBranches = (state) => state.branches.branches

export const selectBranchesStatus = (state) => state.branches.status

export const selectBranchesError = (state) => state.branches.error

export default branchesSlice.reducer
