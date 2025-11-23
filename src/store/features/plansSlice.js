import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import plansApi from "../../api/plansApi"
import { ITEMS_PER_PAGE, ITEMS_PER_PAGE_CARDS } from "../../utils/paginationConfig"
import { showNotification } from "@mantine/notifications"

const initialState = {
  value: {},
  currentPage: 1,
  itemsPerPage: ITEMS_PER_PAGE,
  totalPlans: 0,
  totalPagesCount: 0,
  plansByPage: [],
  loadingPlans: false,
  creatingPlan: false,
  updatingPlan: false,
  error: null,
  featuresList: [],
  loadingFeatures: false,

  currentPageSelectPlan: 1,
  itemsPerPageSelectPlan: ITEMS_PER_PAGE_CARDS,
  totalPlansSelectPlan: 0,
  totalPagesCountSelectPlan: 0,
  plansByPageSelectPlan: [],
  loadingPlansSelectPlan: false,

  searchData: null,
  searchField: "name"
}

export const fetchAllPlans = createAsyncThunk(
  "plans/fetchAll",
  async ({ limit, page, search_field, search }, { rejectWithValue }) => {
    try {
      const response = await plansApi.getAllPlans({
        limit,
        page,
        order: "DESC",
        search_field,
        search
      })

      return { data: response.data, results: response.results, page }
    } catch (error) {
      if (error?.response?.data?.status !== "token_expired") {
        showNotification({
          title: "Error",
          message: error.response?.data?.message || "Error al obtener los planes",
          color: "red",
          duration: 7000
        })
      }

      return rejectWithValue(error.response?.data || "Error al obtener los planes")
    }
  }
)

export const fetchAllPlansSelectPlan = createAsyncThunk(
  "plans/fetchAllSelectPlan",
  async ({ limit, page, search_field, search, isActive }, { rejectWithValue }) => {
    try {
      const response = await plansApi.getAllPlans({
        limit,
        page,
        order: "DESC",
        search_field,
        search,
        isActive
      })

      return { data: response.data, results: response.results, page }
    } catch (error) {
      if (error?.response?.data?.status !== "token_expired") {
        showNotification({
          title: "Error",
          message: error.response?.data?.message || "Error al obtener los planes",
          color: "red",
          duration: 7000
        })
      }

      return rejectWithValue(error.response?.data || "Error al obtener los planes")
    }
  }
)

export const createPlan = createAsyncThunk("plans/createPlan", async ({ params }, { rejectWithValue }) => {
  try {
    const response = await plansApi.createPlan(params)

    showNotification({
      title: "Creación exitosa",
      message: `Se creó el plan ${response.data.name.replace("Plan", "")}`,
      color: "green"
    })

    return response.data
  } catch (error) {
    if (error?.response?.data?.status !== "token_expired") {
      showNotification({
        title: "Error",
        message: error.response?.data?.message || "Error al crear el plan",
        color: "red",
        duration: 7000
      })
    }

    return rejectWithValue(error.response?.data || "Error al crear el plan")
  }
})

export const updatePlanData = createAsyncThunk("plans/updatePlanData", async ({ id, params }, { rejectWithValue }) => {
  try {
    const response = await plansApi.updatePlan(id, params)

    showNotification({
      title: "Actualización exitosa",
      message: `El plan ${response.data.name.replace("Plan", "")} fue actualizado`,
      color: "green"
    })
    return response.data
  } catch (error) {
    if (error?.response?.data?.status !== "token_expired") {
      showNotification({
        title: "Error",
        message: error.response?.data?.message || "Error al actualizar el plan",
        color: "red",
        duration: 7000
      })
    }

    return rejectWithValue(error.response?.data || "Error updating plan data")
  }
})

export const updatePlanStatus = createAsyncThunk("plans/updatePlanStatus", async ({ id, params }, { rejectWithValue }) => {
  try {
    const response = await plansApi.updatePlan(id, params)

    return response.data
  } catch (error) {
    if (error?.response?.data?.status !== "token_expired") {
      showNotification({
        title: "Error",
        message: error.response?.data?.message || "Error al actualizar el estado del plan",
        color: "red",
        duration: 7000
      })
    }

    return rejectWithValue(error.response?.data || "Error al actualizar el estado del plan")
  }
})

export const getPlansFeatures = createAsyncThunk("plans/getPlansFeatures", async (_, { rejectWithValue }) => {
  try {
    const response = await plansApi.getFeatures()

    return response.data
  } catch (error) {
    if (error?.response?.data?.status !== "token_expired") {
      showNotification({
        title: "Error",
        message: error.response?.data?.message || "Error al obtener las características de los planes",
        color: "red",
        duration: 7000
      })
    }

    return rejectWithValue(error.response?.data || "Error al obtener las características de los planes")
  }
})

const plansSlice = createSlice({
  name: "plans",
  initialState,
  reducers: {
    clearSelectedPlans: (state) => {
      state.plans = []
    },
    setSearchData: (state, action) => {
      state.searchData = action.payload
    },
    setCurrentPage: (state, action) => {
      state.currentPage = action.payload
    },
    setCurrentPageSelectPlan: (state, action) => {
      state.currentPageSelectPlan = action.payload
    },
    setSelectedSearchOption: (state, action) => {
      state.searchField = action.payload
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllPlans.pending, (state) => {
        state.loadingPlans = true
      })
      .addCase(fetchAllPlans.fulfilled, (state, action) => {
        const { data, results, page } = action.payload
        state.plansByPage[page] = data
        state.currentPage = page
        state.totalPlans = results
        state.totalPagesCount = Math.ceil(results / action.meta.arg.limit)
        state.loadingPlans = false
      })
      .addCase(fetchAllPlans.rejected, (state, action) => {
        state.loadingPlans = false
        state.error = action.payload
      })
      .addCase(fetchAllPlansSelectPlan.pending, (state) => {
        state.loadingPlansSelectPlan = true
      })
      .addCase(fetchAllPlansSelectPlan.fulfilled, (state, action) => {
        const { data, results, page } = action.payload
        state.plansByPageSelectPlan[page] = data
        state.currentPageSelectPlan = page
        state.totalPlansSelectPlan = results
        state.totalPagesCountSelectPlan = Math.ceil(results / action.meta.arg.limit)
        state.loadingPlansSelectPlan = false
      })
      .addCase(fetchAllPlansSelectPlan.rejected, (state, action) => {
        state.loadingPlansSelectPlan = false
        state.error = action.payload
      })
      .addCase(createPlan.pending, (state) => {
        state.creatingPlan = true
      })
      .addCase(createPlan.fulfilled, (state, action) => {
        const newPlan = action.payload

        if (!state.plansByPage[1]) {
          state.plansByPage[1] = []
        }
        state.plansByPage[1].unshift(newPlan)

        for (let i = 1; i <= state.totalPagesCount; i++) {
          if (state.plansByPage[i]?.length > state.itemsPerPage) {
            const lastItem = state.plansByPage[i].pop()
            if (state.plansByPage[i + 1]) {
              state.plansByPage[i + 1].unshift(lastItem)
            }
          } else {
            break
          }
        }

        const consecutivePages = [1]
        for (let i = 2; i <= state.totalPagesCount; i++) {
          if (state.plansByPage[i]) {
            if (consecutivePages.includes(i - 1)) {
              consecutivePages.push(i)
            } else {
              delete state.plansByPage[i]
            }
          }
        }

        state.totalPlans += 1
        state.totalPagesCount = Math.ceil(state.totalPlans / state.itemsPerPage)
        state.creatingPlan = false
      })
      .addCase(createPlan.rejected, (state) => {
        state.creatingPlan = false
      })
      .addCase(updatePlanStatus.fulfilled, (state, action) => {
        const { id, isActive } = action.payload
        const currentPagePlans = state.plansByPage[state.currentPage]
        if (currentPagePlans && currentPagePlans.length > 0) {
          const index = currentPagePlans.findIndex((plan) => plan?.id === id)

          if (index !== -1) {
            currentPagePlans[index] = { ...currentPagePlans[index], isActive }
          }
        }
      })
      .addCase(updatePlanData.pending, (state) => {
        state.updatingPlan = true
      })
      .addCase(updatePlanData.fulfilled, (state, action) => {
        const { id, name, paymentType, price, updatedAt, currency } = action.payload
        const currentPagePlans = state.plansByPage[state.currentPage]
        if (currentPagePlans && currentPagePlans.length > 0) {
          const index = currentPagePlans.findIndex((plan) => plan?.id == id)

          if (index !== -1) {
            currentPagePlans[index] = {
              ...currentPagePlans[index],
              name,
              paymentType,
              price,
              updatedAt,
              currency
            }
          }
        }
        state.updatingPlan = false
      })
      .addCase(updatePlanData.rejected, (state, action) => {
        state.updatingPlan = false
        state.error = action.payload
      })
      .addCase(getPlansFeatures.pending, (state) => {
        state.loadingFeatures = true
      })
      .addCase(getPlansFeatures.fulfilled, (state, action) => {
        state.featuresList = action.payload
        state.loadingFeatures = false
      })
      .addCase(getPlansFeatures.rejected, (state, action) => {
        state.loadingFeatures = false
        state.error = action.payload
      })
  }
})

export const { clearSelectedPlans, setSearchData, setCurrentPage, setCurrentPageSelectPlan, setSelectedSearchOption } =
  plansSlice.actions
export default plansSlice.reducer
