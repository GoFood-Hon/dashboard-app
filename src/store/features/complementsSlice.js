import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import complementsApi from "../../api/complementsApi"
import { ITEMS_PER_PAGE } from "../../utils/paginationConfig"

const initialState = {
  complements: [],
  currentPage: 1,
  itemsPerPage: ITEMS_PER_PAGE,
  totalItems: 0,
  status: "idle",
  loading: false,
  error: null
}

export const fetchComplements = createAsyncThunk("complements/fetchComplements", async ({ restaurantId }, { dispatch }) => {
  try {
    const response = await complementsApi.getAddOnByRestaurant(restaurantId)
    dispatch(setComplements(response.data))

    if (response.error) {
      toast.error(`Fallo al actualizar el platillo. Por favor intente de nuevo. ${response.message}`, {
        duration: 7000
      })
    } else {
      toast.success("Platillo actualizado exitosamente", {
        duration: 7000
      })
    }

    return response.data
  } catch (error) {
    dispatch(setError("Error fetching complements"))
    throw error
  }
})

export const createComplement = createAsyncThunk("complements/createComplement", async (formData, { dispatch }) => {
  try {
    const response = await complementsApi.createAddOn(formData)
    dispatch(fetchDishes())

    if (response.error) {
      toast.error(`Fallo al crear complemento. Por favor intente de nuevo. ${response.message}`, {
        duration: 7000
      })
    } else {
      toast.success("Complemento creado exitosamente", {
        duration: 7000
      })
    }
    return response.data
  } catch (error) {
    dispatch(setError("Error creating complement"))
    toast.error("Fallo al crear el complemento. Por favor intente de nuevo.", {
      duration: 7000
    })

    throw error
  }
})

export const updateComplement = createAsyncThunk("dishes/updateComplement", async ({ formData, complementId }, { dispatch }) => {
  try {
    const response = await complementsApi.updateAddOn(formData, complementId)

    if (response.error) {
      toast.error(`Fallo al actualizar el complemento. Por favor intente de nuevo. ${response.message}`, {
        duration: 7000
      })
    } else {
      toast.success("Complemento actualizado exitosamente", {
        duration: 7000
      })
    }
    return response.data
  } catch (error) {
    dispatch(setError("Error updating add-on"))
    toast.error("Fallo al actualizar el complemento. Por favor intente de nuevo.", {
      duration: 7000
    })

    throw error
  }
})

export const complementsSlice = createSlice({
  name: "complements",
  initialState,
  reducers: {
    setPage: (state, action) => {
      state.currentPage = action.payload
    },
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
        state.totalItems = 6
        state.value = action.payload
      })
      .addCase(fetchComplements.rejected, (state, action) => {
        state.status = "failed"
        state.error = action.error.message
      })
  }
})

export const { setComplements, setError, setPage } = complementsSlice.actions

export const setLoading = (state) => state.complements.loading

export const selectAllComplements = (state) => state.complements.complements

export const selectComplementsStatus = (state) => state.complements.status

export const selectComplementsError = (state) => state.complements.error

export default complementsSlice.reducer
