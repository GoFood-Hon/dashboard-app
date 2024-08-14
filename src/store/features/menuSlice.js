import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import { ITEMS_PER_PAGE } from "../../utils/paginationConfig"
import toast from "react-hot-toast"
import menuApi from "../../api/menuApi"
import { showNotification } from "@mantine/notifications"

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
    dateSort: null
  }
}

/*
 * GET MENUS
 */

export const fetchMenus = createAsyncThunk("menus/fetchMenus", async ({ restaurantId }, { dispatch }) => {
  try {
    const response = await menuApi.getMenuByRestaurant({
      restaurantId
    })

    dispatch(setMenus(response.data))
    return response.data
  } catch (error) {
    dispatch(setError("Error fetching menus"))
    throw error
  }
})

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
      toast.error(`Fallo al crear el menu. Por favor intente de nuevo. ${response.message}`, {
        duration: 7000
      })
    } else {
      const dishId = response.data.id
      const addImageResponse = await uploadMenuImage(dishId, data?.files?.[0])

      if (addImageResponse.error) {
        toast.error(`Fallo al subir la imagen. Por favor intente de nuevo. ${addImageResponse.message}`, {
          duration: 7000
        })
      }
      const addComplementsResponse = await addComplements(dishId, data?.dishes)

      if (addComplementsResponse.error) {
        toast.error(`Fallo al cargar los platillos. Por favor intente de nuevo. ${addImageResponse.message}`, {
          duration: 7000
        })
      }

      toast.success("Menu creado exitosamente", { duration: 7000 })
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

export const updateMenu = createAsyncThunk("menus/updateMenu", async ({ data, propertyToUpdate = "all" }, { dispatch }) => {
  try {
    const formData = updateMenuFormData(data, propertyToUpdate)

    const response = await menuApi.updateMenu(formData, data.id)

    if (response.error) {
      toast.error(`Fallo al actualizar el menu. Por favor intente de nuevo. ${response.message}`, {
        duration: 7000
      })
    } else {
      if (data?.files) {
        const imageResponse = await uploadMenuImage(data?.id, data?.files?.[0])

        if (imageResponse.error) {
          toast.error(`Fallo al subir la imagen. Por favor intente de nuevo. ${response.message}`, {
            duration: 7000
          })
        }
      }

      if (data.dishes) {
        const complementsResponse = await updateComplements(data.id, data.dishes)
        if (complementsResponse.error) {
          toast.error(`Fallo al actualizar los platillos. Por favor intente de nuevo. ${response.message}`, {
            duration: 7000
          })
        }
      }

      toast.success("Menu actualizado exitosamente", {
        duration: 7000
      })
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
      state.loading = "loading"
    }
  },

  extraReducers: (builder) => {
    builder
      .addCase(fetchMenus.pending, (state) => {
        state.status = "loading"
      })
      .addCase(fetchMenus.fulfilled, (state, action) => {
        state.status = "succeeded"
        state.menus = action.payload
      })
      .addCase(fetchMenus.rejected, (state, action) => {
        state.status = "failed"
        state.error = action.error.message
      })
  }
})

export const { setMenus, setError, setPage, setFilters } = menusSlice.actions

export const setLoading = (state) => state.menus.loading

export const selectAllMenus = (state) => state.menus.menus

export const selectMenusStatus = (state) => state.menus.status

export const selectMenusError = (state) => state.menus.error

export default menusSlice.reducer
