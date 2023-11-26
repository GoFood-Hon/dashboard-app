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
    endPrice: null,
    dateSort: null
  }
}

export const fetchDishes = createAsyncThunk(
  "dishes/fetchDishes",
  async ({ limit, page, order, restaurantId, filters }, { dispatch }) => {
    let formattedStartDate = null
    let formattedEndDate = null
    let formattedStatus = null
    let formattedPrice = null

    const { startDate, endDate, status, startPrice, endPrice, dateSort } = filters

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

export const createDish = createAsyncThunk("dishes/createDish", async ({ data, restaurant }, { dispatch }) => {
  try {
    const formData = createDishFormData(data, restaurant)

    const response = await dishesApi.createDish(formData)

    dispatch(fetchDishes())

    if (response.error) {
      toast.error(`Fallo al crear el platillo. Por favor intente de nuevo. ${response.message}`, {
        duration: 7000
      })
    } else {
      const dishId = response.data.data.id
      const addImageResponse = await uploadDishImage(dishId, data?.files?.[0])

      if (addImageResponse.error) {
        toast.error(`Fallo al subir la imagen. Por favor intente de nuevo. ${addImageResponse.message}`, {
          duration: 7000
        })
      }

      const addComplementsResponse = await addComplements(dishId, data?.extras)
      if (addComplementsResponse.error) {
        toast.error(`Fallo al cargar los extras. Por favor intente de nuevo. ${addImageResponse.message}`, {
          duration: 7000
        })
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

const addComplements = async (dishId, extras) => {
  const raw = JSON.stringify({
    extras
  })

  return await dishesApi.addExtras(dishId, raw)
}
const uploadDishImage = async (dishId, file) => {
  const formDataImage = new FormData()
  formDataImage.append("files", file)

  return await dishesApi.addImage(dishId, formDataImage)
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

const updateDishFormData = (data, propertyToUpdate) => {
  const formData = new FormData()

  if (propertyToUpdate === "isActive") {
    formData.append("isActive", data.isActive)
  } else {
    formData.append("name", data.name)
    formData.append("price", data.price)
    formData.append("description", data.description)
    formData.append("includesDrink", data.includeDrink)
    formData.append("endPrice", data.endPrice)
    formData.append("categoryId", data.categoryId)
    formData.append("restaurantId", data.restaurantId)
    formData.append("preparationTime", data?.preparationTime)
  }

  return formData
}
export const updateDish = createAsyncThunk("dishes/updateDish", async ({ data, propertyToUpdate = "all" }, { dispatch }) => {
  try {
    const formData = updateDishFormData(data, propertyToUpdate)

    const response = await dishesApi.updateDish(formData, data?.id)

    if (response.error) {
      toast.error(`Fallo al actualizar el platillo. Por favor intente de nuevo. ${response.message}`, {
        duration: 7000
      })
    } else {
      if (propertyToUpdate !== "isActive") {
        await uploadDishImage(data?.id, data?.files?.[0])
        await addComplements(data?.id, data?.extras)
      }

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
    console.log(error)

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
