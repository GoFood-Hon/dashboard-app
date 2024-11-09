import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import { ITEMS_PER_PAGE } from "../../utils/paginationConfig"
import toast from "react-hot-toast"
import menuApi from "../../api/menuApi"
import { showNotification } from "@mantine/notifications"

const initialState = {
  menus: [],
  totalItems: 0,
  itemsPerPage: ITEMS_PER_PAGE,
  menusPerPage: [],
  totalMenus: 0,
  totalPagesCount: 0,
  currentPage: 1,
  loadingMenus: false,
  creatimgMenus: false,
  updatingMenus: false,
  filters: {
    startDate: null,
    endDate: null,
    status: null,
    startPrice: null,
    dateSort: null
  },
  isLoading: false // Nuevo estado de carga
}

/*
 * GET MENUS
 */

export const fetchMenus = createAsyncThunk(
  "menus/fetchMenus",
  async ({ restaurantId, limit, page, order, search, search_field }, { rejectWithValue }) => {
    try {
      const response = await menuApi.getMenuByRestaurant({
        restaurantId,
        limit,
        page,
        order,
        search,
        search_field
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
        message: error,
        color: "red",
        duration: 7000
      })
    }
  }
)

/*
 * CREATE MENUS
 */

const uploadMenuImage = async (id, file) => {
  const formDataImage = new FormData()
  formDataImage.append("files", file)

  return await menuApi.addImage(id, formDataImage)
}

const addComplements = async (id, dishes) => {
  const raw = JSON.stringify({ dishes })
  return await menuApi.addDishesToMenu(id, raw)
}

export const createMenu = createAsyncThunk("menus/createMenu", async ({ data, restaurantId }, { dispatch }) => {
  try {
    const formData = new FormData()
    formData.append("name", data.name)
    formData.append("description", data.description)
    formData.append("type", data.type)
    formData.append("restaurantId", restaurantId)

    const response = await menuApi.createMenu(formData)
    dispatch(fetchMenus())

    if (response.error) {
      showNotification({
        title: "Error",
        message: response.message,
        color: "red",
        duration: 7000
      })

      return response.error
    } else {
      const dishId = response.data.id
      const addImageResponse = await uploadMenuImage(dishId, data?.files?.[0])

      if (addImageResponse.error) {
        showNotification({
          title: "Error",
          message: addImageResponse.message,
          color: "red",
          duration: 7000
        })

        return addImageResponse.error
      }
      const addComplementsResponse = await addComplements(dishId, data?.dishes)

      if (addComplementsResponse.error) {
        showNotification({
          title: "Error",
          message: addComplementsResponse.message,
          color: "red",
          duration: 7000
        })

        return addComplementsResponse.error
      }

      showNotification({
        title: "Creación exitosa",
        message: "El menú fue creado correctamente",
        color: "green",
        duration: 7000
      })
      return response.data
    }
  } catch (error) {
    dispatch(setError("Error updating menu"))
    toast.error("Fallo al actualizar el menu. Por favor intente de nuevo.", {
      duration: 7000
    })

    throw error
  }
})

/*
 * UPDATE MENUS
 */

const updateComplements = async (id, dishes) => {
  const raw = JSON.stringify({ dishes })
  return await menuApi.addDishesToMenu(id, raw)
}

const updateMenuFormData = (data, propertyToUpdate) => {
  const formData = new FormData()

  if (propertyToUpdate === "isActive") {
    formData.append("isActive", data.isActive)
  } else {
    formData.append("name", data?.name)
    formData.append("description", data?.description)
    formData.append("type", data?.type)
  }

  return formData
}

export const updateMenu = createAsyncThunk(
  "menus/updateMenu",
  async ({ data, propertyToUpdate = "all" }, { dispatch, rejectWithValue }) => {
    try {
      const formData = updateMenuFormData(data, propertyToUpdate)
      const response = await menuApi.updateMenu(formData, data.id)
      let images = []

      if (response.error) {
        showNotification({
          title: "Error",
          message: response.message,
          color: "red",
          duration: 7000
        })

        return rejectWithValue(response.error)
      } else {
        if (data?.files) {
          const imageResponse = await uploadMenuImage(data?.id, data?.files?.[0])
          images = imageResponse.data
          if (imageResponse.error) {
            showNotification({
              title: "Error",
              message: imageResponse.message,
              color: "red",
              duration: 7000
            })

            return rejectWithValue(imageResponse.error)
          }
        }

        if (data.dishes) {
          const complementsResponse = await updateComplements(data.id, data.dishes)
          if (complementsResponse.error) {
            showNotification({
              title: "Error",
              message: complementsResponse.message,
              color: "red",
              duration: 7000
            })

            return rejectWithValue(complementsResponse.error)
          }
        }

        showNotification({
          title: "Actualización exitosa",
          message: `Se actualizó el menú ${response?.data?.name}`,
          color: "green",
          duration: 7000
        })

        return { ...response.data, images }
      }
    } catch (error) {
      dispatch(setError("Error updating menu"))
      toast.error("Fallo al actualizar el menu. Por favor intente de nuevo.", {
        duration: 7000
      })

      throw error
    }
  }
)

export const updateMenuStatus = createAsyncThunk(
  "menus/updateMenuStatus",
  async ({ data, propertyToUpdate = "all" }, { rejectWithValue }) => {
    try {
      const formData = updateMenuFormData(data, propertyToUpdate)

      const response = await menuApi.updateMenu(formData, data.id)

      if (response.error) {
        showNotification({
          title: "Error",
          message: response.message,
          color: "red",
          duration: 7000
        })

        return rejectWithValue(response.error)
      }

      return response.data
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

/*
 * MENU SLICE
 */

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
      state.isLoading = action.payload // Actualiza el estado de carga
    }
  },

  extraReducers: (builder) => {
    builder
      .addCase(fetchMenus.pending, (state) => {
        state.loadingMenus = true
      })
      .addCase(fetchMenus.fulfilled, (state, action) => {
        const { data, results, page } = action.payload
        state.menusPerPage[page] = data
        state.loadingMenus = false
        state.currentPage = page
        state.totalMenus = results
        state.totalPagesCount = Math.ceil(results / action.meta.arg.limit)
      })
      .addCase(fetchMenus.rejected, (state, action) => {
        state.isLoading = false // Cambia el estado a "no cargando"
        state.status = "failed"
        state.error = action.error.message
      })
      .addCase(updateMenuStatus.fulfilled, (state, action) => {
        const { id, isActive } = action.payload
        const currentPageMenus = state.menusPerPage[state.currentPage]
        const index = currentPageMenus.findIndex((restaurant) => restaurant?.id === id)

        if (index !== -1) {
          currentPageMenus[index] = { ...currentPageMenus[index], isActive }
        }
      })
      .addCase(updateMenu.pending, (state) => {
        state.updatingMenus = true
      })
      .addCase(updateMenu.fulfilled, (state, action) => {
        const { id, name, images } = action.payload
        const currentPageMenus = state.menusPerPage[state.currentPage]
        const index = currentPageMenus.findIndex((menu) => menu?.id === id)

        if (index !== -1) {
          currentPageMenus[index] = {
            ...currentPageMenus[index],
            name,
            images
          }
        }
        state.updatingMenus = false
      })
      .addCase(updateMenu.rejected, (state) => {
        state.updatingMenus = false
      })
  }
})

export const { setMenus, setError, setPage, setFilters, setLoading } = menusSlice.actions

export const selectAllMenus = (state) => state.menus.menus

export const selectMenusStatus = (state) => state.menus.status

export const selectMenusError = (state) => state.menus.error

export const selectIsLoading = (state) => state.menus.isLoading // Selector para el estado de carga

export default menusSlice.reducer
