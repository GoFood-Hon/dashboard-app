// import { configureStore, combineReducers } from "@reduxjs/toolkit"
// import userReducer from "./features/userSlice"
// import restaurantsReducer from "./features/restaurantSlice"
// import dishesReducer from "./features/dishesSlice"
// import complementsReducer from "./features/complementsSlice"
// import dishesCategoriesReducer from "./features/categorySlice"
// import menuReducer from "./features/menuSlice"
// import branchReducer from "./features/branchesSlice"
// import plansReducer from "./features/plansSlice"
// import kitchenAndTagsReducer from "./features/kitchenAndTagsSlice"
// import reservationsReducer from "./features/reservationsSlice"
// import collectionsReducer from "./features/collectionsSlice"
// import ordersReducer from "./features/ordersSlice"
// import authReducer from "./features/authSlice"
// import loyaltyReducer from "./features/loyaltySlice"
// import promotionsReducer from "./features/promotionsSlice"
// import couponsReducer from "./features/couponsSlice"
// import statsReducer from "./features/statsSlice"
// import reviewsReducer from "./features/reviewsSlice"
// import { tokenRefreshMiddleware } from "./features/tokenRefreshMiddleware"

// const appReducer = combineReducers({
//   user: userReducer,
//   menus: menuReducer,
//   branches: branchReducer,
//   restaurants: restaurantsReducer,
//   dishes: dishesReducer,
//   complements: complementsReducer,
//   dishesCategories: dishesCategoriesReducer,
//   plans: plansReducer,
//   kitchenAndTags: kitchenAndTagsReducer,
//   reservations: reservationsReducer,
//   collections: collectionsReducer,
//   orders: ordersReducer,
//   auth: authReducer,
//   loyalty: loyaltyReducer,
//   promotions: promotionsReducer,
//   coupons: couponsReducer,
//   stats: statsReducer,
//   reviews: reviewsReducer
// })

// const rootReducer = (state, action) => {
//   if (action.type === "auth/logout") {
//     return appReducer(undefined, action)
//   }

//   return appReducer(state, action)
// }

// export const store = configureStore({
//   reducer: rootReducer,
//   middleware: (getDefaultMiddleware) =>
//     getDefaultMiddleware({
//       serializableCheck: false
//     }).concat(tokenRefreshMiddleware)
// })

import { configureStore, combineReducers } from "@reduxjs/toolkit"

import * as userSlice from "./features/userSlice"
import * as restaurantSlice from "./features/restaurantSlice"
import * as dishesSlice from "./features/dishesSlice"
import * as complementsSlice from "./features/complementsSlice"
import * as dishesCategoriesSlice from "./features/categorySlice"
import * as menuSlice from "./features/menuSlice"
import * as branchSlice from "./features/branchesSlice"
import * as plansSlice from "./features/plansSlice"
import * as kitchenAndTagsSlice from "./features/kitchenAndTagsSlice"
import * as reservationsSlice from "./features/reservationsSlice"
import * as collectionsSlice from "./features/collectionsSlice"
import * as ordersSlice from "./features/ordersSlice"
import * as authSlice from "./features/authSlice"
import * as loyaltySlice from "./features/loyaltySlice"
import * as promotionsSlice from "./features/promotionsSlice"
import * as couponsSlice from "./features/couponsSlice"
import * as statsSlice from "./features/statsSlice"
import * as reviewsSlice from "./features/reviewsSlice"

import { tokenRefreshMiddleware } from "./features/tokenRefreshMiddleware"

const appReducer = combineReducers({
  user: userSlice.default,
  menus: menuSlice.default,
  branches: branchSlice.default,
  restaurants: restaurantSlice.default,
  dishes: dishesSlice.default,
  complements: complementsSlice.default,
  dishesCategories: dishesCategoriesSlice.default,
  plans: plansSlice.default,
  kitchenAndTags: kitchenAndTagsSlice.default,
  reservations: reservationsSlice.default,
  collections: collectionsSlice.default,
  orders: ordersSlice.default,
  auth: authSlice.default,
  loyalty: loyaltySlice.default,
  promotions: promotionsSlice.default,
  coupons: couponsSlice.default,
  stats: statsSlice.default,
  reviews: reviewsSlice.default
})

const rootReducer = (state, action) => {
  if (action.type === "auth/logout") {
    return appReducer(undefined, action)
  }
  return appReducer(state, action)
}

const collectThunks = (...slices) => {
  const thunks = {}

  for (const slice of slices) {
    for (const value of Object.values(slice)) {
      if (value?.typePrefix) {
        thunks[value.typePrefix] = value
      }
    }
  }

  return thunks
}

const allThunks = collectThunks(
  userSlice,
  restaurantSlice,
  dishesSlice,
  complementsSlice,
  dishesCategoriesSlice,
  menuSlice,
  branchSlice,
  plansSlice,
  kitchenAndTagsSlice,
  reservationsSlice,
  collectionsSlice,
  ordersSlice,
  authSlice,
  loyaltySlice,
  promotionsSlice,
  couponsSlice,
  statsSlice,
  reviewsSlice
)

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
      thunk: {
        extraArgument: {
          thunks: allThunks
        }
      }
    }).concat(tokenRefreshMiddleware)
})

store.extraArgument = allThunks;