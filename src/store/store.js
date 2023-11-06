import { configureStore } from "@reduxjs/toolkit"
import userReducer from "./features/userSlice"
import restaurantReducer from "./features/restaurantSlice"
import dishesReducer from "./features/DishesSlice"
import complementsReducer from "./features/complementsSlice"
import dishesCategoriesReducer from "./features/categorySlice"

export const store = configureStore({
  reducer: {
    user: userReducer,
    restaurant: restaurantReducer,
    dishes: dishesReducer,
    complements: complementsReducer,
    dishesCategories: dishesCategoriesReducer
  }
})
