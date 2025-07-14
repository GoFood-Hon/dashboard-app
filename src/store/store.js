import { configureStore, combineReducers } from "@reduxjs/toolkit"
import userReducer from "./features/userSlice"
import restaurantsReducer from "./features/restaurantSlice"
import dishesReducer from "./features/dishesSlice"
import complementsReducer from "./features/complementsSlice"
import dishesCategoriesReducer from "./features/categorySlice"
import menuReducer from "./features/menuSlice"
import branchReducer from "./features/branchesSlice"
import plansReducer from "./features/plansSlice"
import kitchenAndTagsReducer from "./features/kitchenAndTagsSlice"
import reservationsReducer from "./features/reservationsSlice"
import collectionsReducer from "./features/collectionsSlice"
import ordersReducer from "./features/ordersSlice"
import authReducer from "./features/authSlice"
import loyaltyReducer from "./features/loyaltySlice"
import promotionsReducer from "./features/promotionsSlice"
import couponsReducer from "./features/couponsSlice"
import statsReducer from "./features/statsSlice"
import reviewsReducer from "./features/reviewsSlice"

const appReducer = combineReducers({
  user: userReducer,
  menus: menuReducer,
  branches: branchReducer,
  restaurants: restaurantsReducer,
  dishes: dishesReducer,
  complements: complementsReducer,
  dishesCategories: dishesCategoriesReducer,
  plans: plansReducer,
  kitchenAndTags: kitchenAndTagsReducer,
  reservations: reservationsReducer,
  collections: collectionsReducer,
  orders: ordersReducer,
  auth: authReducer,
  loyalty: loyaltyReducer,
  promotions: promotionsReducer,
  coupons: couponsReducer,
  stats: statsReducer,
  reviews: reviewsReducer
})

const rootReducer = (state, action) => {
  if (action.type === "auth/logout") {
    return appReducer(undefined, action)
  }

  return appReducer(state, action)
}

export const store = configureStore({
  reducer: rootReducer
})
