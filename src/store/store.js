import { configureStore } from "@reduxjs/toolkit"
import userReducer from "./features/userSlice"
import restaurantReducer from "./features/restaurantSlice"
import dishesReducer from "./features/dishesSlice"
import complementsReducer from "./features/complementsSlice"
import dishesCategoriesReducer from "./features/categorySlice"
import menuReducer from "./features/menuSlice"
import branchReducer from "./features/branchesSlice"

export const store = configureStore({
  reducer: {
    user: userReducer,
    menus: menuReducer,
    branches: branchReducer,
    restaurant: restaurantReducer,
    dishes: dishesReducer,
    complements: complementsReducer,
    dishesCategories: dishesCategoriesReducer
  }
})
