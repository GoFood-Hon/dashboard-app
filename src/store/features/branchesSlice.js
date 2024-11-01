import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import { ITEMS_PER_PAGE_CARDS } from "../../utils/paginationConfig"
import branchesApi from "../../api/branchesApi"
import toast from "react-hot-toast"
import { convertToDecimal } from "../../utils"
import { showNotification } from "@mantine/notifications"

const initialState = {
  branches: [],
  currentBranch: null,
  currentPage: 1,
  itemsPerPage: ITEMS_PER_PAGE_CARDS,
  totalItems: 0,
  imageUrl: "",
  filters: {
    startDate: null,
    endDate: null,
    status: null,
    startPrice: null,
    dateSort: null
  }
}

/*
 * GET RESTAURANT INDIVIDUAL
 */

// TODO:
/* export const fetchBranchData = createAsyncThunk("branches/fetchBranchData", async ({ branchId }, { dispatch }) => {
  try {
    const response = await branchesApi.getBranch(branchId)
    if (response.error) {
      toast.error(`Fallo obtener la información de la sucursal ${response.message}`, {
        duration: 7000
      })
      return {}
    } else {
      dispatch(setBranchData(response.data))
      dispatch(setImageUrl(response?.data?.images?.[0]?.location))
      return response.data
    }
  } catch (error) {
    toast.error(`Fallo al obtener la información de la sucursal. Intente de nuevo.`, {
      duration: 7000
    })

    throw error
  }
})
 */
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
        const { startDate, endDate, status, startPrice, dateSort: filterDateSort } = filters

        if (startDate) {
          formattedStartDate = startDate.toISOString().split("T")[0]
        }

        if (endDate) {
          formattedEndDate = endDate.toISOString().split("T")[0]
        }

        if (status) {
          formattedStatus = status === "Todos" ? null : status === "Habilitado" ? "true" : "false"
        }

        if (startPrice) {
          formattedPrice = `${startPrice || ""}`
        }

        dateSort = filterDateSort || null
      }

      const response = await branchesApi.getBranchesByRestaurant({
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
    // const xIcon = <IconX style={{ width: rem(20), height: rem(20) }} />
    // const checkIcon = <IconCheck style={{ width: rem(20), height: rem(20) }} />
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

/*
 * BRANCHES SLICE
 */

export const branchesSlice = createSlice({
  name: "branches",
  initialState,
  reducers: {
    setImageUrl(state, action) {
      state.imageUrl = action.payload
    },
    setBranchData(state, action) {
      state.currentBranch = action.payload
    },
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

export const { setBranches, setError, setPage, setFilters, setBranchData, setImageUrl } = branchesSlice.actions

export const setLoading = (state) => state.branches.loading

export const selectAllBranches = (state) => state.branches.branches

export const selectBranchesStatus = (state) => state.branches.status

export const selectBranchesError = (state) => state.branches.error

export default branchesSlice.reducer
