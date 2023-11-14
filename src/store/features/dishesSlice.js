import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import dishesApi from "../../api/dishesApi"
import toast from "react-hot-toast"
import { ITEMS_PER_PAGE } from "../../utils/paginationConfig"

const initialState = {
  dishes: [],
  currentPage: 1,
  itemsPerPage: ITEMS_PER_PAGE,
  totalItems: 0,
  filters: { startDate: "", endDate: "", status: "", price: "" }
}

export const fetchDishes = createAsyncThunk(
  "dishes/fetchDishes",
  async ({ limit, page, order, restaurantId, filters }, { dispatch }) => {
    const { startDate, endDate, status, price } = filters
    try {
      const response = await dishesApi.getAllDishesByRestaurant({
        limit,
        page,
        order,
        restaurantId,
        startDate,
        endDate,
        status,
        price
      })
      dispatch(setDishes(response.data.data))
      return response
    } catch (error) {
      dispatch(setError("Error fetching dishes"))
      throw error
    }
  }
)

export const createDish = createAsyncThunk("dishes/createDish", async (formData, { dispatch }) => {
  try {
    const response = await dishesApi.createDish(formData)
    dispatch(fetchDishes())

    if (response.error) {
      toast.error(`Fallo al crear el platillo. Por favor intente de nuevo. ${response.message}`, {
        duration: 7000
      })
    } else {
      toast.success("Platillo creado exitosamente", {
        duration: 7000
      })
    }
    return response.data
  } catch (error) {
    dispatch(setError("Error creating dish"))
    toast.error("Fallo al crear el platillo. Por favor intente de nuevo.", {
      duration: 7000
    })

    throw error
  }
})

export const updateDish = createAsyncThunk("dishes/updateDish", async ({ formData, dishId }, { dispatch }) => {
  try {
    const response = await dishesApi.updateDish(formData, dishId)

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
    dispatch(setError("Error updating dish"))
    toast.error("Fallo al actualizar el platillo. Por favor intente de nuevo.", {
      duration: 7000
    })

    throw error
  }
})

export const dishesSlice = createSlice({
  name: "dishes",
  initialState,
  reducers: {
    setFilters: (state, action) => {
      state.filters = action.payload
    },
    setPage: (state, action) => {
      state.currentPage = action.payload
    },
    setDishes: (state, action) => {
      state.dishes = action.payload
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
      .addCase(fetchDishes.pending, (state) => {
        state.status = "loading"
      })
      .addCase(fetchDishes.fulfilled, (state, action) => {
        state.status = "succeeded"
        state.totalItems = action.payload.results
        state.value = action.payload
      })
      .addCase(fetchDishes.rejected, (state, action) => {
        state.status = "failed"
        state.error = action.error
      })
  }
})

export const { setDishes, setError, setPage, setFilters } = dishesSlice.actions

export const setLoading = (state) => state.dishes.loading

export const selectAllDishes = (state) => state.dishes.dishes

export const selectDishesStatus = (state) => state.dishes.status

export const selectDishesError = (state) => state.dishes.error

export default dishesSlice.reducer
