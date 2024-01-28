import restaurantsApi from "../../api/restaurantApi"
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import { ITEMS_PER_PAGE } from "../../utils/paginationConfig"
import toast from "react-hot-toast"

const initialState = {
  restaurants: [],
  currentPage: 1,
  itemsPerPage: ITEMS_PER_PAGE,
  totalItems: 0,
  loading: false,
  imageUrl: "",
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
      dispatch(setLoading(true))

      const response = await restaurantsApi.getAllRestaurants({
        limit,
        page,
        order
      })

      dispatch(setRestaurants(response.data))
      dispatch(setLoading(false))
      return response
    } catch (error) {
      dispatch(setLoading(false))
      dispatch(setError("Error fetching menus"))
      throw error
    }
  }
)

/*
 * GET RESTAURANT INDIVIDUAL
 */

export const fetchRestaurantData = createAsyncThunk("restaurants/fetchRestaurantData", async ({ restaurantId }, { dispatch }) => {
  try {
    dispatch(setLoading(true))
    const response = await restaurantsApi.getRestaurant(restaurantId)

    if (response.error) {
      toast.error(`Fallo obtener la información del restaurante ${response.message}`, {
        duration: 7000
      })
      return {}
    } else {
      dispatch(setRestaurantData(response.data))
      dispatch(setLoading(false))
      dispatch(setImageUrl(response.data.images[0].location))
      return response.data
    }
  } catch (error) {
    toast.error(`Fallo al obtener la información del restaurante. Intente de nuevo.`, {
      duration: 7000
    })
    dispatch(setLoading(false))
    throw error
  }
})

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
      dispatch(setLoading(true))

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
      dispatch(setLoading(false))
      return response.data
    } catch (error) {
      dispatch(setLoading(false))
      dispatch(setError("Error updating restaurant"))
      toast.error("Fallo al actualizar el restaurante. Por favor intente de nuevo.", {
        duration: 7000
      })

      throw error
    }
  }
)

/*
 * UPDATE RES INDIVIDUAL
 */

/*
 *  UPDATE IMAGE
 */

const uploadRestaurantImage = async (restaurantId, file) => {
  const formDataImage = new FormData()
  formDataImage.append("files", file)

  return await restaurantsApi.addImage(restaurantId, formDataImage)
}

export const updateRestaurantData = createAsyncThunk(
  "restaurant/updateRestaurantData",
  async ({ data, restaurantId, formData }, { dispatch }) => {
    try {
      dispatch(setLoading(true))
      const response = await restaurantsApi.updateRestaurant(formData, restaurantId)

      if (response.error) {
        toast.error(`Fallo al actualizar la información del negocio. Por favor intente de nuevo. ${response.message}`, {
          duration: 7000
        })
      } else {
        if (data && data.files) {
          await uploadRestaurantImage(restaurantId, data?.files?.[0])
        }
        toast.success("Negocio actualizado exitosamente", {
          duration: 7000
        })
      }

      dispatch(setRestaurantData(response.data.data))
      dispatch(setLoading(false))
      return response.data
    } catch (error) {
      dispatch(setLoading(false))
      dispatch(setError("Error updating restaurant"))
      toast.error(`Fallo al actualizar la información del negocio. Por favor intente de nuevo!. ${error}`, {
        duration: 7000
      })
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
    setLoading: (state, action) => {
      state.loading = action.payload
    },
    setImageUrl: (state, action) => {
      state.imageUrl = action.payload
    },
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
    setRestaurantData: (state, action) => {
      state.restaurants = action.payload
    },
    setError: (state, action) => {
      state.status = "failed"
      state.error = action.payload
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
      .addCase(updateRestaurantData.pending, (state) => {
        state.loading = true
      })
      .addCase(updateRestaurantData.fulfilled, (state) => {
        state.loading = false
      })
      .addCase(updateRestaurantData.rejected, (state) => {
        state.loading = false
      })
  }
})

export const { setRestaurants, setRestaurantData, setPage, setFilters, setLoading, setImageUrl } = restaurantsSlice.actions

export const selectAllRestaurants = (state) => state.restaurants.restaurants

export const selectLoading = (state) => state.restaurants.loading

export const selectImage = (state) => state.restaurants.imageUrl

export default restaurantsSlice.reducer
