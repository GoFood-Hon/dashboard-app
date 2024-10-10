import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import { showNotification } from "@mantine/notifications"
import kitchenAndTagsApi from "../../api/kitchenAndTagsApi"

// Thunks para los tipos de cocina (Cuisine Types)

// Obtener todos los tipos de cocina
export const fetchAllKitchenTypes = createAsyncThunk("kitchenAndTags/fetchAllKitchenTypes", async (_, { rejectWithValue }) => {
  try {
    const response = await kitchenAndTagsApi.getAllKitchenType()
    return response.data
  } catch (error) {
    return rejectWithValue(error.response?.data || "Error fetching kitchen types")
  }
})

// Crear un nuevo tipo de cocina
export const createKitchenType = createAsyncThunk("kitchenAndTags/createKitchenType", async (params, { rejectWithValue }) => {
  try {
    const response = await kitchenAndTagsApi.createKitchenType(params)
    showNotification({ title: "Éxito", message: "Tipo de cocina creado", color: "green" })
    return response.data
  } catch (error) {
    return rejectWithValue(error.response?.data || "Error creating kitchen type")
  }
})

// Actualizar un tipo de cocina
export const updateKitchenType = createAsyncThunk(
  "kitchenAndTags/updateKitchenType",
  async ({ id, params }, { rejectWithValue }) => {
    try {
      const response = await kitchenAndTagsApi.updateKitchenType(params, id)
      showNotification({ title: "Éxito", message: "Tipo de cocina actualizado", color: "green" })
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data || "Error updating kitchen type")
    }
  }
)

// Eliminar un tipo de cocina
export const deleteKitchenType = createAsyncThunk("kitchenAndTags/deleteKitchenType", async (id, { rejectWithValue }) => {
  try {
    await kitchenAndTagsApi.deleteKitchenType(id) // Llamar al API para eliminar
    return id // Retornar el id del tipo de cocina eliminado
  } catch (error) {
    showNotification({ title: "Error", message: "Error eliminando el tipo de cocina", color: "red" })
    return rejectWithValue(error.response?.data || "Error deleting kitchen type")
  }
})

// Thunks para los tags de los platillos (Dish Tags)

// Obtener todos los tags de platillos
export const fetchAllDishesTags = createAsyncThunk(
  "kitchenAndTags/fetchAllDishesTags",
  async (_, { getState, rejectWithValue }) => {
    const state = getState().kitchenAndTags

    // Solo hacer la llamada a la API si aún no se han cargado los tags
    if (state.dishTags && state.dishTags.length > 0) {
      return state.dishTags // Si ya existen los tags, no hace la llamada
    }

    try {
      const response = await kitchenAndTagsApi.getAllDishesTags()
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data || "Error fetching dish tags")
    }
  }
)

// Crear un nuevo tag de platillo
export const createDishesTag = createAsyncThunk("kitchenAndTags/createDishesTag", async (params, { rejectWithValue }) => {
  try {
    const response = await kitchenAndTagsApi.createDishesTag(params)
    showNotification({ title: "Creación exitosa", message: `Se agregó el nuevo tag ${response?.data?.name}`, color: "green" })
    return response.data // Devolver el nuevo tag
  } catch (error) {
    return rejectWithValue(error.response?.data || "Error creating dish tag")
  }
})

// Actualizar un tag de platillo
export const updateDishesTag = createAsyncThunk("kitchenAndTags/updateDishesTag", async ({ id, params }, { rejectWithValue }) => {
  try {
    const response = await kitchenAndTagsApi.updateDishesTag(id, params)
    showNotification({ title: "Éxito", message: "Tag de platillo actualizado", color: "green" })
    return response.data
  } catch (error) {
    return rejectWithValue(error.response?.data || "Error updating dish tag")
  }
})

// Eliminar un tag de platillo
export const deleteDishesTag = createAsyncThunk("kitchenAndTags/deleteDishesTag", async (id, { rejectWithValue }) => {
  try {
    await kitchenAndTagsApi.deleteDishesTag(id)
    return id
  } catch (error) {
    showNotification({ title: "Error", message: "Error eliminando el tag", color: "red" })
    return rejectWithValue(error.response?.data || "Error deleting dish tag")
  }
})

// Slice
const kitchenAndTagsSlice = createSlice({
  name: "kitchenAndTags",
  initialState: {
    kitchenTypes: [],
    dishTags: [],
    loading: false,
    error: null
  },
  reducers: {},
  extraReducers: (builder) => {
    // Thunks para los tipos de cocina
    builder
      .addCase(fetchAllKitchenTypes.pending, (state) => {
        state.loading = true
      })
      .addCase(fetchAllKitchenTypes.fulfilled, (state, action) => {
        state.kitchenTypes = action.payload
        state.loading = false
      })
      .addCase(fetchAllKitchenTypes.rejected, (state, action) => {
        state.error = action.payload
        state.loading = false
      })
      .addCase(createKitchenType.fulfilled, (state, action) => {
        state.kitchenTypes.push(action.payload)
      })
      .addCase(updateKitchenType.fulfilled, (state, action) => {
        const index = state.kitchenTypes.findIndex((type) => type.id === action.payload.id)
        state.kitchenTypes[index] = action.payload
      })
      .addCase(deleteKitchenType.fulfilled, (state, action) => {
        state.kitchenTypes = state.kitchenTypes.filter((type) => type.id !== action.payload)
      })

    // Thunks para los tags de platillos
    builder
      .addCase(fetchAllDishesTags.pending, (state) => {
        state.loading = true
      })
      .addCase(fetchAllDishesTags.fulfilled, (state, action) => {
        state.dishTags = action.payload
        state.loading = false
      })
      .addCase(fetchAllDishesTags.rejected, (state, action) => {
        state.error = action.payload
        state.loading = false
      })
      .addCase(createDishesTag.fulfilled, (state, action) => {
        state.dishTags.push(action.payload)
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
