import restaurantsApi from "../../api/restaurantApi"
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import { ITEMS_PER_PAGE_CARDS } from "../../utils/paginationConfig"
import toast from "react-hot-toast"
import { showNotification } from "@mantine/notifications"

const initialState = {
  restaurants: [],
  itemsPerPage: ITEMS_PER_PAGE_CARDS,
  restaurantsPerPage: [],
  totalRestaurants: 0,
  totalPagesCount: 0,
  currentPage: 1,
  loadingRestaurants: false,
  creatingRestaurant: false,
  updatingRestaurant: false,
  totalItems: 0,
  loading: false,
  imageUrl: "",
  filters: {
    startDate: null,
    endDate: null,
    status: null,
    startPrice: null
  }
}

export const fetchRestaurants = createAsyncThunk(
  "restaurants/fetchRestaurants",
  async ({ limit, page, order, search, search_field }, { dispatch }) => {
    try {
      dispatch(setLoading(true))

      const response = await restaurantsApi.getAllRestaurants({
        limit,
        page,
        order,
        search,
        search_field
      })

      dispatch(setRestaurants(response.data))
      dispatch(setLoading(false))
      return { data: response.data, results: response.results, page }
    } catch (error) {
      dispatch(setLoading(false))
      dispatch(setError("Error fetching menus"))
      throw error
    }
  }
)

export const createRestaurant = createAsyncThunk(
  "restaurants/createRestaurant",
  async ({ params, imageParams }, { rejectWithValue }) => {
    try {
      const response = await restaurantsApi.createRestaurant(params)
      const restaurantData = response.data

      if (response.error) {
        showNotification({
          title: "Error",
          message: response.message,
          color: "red"
        })

        return rejectWithValue(response.message)
      }

      let images = []
      if (imageParams) {
        const imageResponse = await restaurantsApi.addImage(restaurantData.id, imageParams)
        images = imageResponse.data.images

        if (imageResponse.error) {
          showNotification({
            title: "Error",
            message: imageResponse.message,
            color: "red"
          })

          return rejectWithValue(imageResponse.message)
        }
      }

      showNotification({
        title: "Creación exitosa",
        message: `Se creó el restaurante ${restaurantData.name}`,
        color: "green"
      })

      return { ...restaurantData, images }
    } catch (error) {
      return rejectWithValue(error.response?.data || "Error al crear el restaurante")
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
      showNotification({
        title: "Error",
        message: response.error,
        color: "red",
        duration: 7000
      })
      return {}
    } else {
      dispatch(setRestaurantData(response.data))
      dispatch(setLoading(false))
      dispatch(setImageUrl(response?.data?.images[0].location))
      return response.data
    }
  } catch (error) {
    showNotification({
      title: "Error",
      message: error,
      color: "red",
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
        showNotification({
          title: "Error",
          message: response.message,
          color: "red",
          duration: 7000
        })
      }
      dispatch(setLoading(false))
      return response.data
    } catch (error) {
      dispatch(setLoading(false))
      dispatch(setError("Error updating restaurant"))

      showNotification({
        title: "Error",
        message: error,
        color: "red",
        duration: 7000
      })

      throw error
    }
  }
)

export const updateRestaurantStatus = createAsyncThunk(
  "restaurant/updateRestaurantStatus",
  async ({ data, propertyToUpdate = "all" }) => {
    try {
      const formData = updateFormData(data, propertyToUpdate)
      const response = await restaurantsApi.updateRestaurant(formData, data?.id)

      if (response.error) {
        showNotification({
          title: "Error",
          message: response.message,
          color: "red",
          duration: 7000
        })
      }
      return response.data
    } catch (error) {
      showNotification({
        title: "Error",
        message: error,
        color: "red",
        duration: 7000
      })

      throw error
    }
  }
)

export const updateRestaurantData = createAsyncThunk(
  "restaurant/updateRestaurantData",
  async ({ formData, restaurantId, formDataImage }, { rejectWithValue }) => {
    try {
      const response = await restaurantsApi.updateRestaurant(formData, restaurantId)
      let restaurantData = response.data

      if (response.error) {
        showNotification({
          title: "Error",
          message: response.message,
          color: "red"
        })

        return rejectWithValue(response.message)
      }

      if (formDataImage) {
        const imageResponse = await restaurantsApi.addImage(restaurantId, formDataImage)

        if (imageResponse.error) { 
          showNotification({
            title: "Error",
            message: imageResponse.message,
            color: "red"
          })

          return rejectWithValue(imageResponse.message)
        }

        restaurantData = { ...restaurantData, images: imageResponse.data.images }
      }

      showNotification({
        title: "Actualización exitosa",
        message: `El restaurante ${restaurantData.name} fue actualizado`,
        color: "green"
      })

      return restaurantData
    } catch (error) {
      showNotification({
        title: "Error",
        message: error,
        color: "red",
        duration: 7000
      })
    }
  }
)

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
        state.loadingRestaurants = true
      })
      .addCase(fetchRestaurants.fulfilled, (state, action) => {
        const { data, results, page } = action.payload
        state.restaurantsPerPage[page] = data

        state.loadingRestaurants = false
        state.currentPage = page
        state.totalRestaurants = results
        state.totalPagesCount = Math.ceil(results / action.meta.arg.limit)
      })
      .addCase(fetchRestaurants.rejected, (state, action) => {
        state.loadingRestaurants = false
        state.error = action.error
      })
      .addCase(updateRestaurantStatus.fulfilled, (state, action) => {
        const { id, isActive } = action.payload
        const currentPageRestaurants = state.restaurantsPerPage[state.currentPage]
        const index = currentPageRestaurants.findIndex((restaurant) => restaurant?.id === id)

        if (index !== -1) {
          currentPageRestaurants[index] = { ...currentPageRestaurants[index], isActive }
        }
      })
      .addCase(updateRestaurantStatus.rejected, (state) => {
        state.loading = false
      })
      .addCase(updateRestaurantData.pending, (state) => {
        state.updatingRestaurant = true
      })
      .addCase(updateRestaurantData.fulfilled, (state, action) => {
        const { id, name, socialReason, images } = action.payload
        const currentPageRestaurants = state.restaurantsPerPage[state.currentPage]
        const index = currentPageRestaurants.findIndex((restaurant) => restaurant?.id == id)

        state.updatingRestaurant = false
        if (index !== -1) {
          currentPageRestaurants[index] = {
            ...currentPageRestaurants[index],
            name,
            socialReason,
            images: images
          }
        }
      })
      .addCase(updateRestaurantData.rejected, (state) => {
        state.updatingRestaurant = false
      })
      .addCase(createRestaurant.pending, (state) => {
        state.creatingRestaurant = true
      })
      .addCase(createRestaurant.fulfilled, (state, action) => {
        const newRestaurant = action.payload

        // Insertamos el nuevo restaurante al comienzo  de la primera página
        if (!state.restaurantsPerPage[1]) {
          state.restaurantsPerPage[1] = []
        }
        state.restaurantsPerPage[1].unshift(newRestaurant)

        // Pasamos el último objeto de cada página a la primera posición de la página siguiente
        for (let i = 1; i <= state.totalPagesCount; i++) {
          if (state.restaurantsPerPage[i]?.length > state.itemsPerPage) {
            const lastItem = state.restaurantsPerPage[i].pop()
            if (state.restaurantsPerPage[i + 1]) {
              state.restaurantsPerPage[i + 1].unshift(lastItem)
            }
          } else {
            break
          }
        }

        // Eliminamos del estado las páginas no consecutivas
        const consecutivePages = [1]
        for (let i = 2; i <= state.totalPagesCount; i++) {
          if (state.restaurantsPerPage[i]) {
            if (consecutivePages.includes(i - 1)) {
              consecutivePages.push(i)
            } else {
              delete state.restaurantsPerPage[i]
            }
          }
        }

        // Actualizamos el conteo de restaurantes para que se  ajuste a la cantidad de páginas a mostrar
        state.totalRestaurants += 1
        state.totalPagesCount = Math.ceil(state.totalRestaurants / state.itemsPerPage)
        state.creatingRestaurant = false
      })
      .addCase(createRestaurant.rejected, (state) => {
        state.creatingRestaurant = false
      })
  }
})

export const { setRestaurants, setRestaurantData, setPage, setFilters, setLoading, setImageUrl } = restaurantsSlice.actions

export const selectAllRestaurants = (state) => state.restaurants.restaurants

export const selectLoading = (state) => state.restaurants.loading

export const selectRestaurantsStatus = (state) => state.restaurants.status

export const selectImage = (state) => state.restaurants.imageUrl

export default restaurantsSlice.reducer
