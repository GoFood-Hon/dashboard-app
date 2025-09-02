import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import { ITEMS_PER_PAGE_CARDS } from "../../utils/paginationConfig"
import branchesApi from "../../api/branchesApi"
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
  shippingRange: 0,

  //Buscar sucursal
  searchField: "name",
  searchData: null
}

export const fetchBranches = createAsyncThunk(
  "branches/fetchBranches",
  async ({ limit, page, order, search, search_field }, { rejectWithValue }) => {
    try {
      const response = await branchesApi.getBranchesByRestaurant({
        limit,
        page,
        order,
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

export const createBranch = createAsyncThunk(
  "branches/createBranches",
  async ({ formData, formDataImage }, { rejectWithValue }) => {
    try {
      const response = await branchesApi.createBranch(formData)
      const branchData = response.data

      if (response.error) {
        showNotification({
          title: "Error",
          message: response.message,
          color: "red"
        })

        return rejectWithValue(response.message)
      }

      let images = []
      if (formDataImage) {
        const imageResponse = await branchesApi.addImage(branchData.id, formDataImage)
        images = imageResponse.data.images
        console.log(imageResponse)

        if (imageResponse.error) {
          showNotification({
            title: "Error",
            message: imageResponse.message,
            color: "red"
          })

          return rejectWithValue(imageResponse.message)
        }
      }

      showNotification({
        title: "Creación exitosa",
        message: `Se creó la sucursal ${branchData.name}`,
        color: "green"
      })

      return { ...branchData, images }
    } catch (error) {
      return rejectWithValue(error.response?.data || "Error al crear el restaurante")
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
  "branches/updateBranches",
  async ({ formData, formDataImage }, { dispatch, rejectWithValue }) => {
    try {
      const response = await branchesApi.updateBranches(formData, formData.id)
      let branchUpdated = response.data

      if (response.error) {
        showNotification({
          title: "Error",
          message: response.message,
          color: "red",
          duration: 7000
        })

        return rejectWithValue(response.message)
      } else {
        if (formDataImage) {
          const imageResponse = await branchesApi.addImage(formData.id, formDataImage)
          console.log(imageResponse)

          branchUpdated = { ...branchUpdated, images: imageResponse.data.images }
        }

        showNotification({
          title: "Actualización exitosa",
          message: `La sucursal ${branchUpdated.name} fue actualizada correctamente`,
          color: "green",
          radius: "md"
        })
      }
      return branchUpdated
    } catch (error) {
      dispatch(setError("Error updating branch"))
      showNotification({
        title: "Error",
        message: error,
        color: "red",
        radius: "md"
      })

      throw error
    }
  }
)

export const updateBranchStatus = createAsyncThunk(
  "branches/updateBranchesStatus",
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
    },
    setSearchData: (state, action) => {
      state.searchData = action.payload
    },
    setSelectedSearchOption: (state, action) => {
      state.searchField = action.payload
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
        if (currentPageBranches && currentPageBranches.length > 0) {
          const index = currentPageBranches.findIndex((branch) => branch?.id === id)

          if (index !== -1) {
            currentPageBranches[index] = { ...currentPageBranches[index], isActive }
          }
        }
      })
      .addCase(updateBranches.pending, (state) => {
        state.updatingBranches = true
      })
      .addCase(updateBranches.fulfilled, (state, action) => {
        const { id } = action.payload
        const currentPageBranches = state.branchesPerPage[state.currentPage]
        if (currentPageBranches && currentPageBranches.length > 0) {
          const index = currentPageBranches.findIndex((branch) => branch?.id === id)

          if (index !== -1) {
            currentPageBranches[index] = action.payload
          }
        }
        state.updatingBranches = false
      })
      .addCase(updateBranches.rejected, (state, action) => {
        state.updatingBranches = false
        state.error = action.error
      })
      .addCase(createBranch.pending, (state) => {
        state.creatingBranches = true
      })
      .addCase(createBranch.fulfilled, (state, action) => {
        const newBranch = action.payload

        if (!state.branchesPerPage[1]) {
          state.branchesPerPage[1] = []
        }
        state.branchesPerPage[1].unshift(newBranch)

        for (let i = 1; i <= state.totalPagesCount; i++) {
          if (state.branchesPerPage[i]?.length > state.itemsPerPage) {
            const lastItem = state.branchesPerPage[i].pop()
            if (state.branchesPerPage[i + 1]) {
              state.branchesPerPage[i + 1].unshift(lastItem)
            }
          } else {
            break
          }
        }

        const consecutivePages = [1]
        for (let i = 2; i <= state.totalPagesCount; i++) {
          if (state.branchesPerPage[i]) {
            if (consecutivePages.includes(i - 1)) {
              consecutivePages.push(i)
            } else {
              delete state.branchesPerPage[i]
            }
          }
        }

        state.totalBranches += 1
        state.totalPagesCount = Math.ceil(state.totalBranches / state.itemsPerPage)
        state.creatingBranches = false
      })
      .addCase(createBranch.rejected, (state) => {
        state.creatingBranches = false
      })
  }
})

export const {
  setBranches,
  setError,
  setPage,
  setFilters,
  setBranchData,
  setImageUrl,
  setShippingRange,
  setSearchData,
  setSelectedSearchOption
} = branchesSlice.actions

export const setLoading = (state) => state.branches.loading

export const selectAllBranches = (state) => state.branches.branches

export const selectBranchesStatus = (state) => state.branches.status

export const selectBranchesError = (state) => state.branches.error

export default branchesSlice.reducer
