import { configureStore } from "@reduxjs/toolkit"
import userReducer from "./features/userSlice"
import restaurantsReducer from "./features/restaurantSlice"
import dishesReducer from "./features/dishesSlice"
import complementsReducer from "./features/complementsSlice"
import dishesCategoriesReducer from "./features/categorySlice"
import menuReducer from "./features/menuSlice"
import branchReducer from "./features/branchesSlice"
import plansReducer from "./features/plansSlice"

export const store = configureStore({
  reducer: {
    user: userReducer,
    menus: menuReducer,
    branches: branchReducer,
    restaurants: restaurantsReducer,
    dishes: dishesReducer,
    complements: complementsReducer,
    dishesCategories: dishesCategoriesReducer,
    plans: plansReducer
  }
})
