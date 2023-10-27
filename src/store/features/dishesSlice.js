import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import dishesApi from "../../api/dishesApi"

export const fetchDishes = createAsyncThunk("dishes/fetchDishes", async (_, { dispatch }) => {
  try {
    const response = await dishesApi.getAllDishes()
    dispatch(setDishes(response.data))
  } catch (error) {
    dispatch(setError("Error fetching dishes"))
    throw error
  }
})

const initialState = {
  dishes: [],
  status: "idle",
  error: null
}

export const dishesSlice = createSlice({
  name: "dishes",
  initialState,
  reducers: {
    setDishes: (state, action) => {
      state.dishes = action.payload
      state.status = "succeeded"
    },
    setError: (state, action) => {
      state.status = "failed"
      state.error = action.payload
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchDishes.pending, (state) => {
        state.status = "loading"
      })
      .addCase(fetchDishes.fulfilled, (state, action) => {
        state.status = "succeeded"
        state.value = action.payload
      })
      .addCase(fetchDishes.rejected, (state, action) => {
        state.status = "failed"
        state.error = action.error.message
      })
  }
})

export const { setDishes, setError } = dishesSlice.actions

export const selectAllDishes = (state) => state.dishes.dishes

export const selectDishesStatus = (state) => state.dishes.status

export const selectDishesError = (state) => state.dishes.error

export default dishesSlice.reducer
