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
  isLoading: false,

  searchField: "name",
  searchData: null,
  searchDishesData: null
}

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

      return { data: response.data, results: response.results, page }
    } catch (error) {
      if (error?.response?.data?.status !== "token_expired") {
        showNotification({
          title: "Error",
          message: error.response?.data?.message || "Error al obtener los menús",
          color: "red",
          duration: 7000
        })
      }

      return rejectWithValue(error.response?.data || "Error al obtener los menús")
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
      if (error?.response?.data?.status !== "token_expired") {
        showNotification({
          title: "Error",
          message: error.response?.data?.message || "Error al obtener los platos",
          color: "red",
          duration: 7000
        })
      }

      return rejectWithValue(error.response?.data || "Error al obtener los platos")
    }
  }
)

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

    const dishId = response.data.id
    const addImageResponse = await uploadMenuImage(dishId, data?.files?.[0])

    menuData = { ...menuData, images: addImageResponse.data.images }

    const addComplementsResponse = await addComplements(dishId, data?.dishes)

    showNotification({
      title: "Creación exitosa",
      message: "El menú fue creado correctamente",
      color: "green",
      duration: 7000
    })

    return { ...menuData, Dishes: state.menus.dishesAddedToMenu }
  } catch (error) {
    if (error?.response?.data?.status !== "token_expired") {
      showNotification({
        title: "Error",
        message: error.response?.data?.message || "Error al crear el menú",
        color: "red",
        duration: 7000
      })
    }

    return rejectWithValue(error.response?.data || "Error al crear el menú")
  }
})

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
  async ({ data, propertyToUpdate = "all" }, { rejectWithValue, getState }) => {
    try {
      const state = getState()
      const formData = updateMenuFormData(data, propertyToUpdate)
      const response = await menuApi.updateMenu(formData, data.id)
      let menuData = response.data

      if (data?.files) {
        const imageResponse = await uploadMenuImage(data?.id, data?.files?.[0])
        menuData = { ...menuData, images: imageResponse.data.images }
      }

      if (Array.isArray(data.dishes) && data.dishes.length > 0 && data.dishes.every((dish) => typeof dish === "string")) {
        await updateComplements(data.id, data.dishes)
      }

      showNotification({
        title: "Actualización exitosa",
        message: `Se actualizó el menú ${response?.data?.name}`,
        color: "green",
        duration: 7000
      })

      return { ...menuData, Dishes: state.menus.dishesAddedToMenu }
    } catch (error) {
      if (error?.response?.data?.status !== "token_expired") {
        showNotification({
          title: "Error",
          message: error.response?.data?.message || "Error al actualizar el menú",
          color: "red",
          duration: 7000
        })
      }

      return rejectWithValue(error.response?.data || "Error al actualizar el menú")
    }
  }
)

export const updateMenuStatus = createAsyncThunk(
  "menus/updateMenuStatus",
  async ({ data, propertyToUpdate = "all" }, { rejectWithValue }) => {
    try {
      const formData = updateMenuFormData(data, propertyToUpdate)

      const response = await menuApi.updateMenu(formData, data.id)

      return response.data
    } catch (error) {
      if (error?.response?.data?.status !== "token_expired") {
        showNotification({
          title: "Error",
          message: error.response?.data?.message || "Error al actualizar el estado del menú",
          color: "red",
          duration: 7000
        })
      }

      return rejectWithValue(error.response?.data || "Error al actualizar el estado del menú")
    }
  }
)

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
      state.isLoading = action.payload
    },
    setDishesAddedToMenuCount: (state, action) => {
      state.dishesAddedToMenu = action.payload
    },
    setSearchData: (state, action) => {
      state.searchData = action.payload
    },
    setSearchDishesData: (state, action) => {
      state.searchDishesData = action.payload
    },
    setSelectedSearchOption: (state, action) => {
      state.searchField = action.payload
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
        if (currentPageMenus && currentPageMenus.length > 0) {
          const index = currentPageMenus.findIndex((restaurant) => restaurant?.id === id)

          if (index !== -1) {
            currentPageMenus[index] = { ...currentPageMenus[index], isActive }
          }
        }
      })
      .addCase(updateMenu.pending, (state) => {
        state.updatingMenus = true
      })
      .addCase(updateMenu.fulfilled, (state, action) => {
        const { id } = action.payload
        const currentPageMenus = state.menusPerPage[state.currentPage]
        if (currentPageMenus && currentPageMenus.length > 0) {
          const index = currentPageMenus.findIndex((menu) => menu.id === id)

          if (index !== -1) {
            currentPageMenus[index] = action.payload
          }
        }
        state.updatingMenus = false
      })
      .addCase(updateMenu.rejected, (state) => {
        state.updatingMenus = false
      })
  }
})

export const {
  setMenus,
  setError,
  setPage,
  setFilters,
  setLoading,
  setCurrentDishPage,
  setDishesAddedToMenuCount,
  setSearchData,
  setSearchDishesData,
  setSelectedSearchOption
} = menusSlice.actions

export const selectAllMenus = (state) => state.menus.menus

export const selectMenusStatus = (state) => state.menus.status

export const selectMenusError = (state) => state.menus.error

export const selectIsLoading = (state) => state.menus.isLoading

export default menusSlice.reducer
