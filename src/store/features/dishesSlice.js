import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import dishesApi from "../../api/dishesApi"
import toast from "react-hot-toast"
import { ITEMS_PER_PAGE } from "../../utils/paginationConfig"

const initialState = {
  dishes: [],
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

export const fetchDishes = createAsyncThunk(
  "dishes/fetchDishes",
  async ({ limit, page, order, restaurantId, filters }, { dispatch }) => {
    let formattedStartDate = null
    let formattedEndDate = null
    let formattedStatus = null
    let formattedPrice = null

    const { startDate, endDate, status, startPrice, endPrice } = filters

    if (startDate) {
      formattedStartDate = startDate.toISOString().split("T")[0]
    }

    if (endDate) {
      formattedEndDate = endDate.toISOString().split("T")[0]
    }

    if (status) {
      formattedStatus = status === "Todos" ? null : status === "Habilitado" ? "true" : "false"
    }

    if (startPrice || endPrice) {
      formattedPrice = `${startPrice || ""}-${endPrice || ""}`
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
        price: formattedPrice
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

export const createDish = createAsyncThunk("dishes/createDish", async ({ data, restaurant }, { dispatch }) => {
  try {
    const formData = createDishFormData(data, restaurant)

    const response = await dishesApi.createDish(formData)

    dispatch(fetchDishes())

    if (response.error) {
      handleCreateDishError(response)
    } else {
      const dishId = response.data.data.id
      const addImageResponse = await uploadDishImage(dishId, data.files[0])

      if (addImageResponse.error) {
        handleImageUploadError(addImageResponse)
      }
      toast.success("Platillo creado exitosamente", { duration: 7000 })

      return response.data
    }
  } catch (error) {
    handleErrorOnCreateDish(error, dispatch)
    throw error
  }
})

const createDishFormData = (data, restaurant) => {
  const formData = new FormData()
  formData.append("name", data.name)
  formData.append("price", data.price)
  formData.append("description", data.description)
  formData.append("includesDrink", data.includeDrink)
  formData.append("endPrice", data.endPrice)
  formData.append("categoryId", data.categoryId)
  formData.append("restaurantId", restaurant.id)
  formData.append("preparationTime", data?.preparationTime)

  return formData
}

const handleCreateDishError = (response) => {
  toast.error(`Fallo al crear el platillo. Por favor intente de nuevo. ${response.message}`, {
    duration: 7000
  })
}

const uploadDishImage = async (dishId, file) => {
  const formDataImage = new FormData()
  formDataImage.append("files", file)

  return await dishesApi.addImage(dishId, formDataImage)
}

const handleImageUploadError = (response) => {
  toast.error(`Fallo al subir la imagen. Por favor intente de nuevo. ${response.message}`, {
    duration: 7000
  })
}

const handleErrorOnCreateDish = (error, dispatch) => {
  dispatch(setError("Error creating dish"))
  toast.error(`Fallo al crear el platillo. Por favor intente de nuevo. ${error}`, {
    duration: 7000
  })
}

/*
 * UPDATE DISHES
 */

export const updateDish = createAsyncThunk("dishes/updateDish", async ({ formData, dishId }, { dispatch }) => {
  try {
    const response = await dishesApi.updateDish(formData, dishId)

    if (response.error) {
      toast.error(`Fallo al actualizar el platillo. Por favor intente de nuevo. ${response.message}`, {
        duration: 7000
      })
    } else {
      toast.success("Platillo actualizado exitosamente", {
        duration: 7000
      })
    }
    return response.data
  } catch (error) {
    dispatch(setError("Error updating dish"))
    toast.error("Fallo al actualizar el platillo. Por favor intente de nuevo.", {
      duration: 7000
    })

    throw error
  }
})

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
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchDishes.pending, (state) => {
        state.status = "loading"
      })
      .addCase(fetchDishes.fulfilled, (state, action) => {
        state.status = "succeeded"
        state.totalItems = action.payload.results
        state.value = action.payload
      })
      .addCase(fetchDishes.rejected, (state, action) => {
        state.status = "failed"
        state.error = action.error
      })
  }
})

export const { setDishes, setError, setPage, setFilters } = dishesSlice.actions

export const setLoading = (state) => state.dishes.loading

export const selectAllDishes = (state) => state.dishes.dishes

export const selectDishesStatus = (state) => state.dishes.status

export const selectDishesError = (state) => state.dishes.error

export default dishesSlice.reducer
