import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import userApi from "../../api/userApi"
import { showNotification } from "@mantine/notifications"
import { ITEMS_PER_PAGE } from "../../utils/paginationConfig"
import authApi from "../../api/authApi"

export const fetchAdminUsers = createAsyncThunk(
  "user/fetchAdminUsers",
  async ({ limit, page, search_field, search }, { rejectWithValue }) => {
    try {
      const response = await userApi.getAdminUsers({
        limit,
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

      return { data: response.data, results: response.results, page }
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

export const fetchUsers = createAsyncThunk(
  "user/fetchUsers",
  async ({ restaurantId, limit, page, search_field, search }, { rejectWithValue }) => {
    try {
      const response = await userApi.getUsersByRestaurant({
        restaurantId,
        limit,
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

      return { data: response.data, results: response.results, page }
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

export const createAdminUser = createAsyncThunk(
  "user/createAdminUser",
  async ({ params, formDataImage }, { rejectWithValue }) => {
    try {
      const response = await authApi.createNewAdmin(params)
      const userData = response.data.data

      if (response.error) {
        showNotification({
          title: "Error",
          message: "Fallé en la data: " + response.message,
          color: "red",
          duration: 7000
        })

        return rejectWithValue(response.message)
      }

      let images = []
      if (formDataImage) {
        const imageResponse = await userApi.addImage(userData.id, formDataImage)
        images = imageResponse.data

        if (imageResponse.error) {
          showNotification({
            title: "Error",
            message: "Fallé en la imagen: " + imageResponse.message,
            color: "red",
            duration: 7000
          })

          return rejectWithValue(imageResponse.message)
        }
      }

      showNotification({
        title: "Creación exitosa",
        message: `El administrador ${userData.name} fue creado`,
        color: "green",
        duration: 5000
      })

      return { ...userData, images }
    } catch (error) {
      showNotification({
        title: "Error",
        message: error.message || "Error desconocido",
        color: "red",
        duration: 7000
      })

      return rejectWithValue(error.message)
    }
  }
)

export const updateUserData = createAsyncThunk(
  "user/updateUserData",
  async ({ id, params, formDataImage }, { rejectWithValue }) => {
    try {
      const response = await userApi.updateAdminUser(id, params)
      let userData = response.data
      if (response.error) {
        showNotification({
          title: "Error",
          message: response.message,
          color: "red",
          duration: 7000
        })

        return rejectWithValue(response.message)
      }

      if (formDataImage) {
        const imageResponse = await userApi.addImage(id, formDataImage)

        if (imageResponse.error) {
          showNotification({
            title: "Error",
            message: imageResponse.message,
            color: "red"
          })

          return rejectWithValue(imageResponse.message)
        }

        userData = { ...userData, images: imageResponse.data }
      }

      showNotification({
        title: "Actualización exitosa",
        message: `El administrador ${userData.name} fue actualizado`,
        color: "green"
      })

      return userData
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

export const updateUserStatus = createAsyncThunk("user/updateUserStatus", async ({ id, params }, { rejectWithValue }) => {
  try {
    const response = await userApi.updateAdminUser(id, params)
    if (response.error) {
      showNotification({
        title: "Error",
        message: response.message,
        color: "red",
        duration: 7000
      })

      return rejectWithValue(response.message)
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
})

export const updateUser = createAsyncThunk(
  "user/updateUser",
  async ({ params, userId }, { rejectWithValue }) => {
    try {
      const response = await userApi.updateUserRestaurant(params, userId)
      if (response.error) {
        showNotification({
          title: "Error",
          message: response.message,
          color: "red",
          duration: 7000
        })

        return rejectWithValue(response.message)
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

export const updateOtherUserStatus = createAsyncThunk(
  "user/updateOtherUserStatus",
  async ({ params, userId }, { rejectWithValue }) => {
    try {
      const response = await userApi.updateUserRestaurant(params, userId)
      if (response.error) {
        showNotification({
          title: "Error",
          message: response.message,
          color: "red",
          duration: 7000
        })

        return rejectWithValue(response.message)
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

const initialState = {
  value: {},
  //Estado de usuarios administradores
  currentPage: 1,
  totalAdminUsers: 0,
  itemsPerPage: ITEMS_PER_PAGE,
  totalPagesCount: 0,
  adminUsersByPage: [],
  loadingUsers: false,
  updatingUser: false,
  creatingUser: false,

  //Estado de los demás usuarios
  currentUserPage: 1,
  totalUsers: 0,
  totalUserPagesCount: 0,
  usersByPage: [],
  loadingOtherUsers: false,
  updatingOtherUser: false,
  creatingOtherUser: false,
  error: null,

  userRole: null
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
    setCurrentUserPage: (state, action) => {
      state.currentUserPage = action.payload
    },
    setTotalAdminUsers: (state, action) => {
      state.totalAdminUsers = action.payload
    },
    setUserRole: (state, action) => {
      state.userRole = action.payload
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
        state.adminUsersByPage[page] = data
        state.loadingUsers = false
        state.currentPage = page
        state.totalAdminUsers = results
        state.totalPagesCount = Math.ceil(results / action.meta.arg.limit)
      })
      .addCase(fetchAdminUsers.rejected, (state, action) => {
        state.loadingUsers = false
        state.error = action.payload
      })
      .addCase(fetchUsers.pending, (state) => {
        state.loadingOtherUsers = true
        state.error = null
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        const { data, results, page } = action.payload
        state.usersByPage[page] = data
        state.loadingOtherUsers = false
        state.currentUserPage = page
        state.totalUsers = results
        state.totalUserPagesCount = Math.ceil(results / action.meta.arg.limit)
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loadingOtherUsers = false
        state.error = action.payload
      })
      .addCase(createAdminUser.pending, (state) => {
        state.creatingUser = true
      })
      .addCase(createAdminUser.fulfilled, (state, action) => {
        const newUser = action.payload

        if (!state.adminUsersByPage[1]) {
          state.adminUsersByPage[1] = []
        }
        state.adminUsersByPage[1].unshift(newUser)

        for (let i = 1; i <= state.totalPagesCount; i++) {
          if (state.adminUsersByPage[i]?.length > state.itemsPerPage) {
            const lastItem = state.adminUsersByPage[i].pop()
            if (state.adminUsersByPage[i + 1]) {
              state.adminUsersByPage[i + 1].unshift(lastItem)
            }
          } else {
            break
          }
        }

        const consecutivePages = [1]
        for (let i = 2; i <= state.totalPagesCount; i++) {
          if (state.adminUsersByPage[i]) {
            if (consecutivePages.includes(i - 1)) {
              consecutivePages.push(i)
            } else {
              delete state.adminUsersByPage[i]
            }
          }
        }

        state.totalAdminUsers += 1
        state.totalPagesCount = Math.ceil(state.totalAdminUsers / state.itemsPerPage)
        state.creatingUser = false
      })
      .addCase(createAdminUser.rejected, (state, action) => {
        state.creatingUser = false
        state.error = action.payload
      })
      .addCase(updateUserStatus.fulfilled, (state, action) => {
        const { id, active } = action.payload
        const currentPageUsers = state.adminUsersByPage[state.currentPage]
        const index = currentPageUsers.findIndex((user) => user?.id === id)

        if (index !== -1) {
          currentPageUsers[index] = { ...currentPageUsers[index], active }
        }
      })
      .addCase(updateUserStatus.rejected, (state, action) => {
        state.loadingUsers = false
        state.error = action.payload
      })
      .addCase(updateOtherUserStatus.fulfilled, (state, action) => {
        const { id, active } = action.payload
        const currentPageOtherUsers = state.usersByPage[state.currentUserPage]
        const index = currentPageOtherUsers.findIndex((user) => user?.id === id)

        if (index !== -1) {
          currentPageOtherUsers[index] = { ...currentPageOtherUsers[index], active }
        }
      })
      .addCase(updateUserData.pending, (state) => {
        state.updatingUser = true
      })
      .addCase(updateUserData.fulfilled, (state, action) => {
        const { id, name, email, phoneNumber, images } = action.payload
        const currentPageUsers = state.adminUsersByPage[state.currentPage]
        const index = currentPageUsers.findIndex((user) => user?.id == id)
        state.updatingUser = false

        if (index !== -1) {
          currentPageUsers[index] = {
            ...currentPageUsers[index],
            name,
            email,
            phoneNumber,
            images: images
          }
        }
      })
      .addCase(updateUserData.rejected, (state, action) => {
        state.updatingUser = false
        state.error = action.payload
      })
  }
})

export const { setUser, setCurrentPage, setCurrentUserPage, setTotalAdminUsers, setUserRole } = userSlice.actions

export default userSlice.reducer
