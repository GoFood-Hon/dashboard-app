import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import dishesCategoriesApi from "../../api/dishesCategoriesApi.js"
import { showNotification } from "@mantine/notifications"

const initialState = {
  dishesCategories: [],
  status: "idle",
  loading: false,
  error: null
}

export const fetchDishesCategories = createAsyncThunk(
  "dishesCategories/fetchDishesCategories",
  async (restaurantId, { dispatch }) => {
    try {
      const response = await dishesCategoriesApi.getCategoryByRestaurant(restaurantId)
      dispatch(setDishesCategories(response.data))
    } catch (error) {
      dispatch(setError("Error fetching dishesCategories"))
      throw error
    }
  }
)

export const createDishCategory = createAsyncThunk(
  "dishesCategories/createDishCategory",
  async (formData, { rejectWithValue }) => {
    try {
      const response = await dishesCategoriesApi.createCategory(formData)

      showNotification({
        title: "Éxito",
        message: "Categoría de producto creada exitosamente.",
        color: "green"
      })

      return response.data
    } catch (error) {
      if (error?.response?.data?.status !== "token_expired") {
        showNotification({
          title: "Error",
          message: error.response?.data?.message || "Error al crear la categoría de producto",
          color: "red"
        })
      }

      return rejectWithValue(error.response?.data || "Error al crear la categoría de producto")
    }
  }
)

export const dishesCategoriesSlice = createSlice({
  name: "dishesCategories",
  initialState,
  reducers: {
    setDishesCategories: (state, action) => {
      state.dishesCategories = action.payload
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
      .addCase(fetchDishesCategories.pending, (state) => {
        state.status = "loading"
      })
      .addCase(fetchDishesCategories.fulfilled, (state, action) => {
        state.status = "succeeded"
        state.value = action.payload
      })
      .addCase(fetchDishesCategories.rejected, (state, action) => {
        state.status = "failed"
        state.error = action.error
      })
  }
})

export const { setDishesCategories, setError } = dishesCategoriesSlice.actions

export const setLoading = (state) => state.dishesCategories.loading

export const selectAllDishesCategories = (state) => state.dishesCategories.dishesCategories

export const selectAllDishesCategoriesStatus = (state) => state.dishesCategories.status

export const selectAllDishesCategoriesError = (state) => state.dishesCategories.error

export default dishesCategoriesSlice.reducer
