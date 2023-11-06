import { createSlice } from "@reduxjs/toolkit"

const initialState = {
  value: JSON.parse(localStorage.getItem("restaurant")) || {}
}

export const restaurantSlice = createSlice({
  name: "restaurant",
  initialState,
  reducers: {
    setRestaurant: (state, action) => {
      state.value = action.payload
      localStorage.setItem("restaurant", JSON.stringify(action.payload))
    }
  }
})

export const { setRestaurant } = restaurantSlice.actions

export default restaurantSlice.reducer
