import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import dishesApi from "../../api/dishesApi"
import toast from "react-hot-toast"
import { ITEMS_PER_PAGE_CARDS } from "../../utils/paginationConfig"
import { convertToDecimal } from "../../utils"
import extrasApi from "../../api/extrasApi"
import { showNotification } from "@mantine/notifications"

const initialState = {
  dishes: [],
  totalItems: 0,
  itemsPerPage: ITEMS_PER_PAGE_CARDS,
  dishesPerPage: [],
  totalDishes: 0,
  totalPagesCount: 0,
  currentPage: 1,
  loadingDishes: false,
  filters: {
    startDate: null,
    endDate: null,
    status: null,
    startPrice: null,

    dateSort: null
  }
}

/*
 * GET DISHES
 */

export const getAllDishes = createAsyncThunk(
  "dishes/getAllDishes",
  async ({ limit, restaurantId, page, search_field, search }, { rejectWithValue }) => {
    try {
      const response = await dishesApi.getAllDishesByRestaurant({
        limit,
        restaurantId,
        page,
        order: "DESC",
        search_field,
        search
      })

      if (response.error) {
        showNotification({
          title: "Error",
          message: response.message,
          color: "red",
          duration: 7000
        })
        return rejectWithValue(response.error)
      }

      return { data: response.data, results: response.results, page }
    } catch (error) {
      showNotification({
        title: "Error",
        message: error.message || error,
        color: "red",
        duration: 7000
      })
      return rejectWithValue(error.message)
    }
  }
)

export const fetchDishes = createAsyncThunk(
  "dishes/fetchDishes",
  async ({ limit, page, order, restaurantId, filters }, { dispatch }) => {
    let formattedStartDate = null
    let formattedEndDate = null
    let formattedStatus = null
    let formattedPrice = null

    const { startDate, endDate, status, startPrice, dateSort } = filters

    if (startDate) {
      formattedStartDate = startDate.toISOString().split("T")[0]
    }

    if (endDate) {
      formattedEndDate = endDate.toISOString().split("T")[0]
    }

    if (status) {
      formattedStatus = status === "Todos" ? null : status === "Habilitado" ? "true" : "false"
    }

    if (startPrice) {
      formattedPrice = `${startPrice || ""}`
    }

    try {
      const response = await dishesApi.getAllDishesByRestaurant({
        limit,
        page,
        order,
        restaurantId,
        startDate: formattedStartDate,
        endDate: formattedEndDate,
        status: formattedStatus,
        price: formattedPrice,
        dateSort
      })

      dispatch(setDishes(response.data.data))
      return response
    } catch (error) {
      dispatch(setError("Error fetching dishes"))
      throw error
    }
  }
)

/*
 * CREATE DISHES
 */

export const createDish = createAsyncThunk("dishes/createDish", async ({ data, restaurantId, additionals }, { dispatch }) => {
  try {
    const formData = createDishFormData(data, restaurantId, additionals)

    const response = await dishesApi.createDish(formData)

    dispatch(fetchDishes())

    if (response.error) {
      showNotification({
        title: "Error",
        message: response.message,
        color: "red",
        duration: 7000
      })

      return response.error
    } else {
      /**
       * Add images to the dish
       */
      const dishId = response?.data?.id

      const addImageResponse = await uploadDishImage(dishId, data?.files?.[0])

      if (addImageResponse.error) {
        showNotification({
          title: "Error",
          message: addImageResponse.message,
          color: "red",
          duration: 7000
        })

        return addImageResponse.error
      }

      /**
       * All was success
       */
      showNotification({
        title: "Creación exitosa",
        message: response.message,
        color: "green",
        duration: 7000
      })
      return response.data
    }
  } catch (error) {
    handleErrorOnCreateDish(error, dispatch)
    throw error
  }
})

const createDishFormData = (data, restaurantId, additionals) => {
  const transformedAdditionals = additionals.map((additional) => ({
    name: additional.name,
    required: additional.required,
    requiredMinimum: additional.required ? additional.requiredMinimum : 1,
    additionalsDetails: additional.additionalsDetails.map((detail) => ({
      name: detail.name,
      isFree: detail.isFree || false,
      price: convertToDecimal(detail.price)
    }))
  }))

  const dishData = {
    name: data.name,
    description: data.description,
    price: convertToDecimal(data.price),
    isActive: data.isActive || false,
    includesDrink: data.includesDrink,
    restaurantId,
    preparationTime: data.preparationTime,
    additionals: transformedAdditionals,
    CategoryDishTags: []
  }

  return dishData
}

const uploadDishImage = async (dishId, file) => {
  const formDataImage = new FormData()
  formDataImage.append("files", file)

  return await dishesApi.addImage(dishId, formDataImage)
}

const handleErrorOnCreateDish = (error, dispatch) => {
  dispatch(setError("Error creating dish"))
  toast.error(`Fallo al crear el platillo. Por favor intente de nuevo!!. ${error}`, {
    duration: 7000
  })
}
/*
 * UPDATE DISHES
 */

export const updateDish = createAsyncThunk(
  "dishes/updateDish",
  async ({ dishData, propertyToUpdate = "all", dishId }, { dispatch }) => {
    try {
      const response = await dishesApi.updateDishWithExtra(dishId, dishData)
      if (response.error) {
        showNotification({
          title: "Error",
          message: response.message,
          color: "red",
          duration: 7000
        })

        return response.error
      } else {
        if (propertyToUpdate !== "isActive" && dishData.files) {
          await uploadDishImage(dishData?.id, dishData?.files?.[0])
        }

        showNotification({
          title: "Actualización exitosa",
          message: response.message,
          color: "green",
          duration: 7000
        })
      }
      return response.data
    } catch (error) {
      dispatch(setError("Error updating dish"))
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

export const updateDishStatus = createAsyncThunk(
  "dishes/updateDishStatus",
  async ({ dishData, dishId }, { dispatch, rejectWithValue }) => {
    try {
      const response = await dishesApi.updateDishesStatus(dishId, dishData)
      if (response.error) {
        showNotification({
          title: "Error",
          message: response.message,
          color: "red",
          duration: 7000
        })

        return rejectWithValue(response.message)
      }
      return response.data
    } catch (error) {
      dispatch(setError("Error updating dish"))
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

/*
 * DISHES SLICE
 */

export const dishesSlice = createSlice({
  name: "dishes",
  initialState,
  reducers: {
    setFilters: (state, action) => {
      state.filters = action.payload
    },
    setPage: (state, action) => {
      state.currentPage = action.payload
    },
    setDishes: (state, action) => {
      state.dishes = action.payload
      state.status = "succeeded"
    },
    setError: (state, action) => {
      state.status = "failed"
      state.error = action.payload
    },
    setLoading: (state, action) => {
      state.loading = action.payload
    },
    setTotalDishes: (state, action) => {
      state.totalDishes = action.payload
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(getAllDishes.pending, (state) => {
        state.loadingDishes = true
      })
      .addCase(getAllDishes.fulfilled, (state, action) => {
        const { data, results, page } = action.payload

        state.dishesPerPage[page] = data.data

        state.loadingDishes = false
        state.currentPage = page
        state.totalDishes = results
        state.totalPagesCount = Math.ceil(results / action.meta.arg.limit)
      })
      .addCase(getAllDishes.rejected, (state, action) => {
        state.loadingDishes = false
        state.error = action.error
      })
      .addCase(updateDishStatus.pending, (state) => {})
      .addCase(updateDishStatus.fulfilled, (state, action) => {
        const { id, isActive } = action.payload
        const currentPageDishes = state.dishesPerPage[state.currentPage]
        const index = currentPageDishes.findIndex((dish) => dish?.id === id)

        if (index !== -1) {
          currentPageDishes[index] = { ...currentPageDishes[index], isActive }
        }
      })
      .addCase(updateDishStatus.rejected, (state, action) => {
        state.error = action.error
      })
      .addCase(updateDish.pending, (state) => {})
      .addCase(updateDish.fulfilled, (state, action) => {
        const { id, name, price, images } = action.payload
        const currentPageDishes = state.dishesPerPage[state.currentPage]
        const index = currentPageDishes.findIndex((dish) => dish?.id === id)

        if (index !== -1) {
          const imageLocation = images.length > 0 ? images[0].location : null

          currentPageDishes[index] = {
            ...currentPageDishes[index],
            name,
            price,
            image: imageLocation
          }
        }
      })
      .addCase(updateDish.rejected, (state, action) => {
        state.error = action.error
      })
  }
})

export const { setDishes, setError, setPage, setFilters, setTotalDishes } = dishesSlice.actions

export const setLoading = (state) => state.dishes.loading

export const selectAllDishes = (state) => state.dishes.dishes

export const selectDishesStatus = (state) => state.dishes.status

export const selectDishesError = (state) => state.dishes.error

export default dishesSlice.reducer
