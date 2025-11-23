import restaurantsApi from "../../api/restaurantApi"
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import { ITEMS_PER_PAGE_CARDS } from "../../utils/paginationConfig"
import { showNotification } from "@mantine/notifications"

const initialState = {
  restaurants: [],
  allRestaurants: [],
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
  },
  searchData: null,
  searchField: "name"
}

export const fetchRestaurants = createAsyncThunk(
  "restaurants/fetchRestaurants",
  async ({ limit, page, order, search, search_field }, { dispatch, rejectWithValue }) => {
    try {
      const response = await restaurantsApi.getAllRestaurants({
        limit,
        page,
        order,
        search,
        search_field
      })

      return { data: response.data, results: response.results, page }
    } catch (error) {
      if (error?.response?.data?.status !== "token_expired") {
        showNotification({
          title: "Error",
          message: error.response?.data?.message || "Error al obtener los comercios",
          color: "red"
        })
      }

      return rejectWithValue(error.response?.data || "Error al obtener los comercios")
    }
  }
)

export const fetchNoPaginatedRestaurants = createAsyncThunk(
  "restaurants/fetchNoPaginatedRestaurants",
  async (_, { rejectWithValue }) => {
    try {
      const response = await restaurantsApi.getAllRestaurantsNoPagination({
        order: "DESC",
        orderBy: "created_at"
      })
      return response.data
    } catch (error) {
      if (error?.response?.data?.status !== "token_expired") {
        showNotification({
          title: "Error",
          message: error.response?.data?.message || "Error al obtener los comercios",
          color: "red"
        })
      }

      return rejectWithValue(error.response?.data || "Error al obtener los comercios")
    }
  }
)

export const createRestaurant = createAsyncThunk(
  "restaurants/createRestaurant",
  async ({ params, imageParams, formDataBanner }, { rejectWithValue }) => {
    try {
      const response = await restaurantsApi.createRestaurant(params)
      const restaurantData = response.data

      let images = []
      if (imageParams) {
        const imageResponse = await restaurantsApi.addImage(restaurantData.id, imageParams)
        images = imageResponse.data.images
      }

      if (formDataBanner) {
        await restaurantsApi.updateBannerImage(restaurantData.id, formDataBanner)
      }

      showNotification({
        title: "Creación exitosa",
        message: `Se creó el comercio ${restaurantData.name}`,
        color: "green"
      })

      return { ...restaurantData, images }
    } catch (error) {
      if (error?.response?.data?.status !== "token_expired") {
        showNotification({
          title: "Error",
          message: error.response?.data?.message || "Error al crear el comercio",
          color: "red"
        })
      }

      return rejectWithValue(error.response?.data || "Error al crear el comercio")
    }
  }
)

export const fetchRestaurantData = createAsyncThunk("restaurants/fetchRestaurantData", async ({ restaurantId }, { dispatch }) => {
  try {
    dispatch(setLoading(true))
    const response = await restaurantsApi.getRestaurant(restaurantId)

    dispatch(setRestaurantData(response.data))
    dispatch(setLoading(false))
    dispatch(setImageUrl(response?.data?.images[0].location))
    return response.data
  } catch (error) {
    if (error?.response?.data?.status !== "token_expired") {
      showNotification({
        title: "Error",
        message: error.response?.data?.message || "Error al obtener los datos del comercio",
        color: "red"
      })
    }

    return rejectWithValue(error.response?.data || "Error al obtener los datos del comercio")
  }
})

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
      const formData = updateFormData(data, propertyToUpdate)
      const response = await restaurantsApi.updateRestaurant(formData, data?.id)

      return response.data
    } catch (error) {
      if (error?.response?.data?.status !== "token_expired") {
        showNotification({
          title: "Error",
          message: error.response?.data?.message || "Error al actualizar el comercio",
          color: "red"
        })
      }

      return rejectWithValue(error.response?.data || "Error al actualizar el comercio")
    }
  }
)

export const updateRestaurantStatus = createAsyncThunk("restaurant/updateRestaurantStatus", async ({ params, restaurantId }) => {
  try {
    const response = await restaurantsApi.updateRestaurant(params, restaurantId)

    return response.data
  } catch (error) {
    if (error?.response?.data?.status !== "token_expired") {
      showNotification({
        title: "Error",
        message: error.response?.data?.message || "Error al actualizar el estado del comercio",
        color: "red"
      })
    }

    return rejectWithValue(error.response?.data || "Error al actualizar el estado del comercio")
  }
})

export const updateRestaurantData = createAsyncThunk(
  "restaurant/updateRestaurantData",
  async ({ formData, restaurantId, formDataImage, formDataBanner }, { rejectWithValue }) => {
    try {
      const response = await restaurantsApi.updateRestaurant(formData, restaurantId)
      let restaurantData = response.data

      if (formDataImage) {
        const imageResponse = await restaurantsApi.addImage(restaurantId, formDataImage)

        restaurantData = { ...restaurantData, images: imageResponse.data.images }
      }

      if (formDataBanner) {
        await restaurantsApi.updateBannerImage(restaurantId, formDataBanner)
      }

      showNotification({
        title: "Actualización exitosa",
        message: `El comercio ${restaurantData.name} fue actualizado`,
        color: "green"
      })

      return restaurantData
    } catch (error) {
      if (error?.response?.data?.status !== "token_expired") {
        showNotification({
          title: "Error",
          message: error.response?.data?.message || "Error al actualizar el comercio",
          color: "red"
        })
      }

      return rejectWithValue(error.response?.data || "Error al actualizar el comercio")
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
    },
    setSearchData: (state, action) => {
      state.searchData = action.payload
    },
    setSelectedSearchOption: (state, action) => {
      state.searchField = action.payload
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
      .addCase(fetchNoPaginatedRestaurants.pending, (state) => {
        state.loadingRestaurants = true
      })
      .addCase(fetchNoPaginatedRestaurants.fulfilled, (state, action) => {
        state.allRestaurants = action.payload
        state.loadingRestaurants = false
      })
      .addCase(fetchNoPaginatedRestaurants.rejected, (state, action) => {
        state.loadingRestaurants = false
        state.error = action.error
      })
      .addCase(updateRestaurantStatus.fulfilled, (state, action) => {
        const { id, isActive } = action.payload
        const currentPageRestaurants = state.restaurantsPerPage[state.currentPage]
        if (currentPageRestaurants && currentPageRestaurants.length > 0) {
          const index = currentPageRestaurants.findIndex((restaurant) => restaurant?.id === id)

          if (index !== -1) {
            currentPageRestaurants[index] = { ...currentPageRestaurants[index], isActive }
          }
        }
      })
      .addCase(updateRestaurantStatus.rejected, (state) => {
        state.loading = false
      })
      .addCase(updateRestaurantData.pending, (state) => {
        state.updatingRestaurant = true
      })
      .addCase(updateRestaurantData.fulfilled, (state, action) => {
        const { id } = action.payload
        const currentPageRestaurants = state.restaurantsPerPage[state.currentPage]
        if (currentPageRestaurants && currentPageRestaurants.length > 0) {
          const index = currentPageRestaurants.findIndex((restaurant) => restaurant?.id == id)

          if (state.restaurantsPerPage.length !== 0 && index !== -1) {
            currentPageRestaurants[index] = action.payload
          }
        }
        state.updatingRestaurant = false
      })
      .addCase(updateRestaurantData.rejected, (state) => {
        state.updatingRestaurant = false
      })
      .addCase(createRestaurant.pending, (state) => {
        state.creatingRestaurant = true
      })
      .addCase(createRestaurant.fulfilled, (state, action) => {
        const newRestaurant = action.payload

        if (!state.restaurantsPerPage[1]) {
          state.restaurantsPerPage[1] = []
        }
        state.restaurantsPerPage[1].unshift(newRestaurant)

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

        state.totalRestaurants += 1
        state.totalPagesCount = Math.ceil(state.totalRestaurants / state.itemsPerPage)
        state.creatingRestaurant = false
      })
      .addCase(createRestaurant.rejected, (state) => {
        state.creatingRestaurant = false
      })
  }
})

export const {
  setRestaurants,
  setRestaurantData,
  setPage,
  setFilters,
  setLoading,
  setImageUrl,
  setSearchData,
  setSelectedSearchOption
} = restaurantsSlice.actions

export const selectAllRestaurants = (state) => state.restaurants.restaurants

export const selectLoading = (state) => state.restaurants.loading

export const selectRestaurantsStatus = (state) => state.restaurants.status

export const selectImage = (state) => state.restaurants.imageUrl

export default restaurantsSlice.reducer
