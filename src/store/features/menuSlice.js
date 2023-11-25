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
