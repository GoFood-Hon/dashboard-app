import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import { ITEMS_PER_PAGE } from "../../utils/paginationConfig"
import toast from "react-hot-toast"
import menuApi from "../../api/menuApi"
import { showNotification } from "@mantine/notifications"
import dishesApi from "../../api/dishesApi"

const initialState = {
  menus: [],
  totalItems: 0,
  itemsPerPage: ITEMS_PER_PAGE,
  menusPerPage: [],
  totalMenus: 0,
  totalPagesCount: 0,
  currentPage: 1,
  loadingMenus: false,
  creatingMenus: false,
  updatingMenus: false,
  //DISHES STATE
  dishes: [],
  currentDishPage: 1,
  dishesPerPage: ITEMS_PER_PAGE,
  hasMore: true,
  dishesLoading: false,
  updatingDishes: false,
  filters: {
    startDate: null,
    endDate: null,
    status: null,
    startPrice: null,
    dateSort: null
  },
  dishesAddedToMenu: 0,
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

export const getAllDishes = createAsyncThunk(
  "menus/getDishes",
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

      return {
        data: response.data.map((item) => ({
          id: item.id,
          name: item.name,
          images: item.images,
          price: item.price
        })),
        results: response.results,
        page
      }
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

export const createMenu = createAsyncThunk("menus/createMenu", async ({ data, restaurantId }, { rejectWithValue, getState }) => {
  try {
    const formData = new FormData()
    formData.append("name", data.name)
    formData.append("description", data.description)
    formData.append("type", data.type)
    formData.append("restaurantId", restaurantId)

    const state = getState()
    const response = await menuApi.createMenu(formData)
    let menuData = response.data

    if (response.error) {
      showNotification({
        title: "Error",
        message: response.message,
        color: "red",
        duration: 7000
      })

      return rejectWithValue(response.error)
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

        return rejectWithValue(addImageResponse.error)
      }

      menuData = { ...menuData, images: addImageResponse.data.images }

      const addComplementsResponse = await addComplements(dishId, data?.dishes)

      if (addComplementsResponse.error) {
        showNotification({
          title: "Error",
          message: addComplementsResponse.message,
          color: "red",
          duration: 7000
        })

        return rejectWithValue(addComplementsResponse.error)
      }

      showNotification({
        title: "Creación exitosa",
        message: "El menú fue creado correctamente",
        color: "green",
        duration: 7000
      })

      return { ...menuData, Dishes: state.menus.dishesAddedToMenu }
    }
  } catch (error) {
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
  async ({ data, propertyToUpdate = "all" }, { dispatch, rejectWithValue, getState }) => {
    try {
      const state = getState()
      const formData = updateMenuFormData(data, propertyToUpdate)
      const response = await menuApi.updateMenu(formData, data.id)
      let menuData = response.data

      if (response.error) {
        showNotification({
          title: "Error",
          message: response.message,
          color: "red",
          duration: 7000
        })

        return rejectWithValue(response.error)
      }

      if (data?.files) {
        const imageResponse = await uploadMenuImage(data?.id, data?.files?.[0])
        if (imageResponse.error) {
          showNotification({
            title: "Error",
            message: imageResponse.message,
            color: "red",
            duration: 7000
          })

          return rejectWithValue(imageResponse.error)
        }
        menuData = { ...menuData, images: imageResponse.data.images }
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

      return { ...menuData, Dishes: state.menus.dishesAddedToMenu }
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
    setCurrentDishPage: (state, action) => {
      state.currentDishPage = action.payload
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
    },
    setDishesAddedToMenuCount: (state, action) => {
      state.dishesAddedToMenu = action.payload
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
        state.isLoading = false
        state.error = action.error.message
      })
      .addCase(getAllDishes.pending, (state, action) => {
        const { page } = action.meta.arg

        if (page === 1) {
          state.dishesLoading = true
        } else {
          state.updatingDishes = true
        }
      })
      .addCase(getAllDishes.fulfilled, (state, action) => {
        const { data, results, page } = action.payload

        if (page === 1) {
          state.dishes = data
        } else {
          state.dishes = [...state.dishes, ...data]
        }

        state.currentDishPage = page
        state.hasMore = state.dishes.length < results
        state.dishesLoading = false
        state.updatingDishes = false
      })
      .addCase(getAllDishes.rejected, (state, action) => {
        state.dishesLoading = false
        state.updatingDishes = false
        state.error = action.error.message
      })
      .addCase(createMenu.pending, (state) => {
        state.creatingMenus = true
      })
      .addCase(createMenu.fulfilled, (state, action) => {
        const newMenu = action.payload

        state.menusPerPage[1].unshift(newMenu)

        if (state.menusPerPage[1].length > state.itemsPerPage) {
          state.menusPerPage[1].pop()
        }

        for (let i = 2; i <= state.totalPagesCount; i++) {
          delete state.menusPerPage[i]
        }

        state.totalMenus += 1
        state.totalPagesCount = Math.ceil(state.totalMenus / state.itemsPerPage)
        state.creatingMenus = false
      })
      .addCase(createMenu.rejected, (status) => {
        status.creatingMenus = false
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
        const { id } = action.payload
        const currentPageMenus = state.menusPerPage[state.currentPage]
        const index = currentPageMenus.findIndex((menu) => menu.id === id)

        if (index !== -1) {
          currentPageMenus[index] = action.payload
        }
        state.updatingMenus = false
      })
      .addCase(updateMenu.rejected, (state) => {
        state.updatingMenus = false
      })
  }
})

export const { setMenus, setError, setPage, setFilters, setLoading, setCurrentDishPage, setDishesAddedToMenuCount } =
  menusSlice.actions

export const selectAllMenus = (state) => state.menus.menus

export const selectMenusStatus = (state) => state.menus.status

export const selectMenusError = (state) => state.menus.error

export const selectIsLoading = (state) => state.menus.isLoading

export default menusSlice.reducer
