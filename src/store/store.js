import { configureStore } from "@reduxjs/toolkit"
import userReducer from "./features/userSlice"
import restaurantReducer from "./features/restaurantSlice"
import dishesReducer from "./features/DishesSlice"
import complementsReducer from "./features/complementsSlice"
import dishesCategoriesReducer from "./features/categorySlice"
import menuReducer from "./features/menuSlice"

export const store = configureStore({
  reducer: {
    user: userReducer,
    menus: menuReducer,
    restaurant: restaurantReducer,
    dishes: dishesReducer,
    complements: complementsReducer,
    dishesCategories: dishesCategoriesReducer
  }
})
