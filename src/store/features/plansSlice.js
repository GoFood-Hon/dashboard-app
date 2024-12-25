import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import plansApi from "../../api/plansApi"
import { ITEMS_PER_PAGE } from "../../utils/paginationConfig"
import { showNotification } from "@mantine/notifications"

// Thunk para obtener todos los planes
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

      if (response.error) {
        showNotification({
          title: "Error",
          message: response.message,
          color: "red",
          duration: 7000
        })
        return rejectWithValue(response.error)
      }

      return { data: response.data, results: response.results, page }
    } catch (error) {
      showNotification({
        title: "Error",
        message: error.message || error,
        color: "red",
        duration: 7000
      })
      return rejectWithValue(error.message)
    }
  }
)

export const createPlan = createAsyncThunk("plans/createPlan", async ({ params }, { rejectWithValue }) => {
  try {
    const response = await plansApi.createPlan(params)

    if (response.error) {
      showNotification({
        title: "Error",
        message: response.message,
        color: "red",
        duration: 7000
      })
      return rejectWithValue(response.error)
    }

    showNotification({
      title: "Creación exitosa",
      message: `Se creó el plan ${response.data.name.replace("Plan", "")}`,
      color: "green"
    })

    return response.data
  } catch (error) {
    showNotification({
      title: "Error",
      message: error.message || error,
      color: "red",
      duration: 7000
    })
    return rejectWithValue(error.message)
  }
})

export const updatePlanData = createAsyncThunk("plans/updatePlanData", async ({ id, params }, { rejectWithValue }) => {
  try {
    const response = await plansApi.updatePlan(id, params)
    if (response.error) {
      showNotification({
        title: "Error",
        message: response.message,
        color: "red",
        duration: 7000
      })

      return rejectWithValue(response.message)
    }

    showNotification({
      title: "Actualización exitosa",
      message: `El plan ${response.data.name.replace("Plan", "")} fue actualizado`,
      color: "green"
    })
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
})

export const updatePlanStatus = createAsyncThunk("plans/updatePlanStatus", async ({ id, params }, { rejectWithValue }) => {
  try {
    const response = await plansApi.updatePlan(id, params)
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
})

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

  //Buscar planes
  searchData: null
}

const plansSlice = createSlice({
  name: "plans",
  initialState,
  reducers: {
    clearSelectedPlans: (state) => {
      state.plans = []
    },
    setSearchData: (state, action) => {
      state.searchData = action.payload
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
        const index = currentPagePlans.findIndex((plan) => plan?.id === id)

        if (index !== -1) {
          currentPagePlans[index] = { ...currentPagePlans[index], isActive }
        }
      })
      .addCase(updatePlanData.pending, (state) => {
        state.updatingPlan = true
      })
      .addCase(updatePlanData.fulfilled, (state, action) => {
        const { id, name, paymentType, price, updatedAt } = action.payload
        const currentPagePlans = state.plansByPage[state.currentPage]
        const index = currentPagePlans.findIndex((plan) => plan?.id == id)

        if (index !== -1) {
          currentPagePlans[index] = {
            ...currentPagePlans[index],
            name,
            paymentType,
            price,
            updatedAt
          }
        }
        state.updatingPlan = false
      })
      .addCase(updatePlanData.rejected, (state, action) => {
        state.updatingPlan = false
        state.error = action.payload
      })
  }
})

export const { clearSelectedPlans, setSearchData } = plansSlice.actions
export default plansSlice.reducer
