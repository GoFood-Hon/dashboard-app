import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import { showNotification } from "@mantine/notifications"
import kitchenAndTagsApi from "../../api/kitchenAndTagsApi"

const initialState = {
  kitchenTypes: [],
  dishTags: [],
  loadingTags: false,
  loadingKitchenTypes: false,
  error: null
}

export const fetchAllKitchenTypes = createAsyncThunk("kitchenAndTags/fetchAllKitchenTypes", async (_, { rejectWithValue }) => {
  try {
    const response = await kitchenAndTagsApi.getAllKitchenType()

    return response.data
  } catch (error) {
    if (error?.response?.data?.status !== "token_expired") {
      showNotification({
        title: "Error",
        message: error.response?.data?.message || "Error al obtener los tipos de establecimientos",
        color: "red"
      })
    }

    return rejectWithValue(error.response?.data || "Error al obtener los tipos de establecimientos")
  }
})

export const createKitchenType = createAsyncThunk("kitchenAndTags/createKitchenType", async (params, { rejectWithValue }) => {
  try {
    const response = await kitchenAndTagsApi.createKitchenType(params)

    showNotification({
      title: "Creación exitosa",
      message: "El tipo de establecimiento fue creado correctamente",
      color: "green"
    })
    return response.data
  } catch (error) {
    const message = error?.response?.data?.message?.includes("cocina")
      ? error?.response.data?.message.replace("cocina", "establecimiento")
      : error?.response?.data?.message || "Ocurrió un error inesperado"

    if (error?.response?.data?.status !== "token_expired") {
      showNotification({
        title: "Error",
        message: message || "Error al crear el tipo de establecimiento",
        color: "red"
      })
    }

    return rejectWithValue(error.response?.data || "Error creating kitchen type")
  }
})

export const updateKitchenType = createAsyncThunk(
  "kitchenAndTags/updateKitchenType",
  async ({ id, params }, { rejectWithValue }) => {
    try {
      const response = await kitchenAndTagsApi.updateKitchenType(params, id)
      showNotification({ title: "Éxito", message: "Tipo de establecimiento actualizado", color: "green" })
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data || "Error updating kitchen type")
    }
  }
)

export const deleteKitchenType = createAsyncThunk("kitchenAndTags/deleteKitchenType", async (id, { rejectWithValue }) => {
  try {
    await kitchenAndTagsApi.deleteKitchenType(id)
    showNotification({
      title: "Eliminación exitosa",
      message: "El tipo de establecimiento fue eliminado correctamente",
      color: "green"
    })
    return id
  } catch (error) {
    if (error?.response?.data?.status !== "token_expired") {
      showNotification({
        title: "Error",
        message: error.response?.data?.message || "Error eliminando el tipo de establecimiento",
        color: "red"
      })
    }

    return rejectWithValue(error.response?.data || "Error eliminando el tipo de establecimiento")
  }
})

export const fetchAllDishesTags = createAsyncThunk(
  "kitchenAndTags/fetchAllDishesTags",
  async (_, { getState, rejectWithValue }) => {
    const state = getState().kitchenAndTags

    if (state.dishTags && state.dishTags.length > 0) {
      return state.dishTags
    }

    try {
      const response = await kitchenAndTagsApi.getAllDishesTags()

      return response.data
    } catch (error) {
      if (error?.response?.data?.status !== "token_expired") {
        showNotification({
          title: "Error",
          message: error.response?.data?.message || "Error al obtener las categorías de productos",
          color: "red"
        })
      }

      return rejectWithValue(error.response?.data || "Error al obtener las categorías de productos")
    }
  }
)

export const createDishesTag = createAsyncThunk("kitchenAndTags/createDishesTag", async (params, { rejectWithValue }) => {
  try {
    const response = await kitchenAndTagsApi.createDishesTag(params)

    if (response.error) {
      showNotification({
        title: "Error",
        message,
        color: "red"
      })

      return rejectWithValue(message)
    }

    showNotification({ title: "Creación exitosa", message: `Se agregó la categoría ${response?.data?.name}`, color: "green" })
    return response.data
  } catch (error) {
    const message = error?.response?.data?.message?.includes("El tag")
      ? error?.response?.data?.message.replace("El tag", "La categoría")
      : error?.response?.data?.message || "Ocurrió un error inesperado"

    if (error?.response?.data?.status !== "token_expired") {
      showNotification({
        title: "Error",
        message: message || "Error creando la categoría",
        color: "red"
      })
    }

    return rejectWithValue(error.response?.data || "Error creando la categoría")
  }
})

export const updateDishesTag = createAsyncThunk("kitchenAndTags/updateDishesTag", async ({ id, params }, { rejectWithValue }) => {
  try {
    const response = await kitchenAndTagsApi.updateDishesTag(id, params)
    showNotification({ title: "Éxito", message: "Se actualizó la categoría", color: "green" })
    return response.data
  } catch (error) {
    return rejectWithValue(error.response?.data || "Error updating dish tag")
  }
})

export const deleteDishesTag = createAsyncThunk("kitchenAndTags/deleteDishesTag", async (id, { rejectWithValue }) => {
  try {
    await kitchenAndTagsApi.deleteDishesTag(id)
    showNotification({ title: "Eliminación exitosa", message: "La categoría fue eliminada correctamente", color: "green" })
    return id
  } catch (error) {
    if (error?.response?.data?.status !== "token_expired") {
      showNotification({
        title: "Error",
        message: error.response?.data?.message || "Error eliminando la categoría",
        color: "red"
      })
    }

    return rejectWithValue(error.response?.data || "Error eliminando la categoría")
  }
})

const kitchenAndTagsSlice = createSlice({
  name: "kitchenAndTags",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllKitchenTypes.pending, (state) => {
        state.loadingKitchenTypes = true
      })
      .addCase(fetchAllKitchenTypes.fulfilled, (state, action) => {
        state.kitchenTypes = action.payload
        state.loadingKitchenTypes = false
      })
      .addCase(fetchAllKitchenTypes.rejected, (state, action) => {
        state.error = action.payload
        state.loadingKitchenTypes = false
      })
      .addCase(createKitchenType.pending, (state) => {
        state.loadingKitchenTypes = true
      })
      .addCase(createKitchenType.fulfilled, (state, action) => {
        state.loadingKitchenTypes = false
        state.kitchenTypes.push(action.payload)
      })
      .addCase(createKitchenType.rejected, (state, action) => {
        state.loadingKitchenTypes = false
        state.error = action.payload
      })
      .addCase(updateKitchenType.fulfilled, (state, action) => {
        const index = state.kitchenTypes.findIndex((type) => type.id === action.payload.id)
        state.kitchenTypes[index] = action.payload
      })
      .addCase(deleteKitchenType.fulfilled, (state, action) => {
        state.kitchenTypes = state.kitchenTypes.filter((type) => type.id !== action.payload)
      })

    // Thunks para las categorías de productos
    builder
      .addCase(fetchAllDishesTags.pending, (state) => {
        state.loadingTags = true
      })
      .addCase(fetchAllDishesTags.fulfilled, (state, action) => {
        state.dishTags = action.payload
        state.loadingTags = false
      })
      .addCase(fetchAllDishesTags.rejected, (state, action) => {
        state.error = action.payload
        state.loadingTags = false
      })
      .addCase(createDishesTag.pending, (state) => {
        state.loadingTags = true
      })
      .addCase(createDishesTag.fulfilled, (state, action) => {
        state.loadingTags = false
        state.dishTags.push(action.payload)
      })
      .addCase(createDishesTag.rejected, (state, action) => {
        state.loadingTags = false
        state.error = action.payload
      })
      .addCase(updateDishesTag.fulfilled, (state, action) => {
        const index = state.dishTags.findIndex((tag) => tag.id === action.payload.id)
        state.dishTags[index] = action.payload
      })
      .addCase(deleteDishesTag.fulfilled, (state, action) => {
        state.dishTags = state.dishTags.filter((tag) => tag.id !== action.payload)
      })
  }
})

export default kitchenAndTagsSlice.reducer
