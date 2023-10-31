import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import complementsApi from "../../api/complementsApi"

export const fetchComplements = createAsyncThunk("complements/fetchComplements", async (_, { dispatch }) => {
  try {
    const response = await complementsApi.getAddOnByRestaurant("9917ad53-e999-4207-b2bd-207f5ffc3b40")
    dispatch(setComplements(response.data))
  } catch (error) {
    dispatch(setError("Error fetching complements"))
    throw error
  }
})

export const createComplement = createAsyncThunk("complements/createComplement", async (formData, { dispatch }) => {
  const response = await complementsApi.createAddOn(formData)

  dispatch(fetchComplements())

  return response.data
})

const initialState = {
  complements: [],
  status: "idle",
  loading: false,
  error: null
}

export const complementsSlice = createSlice({
  name: "complements",
  initialState,
  reducers: {
    setComplements: (state, action) => {
      state.complements = action.payload
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
      .addCase(fetchComplements.pending, (state) => {
        state.status = "loading"
      })
      .addCase(fetchComplements.fulfilled, (state, action) => {
        state.status = "succeeded"
        state.value = action.payload
      })
      .addCase(fetchComplements.rejected, (state, action) => {
        state.status = "failed"
        state.error = action.error.message
      })
  }
})

export const { setComplements, setError } = complementsSlice.actions

export const setLoading = (state) => state.complements.loading

export const selectAllComplements = (state) => state.complements.complements

export const selectComplementsStatus = (state) => state.complements.status

export const selectComplementsError = (state) => state.complements.error

export default complementsSlice.reducer
