import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import authApi from "../../api/authApi"

const initialState = {
  user: null,
  userDetails: null,
  loading: false,
  error: null
}

export const signup = createAsyncThunk("auth/signup", async (params, { rejectWithValue }) => {
  try {
    const response = await authApi.signup(params)
    return response.data
  } catch (error) {
    return rejectWithValue(error.response.data)
  }
})

export const login = createAsyncThunk("auth/login", async (params, { rejectWithValue }) => {
  try {
    const response = await authApi.login(params)
    return response.data
  } catch (error) {
    return rejectWithValue(error.response.data)
  }
})

export const verifyToken = createAsyncThunk("auth/verifyToken", async (refreshToken, { rejectWithValue }) => {
  try {
    const response = await authApi.verifyToken(refreshToken)
    return response.data
  } catch (error) {
    return rejectWithValue(error.response.data)
  }
})

export const getUser = createAsyncThunk("auth/getUser", async (_, { rejectWithValue }) => {
  try {
    const response = await authApi.getUser()
    return response.data
  } catch (error) {
    return rejectWithValue(error.response.data)
  }
})

export const getUserDetails = createAsyncThunk("auth/getUserDetails", async (id, { rejectWithValue }) => {
  try {
    const response = await authApi.getUserDetails(id)
    return response.data
  } catch (error) {
    return rejectWithValue(error.response.data)
  }
})

// Slice
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Signup
      .addCase(signup.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(signup.fulfilled, (state, action) => {
        state.loading = false
        state.user = action.payload
      })
      .addCase(signup.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      // Login
      .addCase(login.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false
        state.user = action.payload
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      // Verify Token
      .addCase(verifyToken.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(verifyToken.fulfilled, (state, action) => {
        state.loading = false
        state.user = action.payload
      })
      .addCase(verifyToken.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      // Get User
      .addCase(getUser.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(getUser.fulfilled, (state, action) => {
        state.loading = false
        state.user = action.payload
      })
      .addCase(getUser.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      // Get User Details
      .addCase(getUserDetails.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(getUserDetails.fulfilled, (state, action) => {
        state.loading = false
        state.userDetails = action.payload
      })
      .addCase(getUserDetails.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
  }
})

export const logoutAction = () => ({ type: "auth/logout" })

// Exportar el reductor
export default authSlice.reducer
