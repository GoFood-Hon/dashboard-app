import restaurantsApi from "../../api/restaurantApi"
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import { ITEMS_PER_PAGE } from "../../utils/paginationConfig"

const initialState = {
  restaurants: [],
  currentPage: 1,
  itemsPerPage: ITEMS_PER_PAGE,
  totalItems: 0,
  filters: {
    startDate: null,
    endDate: null,
    status: null,
    startPrice: null,
    endPrice: null
  }
}
/*
 * GET RESTAURANTS
 */

export const fetchRestaurants = createAsyncThunk(
  "restaurants/fetchRestaurants",
  async ({ limit, page, order, category }, { dispatch }) => {
    try {
      const response = await restaurantsApi.getAllRestaurants({
        limit,
        page,
        order
      })

      dispatch(setRestaurants(response.data))
      return response
    } catch (error) {
      dispatch(setError("Error fetching menus"))
      throw error
    }
  }
)

/*
 * UPDATE RES
 */

const updateFormData = (data, propertyToUpdate) => {
  const formData = new FormData()

  if (propertyToUpdate === "isActive") {
    formData.append("isActive", data.isActive)
  } else {
    /*  formData.append("name", data.name)
    formData.append("price", data.price)
    formData.append("description", data.description)
    formData.append("includesDrink", data.includeDrink)
    formData.append("endPrice", data.endPrice)
    formData.append("categoryId", data.categoryId)
    formData.append("restaurantId", data.restaurantId)
    formData.append("preparationTime", data?.preparationTime) */
  }

  return formData
}
export const updateRestaurant = createAsyncThunk(
  "restaurant/updateRestaurant",
  async ({ data, propertyToUpdate = "all" }, { dispatch }) => {
    try {
      const formData = updateFormData(data, propertyToUpdate)

      const response = await restaurantsApi.updateRestaurant(formData, data?.id)

      if (response.error) {
        toast.error(`Fallo al actualizar el restaurante. Por favor intente de nuevo. ${response.message}`, {
          duration: 7000
        })
      } else {
        toast.success("Restaurante actualizado exitosamente", {
          duration: 7000
        })
      }
      return response.data
    } catch (error) {
      dispatch(setError("Error updating restaurant"))
      toast.error("Fallo al actualizar el restaurante. Por favor intente de nuevo.", {
        duration: 7000
      })

      throw error
    }
  }
)

/*
 * RES SLICE
 */

export const restaurantsSlice = createSlice({
  name: "restaurants",
  initialState,
  reducers: {
    setFilters: (state, action) => {
      state.filters = action.payload
    },
    setPage: (state, action) => {
      state.currentPage = action.payload
    },
    setRestaurants: (state, action) => {
      state.restaurants = action.payload
      state.status = "succeeded"
    },
    setError: (state, action) => {
      state.status = "failed"
      state.error = action.payload
    },
    setLoading: (state, action) => {
      state.loading = action.payload
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchRestaurants.pending, (state) => {
        state.status = "loading"
      })
      .addCase(fetchRestaurants.fulfilled, (state, action) => {
        state.status = "succeeded"
        state.totalItems = action.payload.results
        state.value = action.payload
      })
      .addCase(fetchRestaurants.rejected, (state, action) => {
        state.status = "failed"
        state.error = action.error
      })
  }
})

export const { setRestaurants, setPage, setFilters } = restaurantsSlice.actions

export const selectAllRestaurants = (state) => state.restaurants.restaurants

export default restaurantsSlice.reducer
