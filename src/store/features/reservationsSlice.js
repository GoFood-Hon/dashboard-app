import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import reservationsApi from "../../api/reservationsApi"
import { showNotification } from "@mantine/notifications"
import { ITEMS_PER_PAGE } from "../../utils/paginationConfig"

const initialState = {
  itemsPerPage: ITEMS_PER_PAGE,
  reservationsPerPage: [],
  totalReservations: 0,
  totalPagesCount: 0,
  currentPage: 1,
  loadingReservations: false,
  loadingReservationsDetails: false,
  addingComment: false,
  cancellingReservation: false,
  approvingReservation: false,
  reservationDetails: null,
  error: null,
  reservationComment: "",

  //Search data
  searchField: "identityNumber",
  searchData: null,
  searchDishesData: null
}

// Thunk para obtener las reservas por sucursal
export const fetchReservationByBranch = createAsyncThunk(
  "reservations/fetchByBranch",
  async ({ branchId, limit, page, order, search, search_field }, { rejectWithValue }) => {
    try {
      const response = await reservationsApi.getReservationByBranch({
        branchId,
        limit,
        page,
        order,
        search,
        search_field
      })

      if (response.error) {
        showNotification({
          title: "Error",
          message: response.error,
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
      return rejectWithValue(error.response.data)
    }
  }
)

// Thunk para obtener las reservas por restaurante
export const fetchReservationByRestaurant = createAsyncThunk(
  "reservations/fetchByRestaurant",
  async ({ restaurantId, limit, page, order, search, search_field }, { rejectWithValue }) => {
    try {
      const response = await reservationsApi.getReservationByRestaurant({
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
          message: response.error,
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
      return rejectWithValue(error.response.data)
    }
  }
)

// Thunk para obtener los detalles de una reserva
export const fetchReservationDetails = createAsyncThunk(
  "reservations/fetchDetails",
  async (reservationId, { rejectWithValue }) => {
    try {
      const response = await reservationsApi.getReservationDetails(reservationId)

      if (response.error) {
        showNotification({
          title: "Error",
          message: response.error,
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
      return rejectWithValue(error.response.data)
    }
  }
)

// Thunk para agregar comentarios a una reserva
export const addCommentsToReservation = createAsyncThunk(
  "reservations/addComment",
  async ({ reservationId, params }, { rejectWithValue, getState }) => {
    try {
      const state = getState()
      const { name, images } = state.user.value
      const response = await reservationsApi.addCommentsToReservations(reservationId, params)

      if (response.error) {
        showNotification({
          title: "Error",
          message: response.error,
          color: "red",
          duration: 7000
        })
        return rejectWithValue(response.error)
      }

      showNotification({
        title: "Creación exitosa",
        message: "El comentario se agregó correctamente",
        color: "green",
        duration: 7000
      })
      return {
        ...response.data,
        AdminUser: {
          name,
          images
        }
      }
    } catch (error) {
      showNotification({
        title: "Error",
        message: error,
        color: "red",
        duration: 7000
      })
      return rejectWithValue(error.response.data)
    }
  }
)

// Thunk para cancelar una reserva
export const cancelReservation = createAsyncThunk(
  "reservations/cancel",
  async ({ reservationId, params }, { rejectWithValue }) => {
    try {
      const response = await reservationsApi.cancelReservation(reservationId, params)

      if (response.error) {
        showNotification({
          title: "Error",
          message: response.error,
          color: "red",
          duration: 7000
        })
        return rejectWithValue(response.error)
      }

      showNotification({
        title: "Cancelación exitosa",
        message: "La reservación se canceló correctamente",
        color: "green",
        duration: 7000
      })
      return response.data
    } catch (error) {
      showNotification({
        title: "Error",
        message: error,
        color: "red",
        duration: 7000
      })
      return rejectWithValue(error.response.data)
    }
  }
)

export const approveReservation = createAsyncThunk(
  "reservations/approve",
  async ({ reservationId, revisedBy }, { rejectWithValue }) => {
    try {
      const response = await reservationsApi.approveReservation(reservationId, revisedBy)

      if (response.error) {
        showNotification({
          title: "Error",
          message: response.error,
          color: "red",
          duration: 7000
        })
        return rejectWithValue(response.error)
      }

      showNotification({
        title: "Aprobación exitosa",
        message: "La reservación se aprobó correctamente",
        color: "green",
        duration: 7000
      })
      return response.data
    } catch (error) {
      showNotification({
        title: "Error",
        message: error,
        color: "red",
        duration: 7000
      })
      return rejectWithValue(error.response.data)
    }
  }
)

const reservationsSlice = createSlice({
  name: "reservations",
  initialState,
  reducers: {
    resetReservationDetails: (state) => {
      state.reservationDetails = null
    },
    setPage: (state, action) => {
      state.currentPage = action.payload
    },
    setSearchData: (state, action) => {
      state.searchData = action.payload
    },
    setSelectedSearchOption: (state, action) => {
      state.searchField = action.payload
    },
    setReservationComment: (state, action) => {
      state.reservationComment = action.payload
    },
    setNewReservation: (state, action) => {
      const newReservation = action.payload
      const itemsPerPage = state.itemsPerPage
      const newReservationsPerPage = { ...state.reservationsPerPage }

      let lastPage = state.totalPagesCount

      if (!newReservationsPerPage[lastPage]) {
        newReservationsPerPage[lastPage] = []
      }

      newReservationsPerPage[lastPage].unshift(newReservation)

      if (newReservationsPerPage[lastPage].length > itemsPerPage) {
        const overflowOrder = newReservationsPerPage[lastPage].pop()
        lastPage += 1
        newReservationsPerPage[lastPage] = [overflowOrder]
      }

      const updatedTotalReservations = state.totalReservations + 1
      const updatedTotalPagesCount = Math.ceil(updatedTotalReservations / itemsPerPage)

      state.reservationsPerPage = newReservationsPerPage
      state.totalReservations = updatedTotalReservations
      state.totalPagesCount = updatedTotalPagesCount
    }
  },
  extraReducers: (builder) => {
    builder
      // Obtener reservas por sucursal
      .addCase(fetchReservationByBranch.pending, (state) => {
        state.loadingReservations = true
      })
      .addCase(fetchReservationByBranch.fulfilled, (state, action) => {
        state.loadingReservations = false
        const { data, results, page } = action.payload
        state.reservationsPerPage[page] = data

        state.currentPage = page
        state.totalReservations = results
        state.totalPagesCount = Math.ceil(results / action.meta.arg.limit)
      })
      .addCase(fetchReservationByBranch.rejected, (state, action) => {
        state.loadingReservations = false
        state.error = action.payload
      })

      // Obtener reservas por restaurante
      .addCase(fetchReservationByRestaurant.pending, (state) => {
        state.loadingReservations = true
      })
      .addCase(fetchReservationByRestaurant.fulfilled, (state, action) => {
        state.loadingReservations = false
        const { data, results, page } = action.payload
        state.reservationsPerPage[page] = data

        state.currentPage = page
        state.totalReservations = results
        state.totalPagesCount = Math.ceil(results / action.meta.arg.limit)
      })
      .addCase(fetchReservationByRestaurant.rejected, (state, action) => {
        state.loadingReservations = false
        state.error = action.payload
      })

      // Obtener detalles de una reserva
      .addCase(fetchReservationDetails.pending, (state) => {
        state.loadingReservationsDetails = true
      })
      .addCase(fetchReservationDetails.fulfilled, (state, action) => {
        state.loadingReservationsDetails = false
        state.reservationDetails = action.payload
      })
      .addCase(fetchReservationDetails.rejected, (state, action) => {
        state.loadingReservationsDetails = false
        state.error = action.payload
      })

      // Agregar comentarios a una reserva
      .addCase(addCommentsToReservation.pending, (state) => {
        state.addingComment = true
      })
      .addCase(addCommentsToReservation.fulfilled, (state, action) => {
        state.addingComment = false
        if (state.reservationDetails) {
          state.reservationDetails.ReservationComments.unshift(action.payload)
        }
      })
      .addCase(addCommentsToReservation.rejected, (state, action) => {
        state.addingComment = false
        state.error = action.payload
      })

      // Cancelar una reserva
      .addCase(cancelReservation.pending, (state) => {
        state.cancellingReservation = true
      })
      .addCase(cancelReservation.fulfilled, (state, action) => {
        const { id, status, ReservationComments, updatedAt } = action.payload
        const currentPageReservations = state.reservationsPerPage[state.currentPage]
        if (currentPageReservations && currentPageReservations.length > 0) {
          const index = currentPageReservations.findIndex((reservation) => reservation?.id === id)

          if (index !== -1) {
            currentPageReservations[index] = { ...currentPageReservations[index], status, updatedAt }
          }
        }
        state.reservationDetails.status = status
        state.reservationDetails.ReservationComments = ReservationComments
        state.cancellingReservation = false
      })
      .addCase(cancelReservation.rejected, (state, action) => {
        state.cancellingReservation = false
        state.error = action.payload
      })

      // Aprobar una reserva
      .addCase(approveReservation.pending, (state) => {
        state.approvingReservation = true
      })
      .addCase(approveReservation.fulfilled, (state, action) => {
        const { id, status, updatedAt } = action.payload
        const currentPageReservations = state.reservationsPerPage[state.currentPage]
        if (currentPageReservations && currentPageReservations.length > 0) {
          const index = currentPageReservations.findIndex((reservation) => reservation?.id === id)

          if (index !== -1) {
            currentPageReservations[index] = { ...currentPageReservations[index], status, updatedAt }
          }
        }
        state.reservationDetails.status = status
        state.approvingReservation = false
      })
      .addCase(approveReservation.rejected, (state, action) => {
        state.approvingReservation = false
        state.error = action.payload
      })
  }
})

export const {
  resetReservationDetails,
  setPage,
  setSearchData,
  setSelectedSearchOption,
  setReservationComment,
  setNewReservation
} = reservationsSlice.actions

export default reservationsSlice.reducer
