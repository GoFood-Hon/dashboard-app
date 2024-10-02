import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import userApi from "../../api/userApi"
import { showNotification } from "@mantine/notifications"
import { ITEMS_PER_PAGE } from "../../utils/paginationConfig"

// Thunk para obtener los usuarios administradores
export const fetchAdminUsers = createAsyncThunk("user/fetchAdminUsers", async ({ limit, page }, { rejectWithValue }) => {
  try {
    const response = await userApi.getAdminUsers({
      limit,
      page,
      order: "DESC"
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

    return { data: response.data, results: response.results, page } // Regresamos la data, total de resultados y la página
  } catch (error) {
    showNotification({
      title: "Error",
      message: error,
      color: "red",
      duration: 7000
    })
    return rejectWithValue(error.message)
  }
})

// Estado inicial
const initialState = {
  value: {},
  currentPage: 1,
  totalAdminUsers: 0,
  itemsPerPage: ITEMS_PER_PAGE,
  totalPagesCount: 0,
  adminUsersByPage: {}, // Almacena usuarios por página
  loadingUsers: false,
  error: null
}

// Slice de usuarios
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
    },
    // Nueva acción para agregar un usuario
    addNewUser: (state, action) => {
      const newUser = action.payload

      // Inserta el nuevo usuario al principio de la página 1
      if (state.adminUsersByPage[1]) {
        state.adminUsersByPage[1].unshift(newUser)
      } else {
        state.adminUsersByPage[1] = [newUser]
      }

      // Verifica si hay más de 10 usuarios en la página 1
      if (state.adminUsersByPage[1].length > 10) {
        // Desplaza el último usuario de la página 1 a la página 2
        const movedUser = state.adminUsersByPage[1].pop()

        // Inserta el usuario movido en la página 2 (crea la página si no existe)
        if (state.adminUsersByPage[2]) {
          state.adminUsersByPage[2].unshift(movedUser)
        } else {
          state.adminUsersByPage[2] = [movedUser]
        }
      }

      // Incrementa el total de usuarios y recalcula el total de páginas
      state.totalAdminUsers += 1
      state.totalPagesCount = Math.ceil(state.totalAdminUsers / 10)
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAdminUsers.pending, (state) => {
        state.loadingUsers = true
        state.error = null
      })
      .addCase(fetchAdminUsers.fulfilled, (state, action) => {
        const { data, results, page } = action.payload

        // Almacenamos los usuarios en el objeto por página
        state.adminUsersByPage[page] = data // Almacenamos los usuarios de la página correspondiente

        state.loadingUsers = false
        state.currentPage = page // Actualizamos la página actual
        state.totalAdminUsers = results // Actualiza el total de usuarios basado en results
        state.totalPagesCount = Math.ceil(results / action.meta.arg.limit) // Actualiza el total de páginas
      })
      .addCase(fetchAdminUsers.rejected, (state, action) => {
        state.loadingUsers = false
        state.error = action.payload // Maneja el error
      })
  }
})

// Exportar las acciones
export const { setUser, setCurrentPage, setTotalAdminUsers, addNewUser } = userSlice.actions

// Exportar el reductor
export default userSlice.reducer
