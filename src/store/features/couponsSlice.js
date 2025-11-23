import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import couponApi from "../../api/couponApi"
import { showNotification } from "@mantine/notifications"
import { ITEMS_PER_PAGE } from "../../utils/paginationConfig"

const initialState = {
  coupons: [],
  loading: false,
  itemsPerPage: ITEMS_PER_PAGE,
  couponsPerPage: [],
  totalCoupons: 0,
  totalPagesCount: 0,
  currentPage: 1,
  loadingCoupons: false,
  creatingCoupons: false,
  updatingCoupons: false,
  deletingCoupons: false,
  totalItems: 0,
  searchData: null,
  searchField: "title",
  error: null,
  selectedCoupon: null
}

export const getCoupons = createAsyncThunk(
  "coupons/getCoupons",
  async ({ limit, page, order, search, search_field }, { rejectWithValue }) => {
    try {
      const response = await couponApi.getCoupons({ limit, page, order, search, search_field })
      return { data: response.data, results: response.results, page }
    } catch (error) {
      if (error?.response?.data?.status !== "token_expired") {
        showNotification({
          title: "Error",
          message: error.response?.data?.message || "Error al obtener los cupones",
          color: "red"
        })
      }

      return rejectWithValue(error.response?.data || "Error al obtener los cupones")
    }
  }
)

export const createCoupon = createAsyncThunk("coupons/createCoupon", async ({ params, imageParams }, { rejectWithValue }) => {
  try {
    const response = await couponApi.createCoupon(params)
    const couponsData = response.data

    let images = []
    if (imageParams) {
      const imageResponse = await couponApi.addImage(couponsData.id, imageParams)
      images = imageResponse.data.images
    }

    showNotification({
      title: "Creación exitosa",
      message: `El cupón ${couponsData.title} fue creado`,
      color: "green"
    })

    return { ...couponsData, images }
  } catch (error) {
    if (error?.response?.data?.status !== "token_expired") {
      showNotification({
        title: "Error",
        message: error.response?.data?.message || "Error al crear el cupón",
        color: "red"
      })
    }

    return rejectWithValue(error.response?.data || "Error al crear el cupón")
  }
})

export const deleteCoupon = createAsyncThunk("coupons/deleteCoupon", async (couponId, { rejectWithValue, dispatch }) => {
  try {
    const response = await couponApi.deleteCoupon(couponId)

    showNotification({
      title: "Cupón eliminado",
      message: "El cupón se eliminó correctamente",
      color: "green"
    })

    dispatch(handleDeleteCoupon({ couponId }))

    return response.data
  } catch (error) {
    if (error?.response?.data?.status !== "token_expired") {
      showNotification({
        title: "Error",
        message: error.response?.data?.message || "Error al eliminar el cupón",
        color: "red"
      })
    }

    return rejectWithValue(error.response?.data || "Error al eliminar el cupón")
  }
})

export const updateStatus = createAsyncThunk("coupons/updateStatus", async ({ couponId, params }, { rejectWithValue }) => {
  try {
    const response = await couponApi.updateStatus(couponId, params)
    return response.data
  } catch (error) {
    if (error?.response?.data?.status !== "token_expired") {
      showNotification({
        title: "Error",
        message: error.response?.data?.message || "Error al actualizar el estado del cupón",
        color: "red"
      })
    }

    return rejectWithValue(error.response?.data || "Error al actualizar el estado del cupón")
  }
})

export const updateCoupon = createAsyncThunk(
  "coupons/updateCoupon",
  async ({ couponId, params, imageParams }, { rejectWithValue }) => {
    try {
      const response = await couponApi.updateCoupon(couponId, params)
      let couponsData = response.data

      if (imageParams) {
        const imageResponse = await couponApi.addImage(couponId, imageParams)

        couponsData = { ...couponsData, images: imageResponse.data.images }
      }

      showNotification({
        title: "Actualización exitosa",
        message: `El cupón ${couponsData.title} fue actualizado`,
        color: "green"
      })

      return couponsData
    } catch (error) {
      if (error?.response?.data?.status !== "token_expired") {
        showNotification({
          title: "Error",
          message: error.response?.data?.message || "Error al actualizar el cupón",
          color: "red"
        })
      }

      return rejectWithValue(error.response?.data || "Error al actualizar el cupón")
    }
  }
)

const couponsSlice = createSlice({
  name: "coupons",
  initialState,
  reducers: {
    setPage: (state, action) => {
      state.currentPage = action.payload
    },
    setSearchData: (state, action) => {
      state.searchData = action.payload
    },
    setSelectedCoupon: (state, action) => {
      const couponId = action.payload
      const currentPageCoupons = state.couponsPerPage[state.currentPage] || []
      const foundCoupon = currentPageCoupons.find((coupon) => coupon.id === couponId)
      state.selectedCoupon = foundCoupon || null
    },
    handleDeleteCoupon: (state, action) => {
      const { couponId } = action.payload
      const { couponsPerPage } = state

      const pageIndex = Object.keys(couponsPerPage).find((page) => couponsPerPage[page].some((coupon) => coupon.id === couponId))

      if (pageIndex) {
        const page = parseInt(pageIndex)
        const currentPageData = [...couponsPerPage[page]]

        const updatedPage = currentPageData.filter((promo) => promo.id !== couponId)
        state.couponsPerPage[page] = updatedPage

        if (Object.keys(couponsPerPage).length === 1) {
          state.totalCoupons -= 1
          return
        }

        if (updatedPage.length < 10 && couponsPerPage[page + 1]?.length > 0) {
          const [firstOfNextPage, ...restOfNextPage] = couponsPerPage[page + 1]
          state.couponsPerPage[page].push(firstOfNextPage)
          state.couponsPerPage[page + 1] = restOfNextPage

          for (let i = page + 1; i <= Object.keys(couponsPerPage).length; i++) {
            delete state.couponsPerPage[i]
          }
        }

        if (updatedPage.length < 10 && !couponsPerPage[page + 1]) {
          return dispatch(getCoupons({ limit: state.itemsPerPage, page: page + 1 }))
            .unwrap()
            .then(({ data }) => {
              const existingCoupons = Object.values(couponsPerPage).flat()
              const missingCoupons = data.filter((promo) => !existingCoupons.some((p) => p.id === promo.id))

              const neededCoupons = 10 - updatedPage.length
              const couponsToAdd = missingCoupons.slice(0, neededCoupons)

              state.couponsPerPage[page] = [...updatedPage, ...couponsToAdd]

              if (missingCoupons.length > neededCoupons) {
                state.couponsPerPage[page + 1] = missingCoupons.slice(neededCoupons)
              }
            })
            .catch((error) => {
              state.error = error.message
            })
        }

        state.totalCoupons -= 1
      }
    },
    setSelectedSearchOption: (state, action) => {
      state.searchField = action.payload
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(getCoupons.pending, (state) => {
        state.loadingCoupons = true
      })
      .addCase(getCoupons.fulfilled, (state, action) => {
        const { data, results, page } = action.payload
        state.couponsPerPage[page] = data

        state.loadingCoupons = false
        state.currentPage = page
        state.totalCoupons = results
        state.totalPagesCount = Math.ceil(results / action.meta.arg.limit)
      })
      .addCase(getCoupons.rejected, (state, action) => {
        state.loadingCoupons = false
        state.error = action.payload
      })
      .addCase(createCoupon.pending, (state) => {
        state.creatingCoupons = true
        state.error = null
      })
      .addCase(createCoupon.fulfilled, (state, action) => {
        const newCoupon = action.payload

        if (!state.couponsPerPage[1]) {
          state.couponsPerPage[1] = []
        }
        state.couponsPerPage[1].unshift(newCoupon)

        for (let i = 1; i <= state.totalPagesCount; i++) {
          if (state.couponsPerPage[i]?.length > state.itemsPerPage) {
            const lastItem = state.couponsPerPage[i].pop()
            if (state.couponsPerPage[i + 1]) {
              state.couponsPerPage[i + 1].unshift(lastItem)
            }
          } else {
            break
          }
        }

        const consecutivePages = [1]
        for (let i = 2; i <= state.totalPagesCount; i++) {
          if (state.couponsPerPage[i]) {
            if (consecutivePages.includes(i - 1)) {
              consecutivePages.push(i)
            } else {
              delete state.couponsPerPage[i]
            }
          }
        }

        state.totalCoupons += 1
        state.totalPagesCount = Math.ceil(state.totalCoupons / state.itemsPerPage)
        state.creatingCoupons = false
      })
      .addCase(createCoupon.rejected, (state, action) => {
        state.creatingCoupons = false
        state.error = action.payload
      })
      .addCase(deleteCoupon.pending, (state) => {
        state.deletingCoupons = true
        state.error = null
      })
      .addCase(deleteCoupon.fulfilled, (state, action) => {
        state.deletingCoupons = false
      })
      .addCase(deleteCoupon.rejected, (state, action) => {
        state.deletingCoupons = false
        state.error = action.payload
      })
      .addCase(updateStatus.pending, (state) => {
        state.updatingCoupons = true
        state.error = null
      })
      .addCase(updateStatus.fulfilled, (state, action) => {
        const { id, isActive } = action.payload
        const currentPageCoupons = state.couponsPerPage[state.currentPage]
        if (currentPageCoupons && currentPageCoupons.length > 0) {
          const index = currentPageCoupons.findIndex((coupon) => coupon?.id === id)

          if (index !== -1) {
            currentPageCoupons[index] = { ...currentPageCoupons[index], isActive }
          }
        }
        state.updatingCoupons = false
      })
      .addCase(updateStatus.rejected, (state, action) => {
        state.updatingCoupons = false
        state.error = action.payload
      })
      .addCase(updateCoupon.pending, (state) => {
        state.updatingCoupons = true
      })
      .addCase(updateCoupon.fulfilled, (state, action) => {
        const { id } = action.payload
        const currentPageCoupons = state.couponsPerPage[state.currentPage]
        if (currentPageCoupons && currentPageCoupons.length > 0) {
          const index = currentPageCoupons.findIndex((coupon) => coupon?.id == id)

          if (state.couponsPerPage.length !== 0 && index !== -1) {
            currentPageCoupons[index] = action.payload
          }
        }

        state.selectedCoupon = action.payload
        state.updatingCoupons = false
      })
      .addCase(updateCoupon.rejected, (state, action) => {
        state.updatingCoupons = false
        state.error = action.payload
      })
  }
})

export const { setPage, setSearchData, setSelectedCoupon, handleDeleteCoupon, setSelectedSearchOption } = couponsSlice.actions

export default couponsSlice.reducer
