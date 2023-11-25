import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import { ITEMS_PER_PAGE } from "../../utils/paginationConfig"
import toast from "react-hot-toast"
import menuApi from "../../api/menuApi"

const initialState = {
  menus: [],
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

/*
 * GET MENUS
 */

export const fetchMenus = createAsyncThunk("menu/fetchMenus", async ({ restaurantId }, { dispatch }) => {
  try {
    const response = await menuApi.getMenuByRestaurant({
      restaurantId
    })

    dispatch(setMenus(response.data))
    return response
  } catch (error) {
    dispatch(setError("Error fetching menus"))
    throw error
  }
})

/*
 * CREATE MENUS
 */

const uploadMenuImage = async (dishId, file) => {
  const formDataImage = new FormData()
  formDataImage.append("files", file)

  return await menuApi.addImage(dishId, formDataImage)
}

export const createMenu = createAsyncThunk("dishes/createDish", async ({ data, restaurant }, { dispatch }) => {
  try {
    const formData = new FormData()
    formData.append("name", data.name)
    formData.append("description", data.description)
    formData.append("type", data.type)
    formData.append("restaurantId", restaurant.id)

    const response = await menuApi.createMenu(formData)
    dispatch(fetchMenus())

    if (response.error) {
      toast.error(`Fallo al crear el platillo. Por favor intente de nuevo. ${response.message}`, {
        duration: 7000
      })
    } else {
      const dishId = response.data.data.id

      const addImageResponse = await uploadMenuImage(dishId, data?.files?.[0])

      if (addImageResponse.error) {
        toast.error(`Fallo al subir la imagen. Por favor intente de nuevo. ${addImageResponse.message}`, {
          duration: 7000
        })
      }

      toast.success("Platillo creado exitosamente", { duration: 7000 })
      return response.data
    }
  } catch (error) {
    dispatch(setError("Error updating dish"))
    toast.error("Fallo al actualizar el platillo. Por favor intente de nuevo.", {
      duration: 7000
    })

    throw error
  }
})

export const menusSlice = createSlice({
  name: "menus",
  initialState,
  reducers: {
    setFilters: (state, action) => {
      state.filters = action.payload
    },
    setPage: (state, action) => {
      state.currentPage = action.payload
    },
    setMenus: (state, action) => {
      state.menus = action.payload
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
      .addCase(fetchMenus.pending, (state) => {
        state.status = "loading"
      })
      .addCase(fetchMenus.fulfilled, (state, action) => {
        state.status = "succeeded"
        state.totalItems = action.payload.results
        state.value = action.payload
      })
      .addCase(fetchMenus.rejected, (state, action) => {
        state.status = "failed"
        state.error = action.error
      })
  }
})

export const { setMenus, setError, setPage, setFilters } = menusSlice.actions

export const setLoading = (state) => state.menus.loading

export const selectAllMenus = (state) => state.menus.menus

export const selectMenusStatus = (state) => state.menus.status

export const selectMenusError = (state) => state.menus.error

export default menusSlice.reducer
