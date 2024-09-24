import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import plansApi from "../../api/plansApi"
import toast from "react-hot-toast"

// Thunk para obtener todos los planes
export const fetchAllPlans = createAsyncThunk("plans/fetchAll", async (_, { rejectWithValue }) => {
  try {
    const response = await plansApi.getAllPlans()

    if (response.error) {
      toast.error(`Fallo al obtener la lista de planes. Por favor intente de nuevo. ${response.message}`, {
        duration: 7000
      })
      return rejectWithValue(response.error)
    }

    return response.data
  } catch (error) {
    toast.error(`Error. Por favor intente de nuevo. ${error}`, {
      duration: 7000
    })
    return rejectWithValue(error.message)
  }
})

const plansSlice = createSlice({
  name: "plans",
  currentPage: 1,
  totalPlans: 0,
  totalPagesCount: 0,
  initialState: {
    plans: [],
    isLoading: false,
    error: null
  },
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
        state.plans = action.payload
        state.totalPlans = action.payload.resultso
        state.isLoading = false
      })
      .addCase(fetchAllPlans.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload
      })
  }
})

export const { clearSelectedPlans } = plansSlice.actions
export default plansSlice.reducer
