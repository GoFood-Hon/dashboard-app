import restaurantsApi from "../../api/restaurantApi"
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"

const initialState = {
  value: JSON.parse(localStorage.getItem("restaurant")) || {}
}

/*
 * GET RESTAURANTS
 */

export const fetchRestaurants = createAsyncThunk("restaurants/fetchRestaurants", async ({ restaurantId }, { dispatch }) => {
  try {
    const response = await restaurantsApi.getAllRestaurants({
      restaurantId
    })

    dispatch(setMenus(response.data))
    return response
  } catch (error) {
    dispatch(setError("Error fetching menus"))
    throw error
  }
})

export const restaurantSlice = createSlice({
  name: "restaurant",
  initialState,
  reducers: {
    setRestaurant: (state, action) => {
      state.value = action.payload
      // localStorage.setItem("restaurant", JSON.stringify(action.payload))
    }
  }
})

export const { setRestaurant } = restaurantSlice.actions

export default restaurantSlice.reducer
