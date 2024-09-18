import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  value: {},
  currentPage: 1,
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.value = action.payload;
    },
    incrementTotalItems: (state, action) => {
      state.currentPage += action.payload; // Suma el valor recibido al totalItems
    },
    decrementTotalItems: (state, action) => {
      state.currentPage -= action.payload; // Resta el valor recibido al totalItems
    },
    setTotalItems: (state, action) => {
      state.currentPage = action.payload; // Establece un valor específico para totalItems
    },
  },
});

export const { setUser, incrementTotalItems, decrementTotalItems, setTotalItems } = userSlice.actions;

export default userSlice.reducer;

// import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
// import userApi from "../../api/userApi"

// // Async Thunks
// export const createUser = createAsyncThunk("user/createUser", async (params, { rejectWithValue }) => {
//   try {
//     const response = await userApi.createUser(params)
//     return response.data
//   } catch (error) {
//     return rejectWithValue(error.response.data)
//   }
// })

// export const getUsersByRestaurant = createAsyncThunk("user/getUsersByRestaurant", async (params, { rejectWithValue }) => {
//   try {
//     const response = await userApi.getUsersByRestaurant(params)
//     return response.data
//   } catch (error) {
//     return rejectWithValue(error.response.data)
//   }
// })

// export const getUsersByBranch = createAsyncThunk("user/getUsersByBranch", async (params, { rejectWithValue }) => {
//   try {
//     const response = await userApi.getUsersByBranch(params)
//     return response.data
//   } catch (error) {
//     return rejectWithValue(error.response.data)
//   }
// })

// export const updateUserRestaurant = createAsyncThunk(
//   "user/updateUserRestaurant",
//   async ({ userId, params }, { rejectWithValue }) => {
//     try {
//       const response = await userApi.updateUserRestaurant(params, userId)
//       return response.data
//     } catch (error) {
//       return rejectWithValue(error.response.data)
//     }
//   }
// )

// export const getAdminUsers = createAsyncThunk("user/getAdminUsers", async (params, { rejectWithValue }) => {
//   try {
//     const response = await userApi.getAdminUsers(params)
//     return response.data
//   } catch (error) {
//     return rejectWithValue(error.response.data)
//   }
// })

// export const updateAdminUser = createAsyncThunk("user/updateAdminUser", async ({ id, params }, { rejectWithValue }) => {
//   try {
//     const response = await userApi.updateAdminUser(id, params)
//     return response.data
//   } catch (error) {
//     return rejectWithValue(error.response.data)
//   }
// })

// export const deleteAdminUser = createAsyncThunk("user/deleteAdminUser", async (id, { rejectWithValue }) => {
//   try {
//     const response = await userApi.deleteAdminUser(id)
//     return response.data
//   } catch (error) {
//     return rejectWithValue(error.response.data)
//   }
// })

// export const addImage = createAsyncThunk("user/addImage", async ({ id, params }, { rejectWithValue }) => {
//   try {
//     const response = await userApi.addImage(id, params)
//     return response.data
//   } catch (error) {
//     return rejectWithValue(error.response.data)
//   }
// })

// // Initial state
// const initialState = {
//   users: [],
//   adminUsers: [],
//   status: "idle",
//   value: {},
//   error: null
// }

// // Slice
// const userSlice = createSlice({
//   name: "user",
//   initialState,
//   reducers: {},
//   extraReducers: (builder) => {
//     // createUser
//     builder
//       .addCase(createUser.pending, (state) => {
//         state.status = "loading"
//       })
//       .addCase(createUser.fulfilled, (state, action) => {
//         state.status = "succeeded"
//         state.users.push(action.payload)
//       })
//       .addCase(createUser.rejected, (state, action) => {
//         state.status = "failed"
//         state.error = action.payload
//       })

//     // getUsersByRestaurant
//     builder
//       .addCase(getUsersByRestaurant.pending, (state) => {
//         state.status = "loading"
//       })
//       .addCase(getUsersByRestaurant.fulfilled, (state, action) => {
//         state.status = "succeeded"
//         state.users = action.payload
//       })
//       .addCase(getUsersByRestaurant.rejected, (state, action) => {
//         state.status = "failed"
//         state.error = action.payload
//       })

//     // getUsersByBranch
//     builder
//       .addCase(getUsersByBranch.pending, (state) => {
//         state.status = "loading"
//       })
//       .addCase(getUsersByBranch.fulfilled, (state, action) => {
//         state.status = "succeeded"
//         state.users = action.payload
//       })
//       .addCase(getUsersByBranch.rejected, (state, action) => {
//         state.status = "failed"
//         state.error = action.payload
//       })

//     // updateUserRestaurant
//     builder
//       .addCase(updateUserRestaurant.pending, (state) => {
//         state.status = "loading"
//       })
//       .addCase(updateUserRestaurant.fulfilled, (state, action) => {
//         state.status = "succeeded"
//         const index = state.users.findIndex((user) => user.id === action.payload.id)
//         if (index !== -1) {
//           state.users[index] = action.payload
//         }
//       })
//       .addCase(updateUserRestaurant.rejected, (state, action) => {
//         state.status = "failed"
//         state.error = action.payload
//       })

//     // getAdminUsers
//     builder
//       .addCase(getAdminUsers.pending, (state) => {
//         state.status = "loading"
//       })
//       .addCase(getAdminUsers.fulfilled, (state, action) => {
//         state.status = "succeeded"
//         state.adminUsers = action.payload
//       })
//       .addCase(getAdminUsers.rejected, (state, action) => {
//         state.status = "failed"
//         state.error = action.payload
//       })

//     // updateAdminUser
//     builder
//       .addCase(updateAdminUser.pending, (state) => {
//         state.status = "loading"
//       })
//       .addCase(updateAdminUser.fulfilled, (state, action) => {
//         state.status = "succeeded"
//         const index = state.adminUsers.findIndex((admin) => admin.id === action.payload.id)
//         if (index !== -1) {
//           state.adminUsers[index] = action.payload
//         }
//       })
//       .addCase(updateAdminUser.rejected, (state, action) => {
//         state.status = "failed"
//         state.error = action.payload
//       })

//     // deleteAdminUser
//     builder
//       .addCase(deleteAdminUser.pending, (state) => {
//         state.status = "loading"
//       })
//       .addCase(deleteAdminUser.fulfilled, (state, action) => {
//         state.status = "succeeded"
//         state.adminUsers = state.adminUsers.filter((admin) => admin.id !== action.meta.arg)
//       })
//       .addCase(deleteAdminUser.rejected, (state, action) => {
//         state.status = "failed"
//         state.error = action.payload
//       })

//     // addImage
//     builder
//       .addCase(addImage.pending, (state) => {
//         state.status = "loading"
//       })
//       .addCase(addImage.fulfilled, (state, action) => {
//         state.status = "succeeded"
//         const index = state.users.findIndex((user) => user.id === action.payload.id)
//         if (index !== -1) {
//           state.users[index].image = action.payload.image
//         }
//       })
//       .addCase(addImage.rejected, (state, action) => {
//         state.status = "failed"
//         state.error = action.payload
//       })
//   }
// })

// export const { setUser } = userSlice.actions

// export default userSlice.reducer
