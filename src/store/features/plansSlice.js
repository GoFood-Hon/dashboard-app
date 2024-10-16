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

const initialState = {
  value: {},
  currentPage: 1,
  itemsPerPage: ITEMS_PER_PAGE,
  totalPlans: 0,
  totalPagesCount: 0,
  plansByPage: {},
  loadingPlans: false,
  error: null
}

const plansSlice = createSlice({
  name: "plans",
  initialState,
  reducers: {
    clearSelectedPlans: (state) => {
      state.plans = []
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllPlans.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(fetchAllPlans.fulfilled, (state, action) => {
        const { data, results, page } = action.payload
        state.plansByPage[page] = data
        state.loadingPlans = false
        state.currentPage = page
        state.totalPlans = results
        state.totalPagesCount = Math.ceil(results / action.meta.arg.limit)
      })
      .addCase(fetchAllPlans.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload
      })
  }
})

export const { clearSelectedPlans } = plansSlice.actions
export default plansSlice.reducer

// import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
// import { showNotification } from "@mantine/notifications"
// import plansApi from "../../api/plansApi"

// // Thunks para los planes

// // Obtener todos los planes
// export const fetchAllPlans = createAsyncThunk(
//   "plans/fetchAllPlans",
//   async ({ limit = 10, page = 1 }, { getState, rejectWithValue }) => {
//     const state = getState().plans

//     // Verificar si ya se han cargado los planes para la página solicitada
//     if (state.plansByPage[page]) {
//       return state.plansByPage[page] // Retornar los planes almacenados en el estado
//     }

//     try {
//       const response = await plansApi.getAllPlans({ limit, page })
//       return response.data // Asumimos que response.data incluye los results y otros metadatos
//     } catch (error) {
//       return rejectWithValue(error.response?.data || "Error fetching plans")
//     }
//   }
// )

// // Crear un nuevo plan
// export const createPlan = createAsyncThunk("plans/createPlan", async (params, { rejectWithValue }) => {
//   try {
//     const response = await plansApi.createPlan(params)
//     showNotification({ title: "Creación exitosa", message: "El plan fue creado correctamente", color: "green" })
//     return response.data // Devuelve el nuevo plan
//   } catch (error) {
//     return rejectWithValue(error.response?.data || "Error creating plan")
//   }
// })

// // Actualizar un plan
// export const updatePlan = createAsyncThunk("plans/updatePlan", async ({ id, params }, { rejectWithValue }) => {
//   try {
//     const response = await plansApi.updatePlan(id, params)
//     showNotification({ title: "Éxito", message: "Plan actualizado", color: "green" })
//     return response.data // Devuelve el plan actualizado
//   } catch (error) {
//     return rejectWithValue(error.response?.data || "Error updating plan")
//   }
// })

// // Obtener un plan
// export const fetchPlan = createAsyncThunk("plans/fetchPlan", async (id, { rejectWithValue }) => {
//   try {
//     const response = await plansApi.getPlan(id)
//     return response.data // Devuelve los detalles del plan
//   } catch (error) {
//     return rejectWithValue(error.response?.data || "Error fetching plan")
//   }
// })

// // Slice
// const plansSlice = createSlice({
//   name: "plans",
//   initialState: {
//     plansByPage: {}, // Almacena los planes por página
//     currentPage: 0, // Página actual
//     totalPagesCount: 0, // Total de páginas
//     loading: false,
//     error: null
//   },
//   reducers: {
//     setCurrentPage: (state, action) => {
//       state.currentPage = action.payload // Actualiza la página actual
//     }
//   },
//   extraReducers: (builder) => {
//     // Thunks para obtener todos los planes
//     builder
//       .addCase(fetchAllPlans.pending, (state) => {
//         state.loading = true
//       })

//       .addCase(fetchAllPlans.fulfilled, (state, action) => {
//         const results = action?.payload?.results || [] // Suponiendo que la respuesta tiene un campo `results`
//         state.totalPagesCount = Math.ceil(results / 10)
//         state.plansByPage[state.currentPage] = results // Guardar los planes de la página actual
//         state.loading = false
//       })

//       .addCase(fetchAllPlans.rejected, (state, action) => {
//         state.error = action.payload
//         state.loading = false
//       })

//       // Thunks para crear un nuevo plan
//       .addCase(createPlan.fulfilled, (state, action) => {
//         state.plans.push(action.payload) // Agrega el nuevo plan a la lista
//       })

//       // Thunks para actualizar un plan
//       .addCase(updatePlan.fulfilled, (state, action) => {
//         const index = state.plans.findIndex((plan) => plan.id === action.payload.id)
//         if (index !== -1) {
//           state.plans[index] = action.payload // Actualiza el plan existente
//         }
//       })

//       // Thunks para obtener un plan específico
//       .addCase(fetchPlan.fulfilled, (state, action) => {
//         state.currentPlan = action.payload // Almacena el plan actual
//       })
//   }
// })

// export const { setCurrentPage } = plansSlice.actions

// export default plansSlice.reducer
