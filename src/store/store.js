import { configureStore } from "@reduxjs/toolkit"
import userReducer from "./features/userSlice"
import dishesReducer from "./features/DishesSlice"
import complementsReducer from "./features/complementsSlice"
import dishesCategoriesReducer from "./features/categorySlice"

export const store = configureStore({
  reducer: {
    user: userReducer,
    dishes: dishesReducer,
    complements: complementsReducer,
    dishesCategories: dishesCategoriesReducer
  }
})
