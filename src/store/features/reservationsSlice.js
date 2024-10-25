import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import reservationsApi from "../../api/reservationsApi"
import toast from "react-hot-toast"

// Thunk para obtener las reservas por sucursal
export const fetchReservationByBranch = createAsyncThunk("reservations/fetchByBranch", async (branchId, { rejectWithValue }) => {
  try {
    const response = await reservationsApi.getReservationByBranch(branchId)
    return response.data
  } catch (error) {
    toast.error(`Error al obtener las reservas: ${error.message}`)
    return rejectWithValue(error.response.data)
  }
})

// Thunk para obtener las reservas por restaurante
export const fetchReservationByRestaurant = createAsyncThunk(
  "reservations/fetchByRestaurant",
  async (restaurantId, { rejectWithValue }) => {
    try {
      const response = await reservationsApi.getReservationByRestaurant(restaurantId)
      return response.data
    } catch (error) {
      toast.error(`Error al obtener las reservas: ${error.message}`)
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
      return response.data
    } catch (error) {
      toast.error(`Error al obtener los detalles de la reserva: ${error.message}`)
      return rejectWithValue(error.response.data)
    }
  }
)

// Thunk para agregar comentarios a una reserva
export const addCommentsToReservation = createAsyncThunk(
  "reservations/addComment",
  async ({ reservationId, params }, { rejectWithValue }) => {
    try {
      const response = await reservationsApi.addCommentsToReservations(reservationId, params)
      toast.success("Comentario agregado exitosamente.")
      return response.data
    } catch (error) {
      toast.error(`Error al agregar comentario: ${error.message}`)
      return rejectWithValue(error.response.data)
    }
  }
)

// Thunk para cancelar una reserva
export const cancelReservation = createAsyncThunk("reservations/cancel", async (reservationId, { rejectWithValue }) => {
  try {
    const response = await reservationsApi.cancelReservation(reservationId)
    toast.success("Reserva cancelada correctamente.")
    return response.data
  } catch (error) {
    toast.error(`Error al cancelar la reserva: ${error.message}`)
    return rejectWithValue(error.response.data)
  }
})

// Thunk para aprobar una reserva
export const approveReservation = createAsyncThunk("reservations/approve", async (reservationId, { rejectWithValue }) => {
  try {
    const response = await reservationsApi.approveReservation(reservationId)
    toast.success("Reserva aprobada exitosamente.")
    return response.data
  } catch (error) {
    toast.error(`Error al aprobar la reserva: ${error.message}`)
    return rejectWithValue(error.response.data)
  }
})

const initialState = {
  reservations: [],
  reservationDetails: null,
  status: "idle", // idle | loading | succeeded | failed
  error: null
}

const reservationsSlice = createSlice({
  name: "reservations",
  initialState,
  reducers: {
    resetReservationDetails: (state) => {
      state.reservationDetails = null
    }
  },
  extraReducers: (builder) => {
    builder
      // Obtener reservas por sucursal
      .addCase(fetchReservationByBranch.pending, (state) => {
        state.status = "loading"
      })
      .addCase(fetchReservationByBranch.fulfilled, (state, action) => {
        state.status = "succeeded"
        state.reservations = action.payload
      })
      .addCase(fetchReservationByBranch.rejected, (state, action) => {
        state.status = "failed"
        state.error = action.payload
      })

      // Obtener reservas por restaurante
      .addCase(fetchReservationByRestaurant.pending, (state) => {
        state.status = "loading"
      })
      .addCase(fetchReservationByRestaurant.fulfilled, (state, action) => {
        state.status = "succeeded"
        state.reservations = action.payload
      })
      .addCase(fetchReservationByRestaurant.rejected, (state, action) => {
        state.status = "failed"
        state.error = action.payload
      })

      // Obtener detalles de una reserva
      .addCase(fetchReservationDetails.pending, (state) => {
        state.status = "loading"
      })
      .addCase(fetchReservationDetails.fulfilled, (state, action) => {
        state.status = "succeeded"
        state.reservationDetails = action.payload
      })
      .addCase(fetchReservationDetails.rejected, (state, action) => {
        state.status = "failed"
        state.error = action.payload
      })

      // Agregar comentarios a una reserva
      .addCase(addCommentsToReservation.pending, (state) => {
        state.status = "loading"
      })
      .addCase(addCommentsToReservation.fulfilled, (state) => {
        state.status = "succeeded"
      })
      .addCase(addCommentsToReservation.rejected, (state, action) => {
        state.status = "failed"
        state.error = action.payload
      })

      // Cancelar una reserva
      .addCase(cancelReservation.pending, (state) => {
        state.status = "loading"
      })
      .addCase(cancelReservation.fulfilled, (state, action) => {
        state.status = "succeeded"
        // Actualizar el estado local si es necesario
        state.reservations = state.reservations.map((reservation) =>
          reservation.id === action.payload.id ? action.payload : reservation
        )
      })
      .addCase(cancelReservation.rejected, (state, action) => {
        state.status = "failed"
        state.error = action.payload
      })

      // Aprobar una reserva
      .addCase(approveReservation.pending, (state) => {
        state.status = "loading"
      })
      .addCase(approveReservation.fulfilled, (state, action) => {
        state.status = "succeeded"
        state.reservations = state.reservations.map((reservation) =>
          reservation.id === action.payload.id ? action.payload : reservation
        )
      })
      .addCase(approveReservation.rejected, (state, action) => {
        state.status = "failed"
        state.error = action.payload
      })
  }
})

export const { resetReservationDetails } = reservationsSlice.actions

export default reservationsSlice.reducer
