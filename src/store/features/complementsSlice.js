import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import complementsApi from "../../api/complementsApi"
import { ITEMS_PER_PAGE } from "../../utils/paginationConfig"
import toast from "react-hot-toast"
import { convertToDecimal } from "../../utils"

const initialState = {
  complements: [],
  currentPage: 1,
  itemsPerPage: ITEMS_PER_PAGE,
  totalItems: 0,
  filters: {
    startDate: null,
    endDate: null,
    status: null,
    startPrice: null
  }
}

export const fetchComplements = createAsyncThunk(
  "complements/fetchComplements",
  async ({ limit, page, order, restaurantId, filters, category }, { dispatch }) => {
    let formattedStartDate = null
    let formattedEndDate = null
    let formattedStatus = null
    let formattedPrice = null

    const { startDate, endDate, status, startPrice } = filters

    if (startDate) {
      formattedStartDate = startDate.toISOString().split("T")[0]
    }

    if (endDate) {
      formattedEndDate = endDate.toISOString().split("T")[0]
    }

    if (status) {
      formattedStatus = status === "Todos" ? null : status === "Habilitado" ? "true" : "false"
    }

    if (startPrice) {
      formattedPrice = `${startPrice || ""}`
    }

    try {
      const response = await complementsApi.getAddOnByRestaurant({
        limit,
        page,
        order,
        category,
        restaurantId,
        startDate: formattedStartDate,
        endDate: formattedEndDate,
        status: formattedStatus,
        price: formattedPrice
      })
      dispatch(setComplements(response.data.data))
      return response
    } catch (error) {
      dispatch(setError("Error fetching complements"))
      throw error
    }
  }
)

const uploadComplementImage = async (complementId, file) => {
  const formDataImage = new FormData()
  formDataImage.append("files", file)

  return await complementsApi.addImage(complementId, formDataImage)
}

/*
 * CREATE COMPLEMENT
 */

export const createComplement = createAsyncThunk("complements/createComplement", async ({ data, restaurantId }, { dispatch }) => {
  try {
    const formData = new FormData()
    formData.append("name", data.name)
    formData.append("description", data.description)
    formData.append("category", data.category)

    formData.append("price", convertToDecimal(data.price))
    formData.append("restaurantId", restaurantId)

    const response = await complementsApi.createAddOn(formData)

    dispatch(fetchComplements())

    if (response.error) {
      toast.error(`Fallo al crear complemento. Por favor intente de nuevo. ${response.message}`, {
        duration: 7000
      })
    } else {
      const complementId = response.data.id
      const addImageResponse = await uploadComplementImage(complementId, data?.files?.[0])

      if (addImageResponse.error) {
        toast.error(`Fallo al subir la imagen. Por favor intente de nuevo. ${addImageResponse.message}`, {
          duration: 7000
        })
      }

      toast.success("Complemento creado exitosamente", {
        duration: 7000
      })
    }
    return response.data
  } catch (error) {
    dispatch(setError("Error creating complement"))
    toast.error("Fallo al crear el complemento. Por favor intente de nuevo.", {
      duration: 7000
    })

    throw error
  }
})

/*
 * UPDATE COMPLEMENT
 */

const updateFormData = (data, propertyToUpdate) => {
  const formData = new FormData()
  if (propertyToUpdate === "isActive") {
    formData.append("isActive", data.isActive)
  } else {
    formData.append("name", data.name)
    formData.append("description", data.description)
    formData.append("category", data.category)
    formData.append("price", convertToDecimal(data.price))
  }

  return formData
}

export const updateComplement = createAsyncThunk(
  "complements/updateComplement",
  async ({ data, propertyToUpdate = "all" }, { dispatch }) => {
    try {
      const formData = updateFormData(data, propertyToUpdate)

      const response = await complementsApi.updateAddOn(formData, data?.id)

      if (response.error) {
        toast.error(`Fallo al actualizar el complemento!!!. Por favor intente de nuevo. ${response.message}`, {
          duration: 7000
        })
      } else {
        if (propertyToUpdate !== "isActive") {
          await uploadComplementImage(data?.id, data?.files?.[0])
        }

        toast.success("Complemento actualizado exitosamente", {
          duration: 7000
        })
      }
      return response.data
    } catch (error) {
      dispatch(setError("Error updating add-on"))
      toast.error("Fallo al actualizar el complemento. Por favor intente de nuevo.", {
        duration: 7000
      })

      throw error
    }
  }
)

export const complementsSlice = createSlice({
  name: "complements",
  initialState,
  reducers: {
    setFilters: (state, action) => {
      state.filters = action.payload
    },
    setPage: (state, action) => {
      state.currentPage = action.payload
    },
    setComplements: (state, action) => {
      state.complements = action.payload
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
      .addCase(fetchComplements.pending, (state) => {
        state.status = "loading"
      })
      .addCase(fetchComplements.fulfilled, (state, action) => {
        state.status = "succeeded"
        state.totalItems = action.payload.results
        state.value = action.payload
      })
      .addCase(fetchComplements.rejected, (state, action) => {
        state.status = "failed"
        state.error = action.error
      })
  }
})

export const { setComplements, setError, setPage, setFilters } = complementsSlice.actions

export const setLoading = (state) => state.complements.loading

export const selectAllComplements = (state) => state.complements.complements

export const selectComplementsStatus = (state) => state.complements.status

export const selectComplementsError = (state) => state.complements.error

export default complementsSlice.reducer
