import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import promotionApi from "../../api/promotionApi"
import { ITEMS_PER_PAGE } from "../../utils/paginationConfig"
import { showNotification } from "@mantine/notifications"

const initialState = {
  promotions: [],
  loading: false,
  itemsPerPage: ITEMS_PER_PAGE,
  promotionsPerPage: [],
  totalPromotions: 0,
  totalPagesCount: 0,
  currentPage: 1,
  loadingPromotions: false,
  creatingPromotions: false,
  updatingPromotions: false,
  deletingPromotions: false,
  totalItems: 0,
  searchData: null,
  searchField: "title",
  error: null,
  selectedPromotion: null,
  dishesList: []
}

export const getPromotionByRestaurant = createAsyncThunk(
  "promotions/getPromotionByRestaurant",
  async ({ limit, page, order, search, search_field }, { rejectWithValue }) => {
    try {
      const response = await promotionApi.getPromotionByRestaurant({ limit, page, order, search, search_field })
      if (response.error) {
        showNotification({
          title: "Error",
          message: response.message,
          color: "red"
        })

        return rejectWithValue(response.message)
      }
      return { data: response.data, results: response.results, page }
    } catch (error) {
      return rejectWithValue(error.response.data)
    }
  }
)

export const createOffer = createAsyncThunk(
  "promotions/createOffer",
  async ({ params, imageParams, dishes }, { rejectWithValue }) => {
    try {
      const response = await promotionApi.createOffer(params)
      let promotionsData = response.data

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
        const imageResponse = await promotionApi.addImage(promotionsData.id, imageParams)
        images = imageResponse.data.images

        if (imageResponse.error) {
          showNotification({
            title: "Error",
            message: imageResponse.message,
            color: "red"
          })

          return rejectWithValue(imageResponse.message)
        }

        promotionsData = { ...promotionsData, images: imageResponse.data.images }
      }

      if (dishes.length !== 0) {
        const dishesAddedResponse = await promotionApi.addDishesToOffer({ dishes }, promotionsData.id)

        if (dishesAddedResponse.error) {
          showNotification({
            title: "Error",
            message: dishesAddedResponse.message,
            color: "red"
          })
        }

        promotionsData = { ...promotionsData, Dishes: dishesAddedResponse.data }
      }

      showNotification({
        title: "Creación exitosa",
        message: `La promoción ha sido creada`,
        color: "green"
      })

      return promotionsData
    } catch (error) {
      return rejectWithValue(error.response.data)
    }
  }
)

export const deleteOffer = createAsyncThunk("promotions/deleteOffer", async (promotionId, { rejectWithValue, dispatch }) => {
  try {
    const response = await promotionApi.deleteOffer(promotionId)
    if (response.error) {
      showNotification({
        title: "Error",
        message: response.message,
        color: "red"
      })

      return rejectWithValue(response.message)
    }

    showNotification({
      title: "Promoción eliminada",
      message: "La promoción se eliminó correctamente",
      color: "green"
    })

    dispatch(handleDeletePromotion({ promotionId }))

    return response.data
  } catch (error) {
    return rejectWithValue(error.response.data)
  }
})

export const updateOffer = createAsyncThunk(
  "promotions/updateOffer",
  async ({ promotionId, params, imageParams, dishes }, { rejectWithValue }) => {
    try {
      const response = await promotionApi.updateOffer(promotionId, params)
      let promotionsData = response.data

      if (response.error) {
        showNotification({
          title: "Error",
          message: response.message,
          color: "red"
        })

        return rejectWithValue(response.message)
      }

      if (imageParams) {
        const imageResponse = await promotionApi.addImage(promotionId, imageParams)

        if (imageResponse.error) {
          showNotification({
            title: "Error",
            message: imageResponse.message,
            color: "red"
          })

          return rejectWithValue(imageResponse.message)
        }

        promotionsData = { ...promotionsData, images: imageResponse.data.images }
      }

      if (dishes.length !== 0) {
        const dishesAddedResponse = await promotionApi.addDishesToOffer({ dishes }, promotionId)

        if (dishesAddedResponse.error) {
          showNotification({
            title: "Error",
            message: dishesAddedResponse.message,
            color: "red"
          })
        }
        promotionsData = { ...promotionsData, Dishes: dishesAddedResponse.data }
      }

      showNotification({
        title: "Actualización exitosa",
        message: `La promoción fue actualizada`,
        color: "green"
      })

      return promotionsData
    } catch (error) {
      return rejectWithValue(error.response.data)
    }
  }
)

export const updateOfferStatus = createAsyncThunk(
  "promotions/updateOfferStatus",
  async ({ promotionId, params }, { rejectWithValue }) => {
    try {
      const response = await promotionApi.updateOfferStatus(promotionId, params)
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
      return rejectWithValue(error.response.data)
    }
  }
)

export const fetchPagePromotions = createAsyncThunk("promotions/fetchPagePromotions", async (page, { rejectWithValue }) => {
  try {
    const response = await promotionApi.getPromotionByRestaurant(page)
    return response.data
  } catch (error) {
    return rejectWithValue(error.response.data)
  }
})

export const getAllDishesList = createAsyncThunk("promotions/getAllDishesList", async (restaurantId, { rejectWithValue }) => {
  try {
    const response = await promotionApi.getAllDishes(restaurantId)
    return response.data
  } catch {
    return rejectWithValue(error.response.data)
  }
})

const promotionsSlice = createSlice({
  name: "promotions",
  initialState,
  reducers: {
    setPage: (state, action) => {
      state.currentPage = action.payload
    },
    setSearchData: (state, action) => {
      state.searchData = action.payload
    },
    setSelectedPromotion: (state, action) => {
      const promotionId = action.payload
      const currentPagePromotions = state.promotionsPerPage[state.currentPage] || []
      const foundPromotion = currentPagePromotions.find((promo) => promo.id === promotionId)
      state.selectedPromotion = foundPromotion || null
    },
    handleDeletePromotion: (state, action) => {
      const { promotionId } = action.payload
      const { promotionsPerPage } = state

      // Encuentra la página que contiene el registro a eliminar
      const pageIndex = Object.keys(promotionsPerPage).find((page) =>
        promotionsPerPage[page].some((promotion) => promotion.id === promotionId)
      )

      if (pageIndex) {
        const page = parseInt(pageIndex)
        const currentPageData = [...promotionsPerPage[page]]

        // Elimina el registro de la página actual
        const updatedPage = currentPageData.filter((promo) => promo.id !== promotionId)
        state.promotionsPerPage[page] = updatedPage

        // Caso 1: Solo hay una página cargada
        if (Object.keys(promotionsPerPage).length === 1) {
          state.totalPromotions -= 1
          return
        }

        // Caso 2: Hay varias páginas cargadas
        if (updatedPage.length < 10 && promotionsPerPage[page + 1]?.length > 0) {
          // Pasa el primer elemento de la página siguiente a la página actual
          const [firstOfNextPage, ...restOfNextPage] = promotionsPerPage[page + 1]
          state.promotionsPerPage[page].push(firstOfNextPage)
          state.promotionsPerPage[page + 1] = restOfNextPage

          // Elimina las páginas posteriores, independientemente de si tienen datos o no
          for (let i = page + 1; i <= Object.keys(promotionsPerPage).length; i++) {
            delete state.promotionsPerPage[i]
          }
        }

        // Caso 3: Las siguientes páginas no están cargadas
        if (updatedPage.length < 10 && !promotionsPerPage[page + 1]) {
          // Fetch de los datos de la siguiente página
          return dispatch(getPromotionByRestaurant({ limit: state.itemsPerPage, page: page + 1 }))
            .unwrap()
            .then(({ data }) => {
              // Filtrar los datos que ya existen en las páginas actuales
              const existingPromotions = Object.values(promotionsPerPage).flat()
              const missingPromotions = data.filter((promo) => !existingPromotions.some((p) => p.id === promo.id))

              // Redistribuir registros entre las páginas actuales
              const neededPromotions = 10 - updatedPage.length // Cuántos faltan para completar la página actual
              const promotionsToAdd = missingPromotions.slice(0, neededPromotions)

              // Actualizar la página actual con los datos faltantes
              state.promotionsPerPage[page] = [...updatedPage, ...promotionsToAdd]

              // Si aún quedan promociones después de rellenar la página actual, añadirlas como una nueva página
              if (missingPromotions.length > neededPromotions) {
                state.promotionsPerPage[page + 1] = missingPromotions.slice(neededPromotions)
              }
            })
            .catch((error) => {
              state.error = error.message
            })
        }

        // Ajustar totalPromotions
        state.totalPromotions -= 1
      }
    },
    setSelectedSearchOption: (state, action) => {
      state.searchField = action.payload
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(createOffer.pending, (state) => {
        state.creatingPromotions = true
      })
      .addCase(createOffer.fulfilled, (state, action) => {
        const newPromotion = action.payload

        if (!state.promotionsPerPage[1]) {
          state.promotionsPerPage[1] = []
        }
        state.promotionsPerPage[1].unshift(newPromotion)

        for (let i = 1; i <= state.totalPagesCount; i++) {
          if (state.promotionsPerPage[i]?.length > state.itemsPerPage) {
            const lastItem = state.promotionsPerPage[i].pop()
            if (state.promotionsPerPage[i + 1]) {
              state.promotionsPerPage[i + 1].unshift(lastItem)
            }
          } else {
            break
          }
        }

        const consecutivePages = [1]
        for (let i = 2; i <= state.totalPagesCount; i++) {
          if (state.promotionsPerPage[i]) {
            if (consecutivePages.includes(i - 1)) {
              consecutivePages.push(i)
            } else {
              delete state.promotionsPerPage[i]
            }
          }
        }

        state.totalPromotions += 1
        state.totalPagesCount = Math.ceil(state.totalPromotions / state.itemsPerPage)
        state.creatingPromotions = false
      })
      .addCase(createOffer.rejected, (state, action) => {
        state.creatingPromotions = false
        state.error = action.payload
      })
      .addCase(getPromotionByRestaurant.pending, (state) => {
        state.loadingPromotions = true
      })
      .addCase(getPromotionByRestaurant.fulfilled, (state, action) => {
        const { data, results, page } = action.payload
        state.promotionsPerPage[page] = data

        state.loadingPromotions = false
        state.currentPage = page
        state.totalPromotions = results
        state.totalPagesCount = Math.ceil(results / action.meta.arg.limit)
      })
      .addCase(getPromotionByRestaurant.rejected, (state, action) => {
        state.loadingPromotions = false
        state.error = action.payload
      })
      .addCase(updateOffer.pending, (state) => {
        state.updatingPromotions = true
      })
      .addCase(updateOffer.fulfilled, (state, action) => {
        const { id } = action.payload
        const currentPagePromotions = state.promotionsPerPage[state.currentPage]
        const index = currentPagePromotions.findIndex((promotion) => promotion?.id == id)

        if (state.promotionsPerPage.length !== 0 && index !== -1) {
          currentPagePromotions[index] = action.payload
        }

        state.selectedPromotion = action.payload
        state.updatingPromotions = false
      })
      .addCase(updateOffer.rejected, (state, action) => {
        state.updatingPromotions = false
        state.error = action.payload
      })
      .addCase(updateOfferStatus.pending, (state) => {
        state.updatingPromotions = true
      })
      .addCase(updateOfferStatus.fulfilled, (state, action) => {
        const { id, available } = action.payload
        const currentPagePromotions = state.promotionsPerPage[state.currentPage]
        const index = currentPagePromotions.findIndex((promotion) => promotion?.id === id)

        if (index !== -1) {
          currentPagePromotions[index] = { ...currentPagePromotions[index], available }
        }
        state.updatingPromotions = false
      })
      .addCase(updateOfferStatus.rejected, (state, action) => {
        state.updatingPromotions = false
        state.error = action.payload
      })
      .addCase(deleteOffer.pending, (state) => {
        state.deletingPromotions = true
      })
      .addCase(deleteOffer.fulfilled, (state, action) => {
        state.deletingPromotions = false
      })
      .addCase(deleteOffer.rejected, (state, action) => {
        state.deletingPromotions = false
        state.error = action.payload
      })
      .addCase(getAllDishesList.pending, (state) => {
        state.loading = true
      })
      .addCase(getAllDishesList.fulfilled, (state, action) => {
        state.loading = false
        state.dishesList = action.payload
      })
      .addCase(getAllDishesList.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
  }
})

export const { setPage, setSearchData, setSelectedPromotion, handleDeletePromotion, setSelectedSearchOption } =
  promotionsSlice.actions

export default promotionsSlice.reducer
