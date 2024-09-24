import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import userApi from "../../api/userApi"
import toast from "react-hot-toast"

// Thunk para obtener los usuarios administradores
export const fetchAdminUsers = createAsyncThunk("user/fetchAdminUsers", async ({ limit, page }, { rejectWithValue }) => {
  try {
    const response = await userApi.getAdminUsers({
      limit,
      page,
      order: "DESC"
    })

    if (response.error) {
      toast.error("Error obteniendo la información de los usuarios")
      return rejectWithValue(response.error)
    }

    return response // Devuelve toda la respuesta si la solicitud es exitosa
  } catch (error) {
    toast.error("Fallo obtener los datos del usuario")
    return rejectWithValue(error.message)
  }
})

const initialState = {
  value: {},
  currentPage: 1,
  totalAdminUsers: 0,
  totalPagesCount: 0,
  adminUsers: [],
  loading: false,
  error: null
}

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.value = action.payload
    },
    setCurrentPage: (state, action) => {
      state.currentPage = action.payload
    },
    setTotalAdminUsers: (state, action) => {
      state.totalAdminUsers = action.payload
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAdminUsers.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchAdminUsers.fulfilled, (state, action) => {
        const results = action.payload.results
        const limit = action.meta.arg.limit // Tomamos el límite pasado en el thunk

        // Solo actualizamos si el total de resultados cambió
        if (state.totalAdminUsers !== results) {
          state.totalAdminUsers = results

          // Calculamos el número total de páginas y redondeamos hacia arriba
          const totalPages = Math.ceil(results / limit)
          state.totalPagesCount = totalPages
        }

        state.adminUsers = action.payload.data // Actualiza los usuarios
        state.loading = false
      })
      .addCase(fetchAdminUsers.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload // Maneja el error
      })
  }
})

// Exportar las acciones
export const { setUser, setCurrentPage, setTotalAdminUsers } = userSlice.actions

export default userSlice.reducer
