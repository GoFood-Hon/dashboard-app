import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import orderApi from "../../api/orderApi"
import { ITEMS_PER_PAGE } from "../../utils/paginationConfig"
import { showNotification } from "@mantine/notifications"

export const fetchAllOrders = createAsyncThunk(
  "orders/fetchAllOrders",
  async ({ limit, page, search_field, search, status }, { rejectWithValue }) => {
    try {
      const response = await orderApi.getAllOrders({
        limit,
        page,
        order: "DESC",
        search_field,
        search,
        status
      })
      return { data: response.data, result: response.result, page }
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message)
    }
  }
)

export const fetchOrdersForKitchen = createAsyncThunk(
  "orders/fetchOrdersForKitchen",
  async ({ limit, page, search_field, search }, { rejectWithValue }) => {
    try {
      const response = await orderApi.getOrdersForKitchen({
        limit,
        page,
        order: "DESC",
        search_field,
        search
      })
      return { data: response.data, result: response.result, page }
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message)
    }
  }
)

export const fetchOrderDetails = createAsyncThunk("orders/fetchOrderDetails", async (id, { rejectWithValue }) => {
  try {
    const response = await orderApi.getOrderDetails(id)
    return response.data
  } catch (error) {
    return rejectWithValue(error.response?.data || error.message)
  }
})

export const updateOrderStatus = createAsyncThunk("orders/updateOrderStatus", async (id, { rejectWithValue }) => {
  try {
    const response = await orderApi.updateOrderStatus(id)
    if (response.error) {
      showNotification({
        title: "Error",
        message: response.message,
        color: "red"
      })

      return rejectWithValue(response.message)
    }

    showNotification({
      title: "Actualización exitosa",
      message: "El estado del pedido se actualizó correctamente",
      color: "green",
      duration: 7000
    })

    return response.data
  } catch (error) {
    return rejectWithValue(error.response?.data || error.message)
  }
})

export const confirmOrder = createAsyncThunk("orders/confirmOrder", async (id, { rejectWithValue }) => {
  try {
    const response = await orderApi.confirmOrder(id)

    if (response.error) {
      showNotification({
        title: "Error",
        message: response.message,
        color: "red"
      })

      return rejectWithValue(response.message)
    }

    showNotification({
      title: "Actualización exitosa",
      message: "El pedido fue confirmado correctamente",
      color: "green",
      duration: 7000
    })
    return response.data
  } catch (error) {
    return rejectWithValue(error.response?.data || error.message)
  }
})

export const cancelOrder = createAsyncThunk("orders/cancelOrder", async (id, { rejectWithValue }) => {
  try {
    const response = await orderApi.cancelOrder(id)
    if (response.error) {
      showNotification({
        title: "Error",
        message: response.message,
        color: "red"
      })

      return rejectWithValue(response.message)
    }

    showNotification({
      title: "Actualización exitosa",
      message: "El pedido se marcó como cancelado",
      color: "green",
      duration: 7000
    })
    return response.data
  } catch (error) {
    return rejectWithValue(error.response?.data || error.message)
  }
})

export const fetchKitchenOrders = createAsyncThunk("orders/fetchKitchenOrders", async (_, { rejectWithValue }) => {
  try {
    const response = await orderApi.getKitchenOrders()
    return response.data
  } catch (error) {
    return rejectWithValue(error.response?.data || error.message)
  }
})

export const fetchDrivers = createAsyncThunk("orders/fetchDrivers", async (sucursalId, { rejectWithValue }) => {
  try {
    const response = await orderApi.getDrivers(sucursalId)
    return response.data
  } catch (error) {
    return rejectWithValue(error.response?.data || error.message)
  }
})

export const assignDriver = createAsyncThunk("orders/assignDriver", async (params, { rejectWithValue }) => {
  try {
    const response = await orderApi.assignDriver(params)
    if (response.error) {
      showNotification({
        title: "Error",
        message: response.message,
        color: "red"
      })

      return rejectWithValue(response.message)
    }

    showNotification({
      title: "Asignación exitosa",
      message: "Se asignó un conductor al pedido",
      color: "green",
      duration: 7000
    })

    return {...response.data, status: 'ready-to-pick-up'}
  } catch (error) {
    return rejectWithValue(error.response?.data || error.message)
  }
})

export const markOrderDelivered = createAsyncThunk("orders/markOrderDelivered", async (id, { rejectWithValue }) => {
  try {
    const response = await orderApi.markOrderDelivered(id)
    if (response.error) {
      showNotification({
        title: "Error",
        message: response.message,
        color: "red"
      })

      return rejectWithValue(response.message)
    }

    showNotification({
      title: "Actualización exitosa",
      message: "El se marcó como entregado",
      color: "green",
      duration: 7000
    })
    return response.data
  } catch (error) {
    return rejectWithValue(error.response?.data || error.message)
  }
})

// Slice de órdenes
const ordersSlice = createSlice({
  name: "orders",
  initialState: {
    orders: [],
    itemsPerPage: ITEMS_PER_PAGE,
    currentPage: 1,
    totalPagesCount: 0,
    totalOrders: 0,
    ordersPerPage: [],
    orderDetails: null,
    loadingDetails: false,
    loadingOrders: false,
    updatingOrderStatus: false,
    cancelOrderStatus: false,

    //Drivers data
    loadingDrivers: false,
    updatingDriver: false,
    drivers: [],
    status: "idle",
    error: null
  },
  reducers: {
    setCurrentPage: (state, action) => {
      state.currentPage = action.payload
    },
    setTotalOrders: (state, action) => {
      state.totalOrders = action.payload
    },
    setNewOrder: (state, action) => {
      const newOrder = action.payload

      if (!state.ordersPerPage[1]) {
        state.ordersPerPage[1] = []
      }
      state.ordersPerPage[1].unshift(newOrder)

      for (let i = 1; i <= state.totalPagesCount; i++) {
        if (state.ordersPerPage[i]?.length > state.itemsPerPage) {
          const lastItem = state.ordersPerPage[i].pop()
          if (state.ordersPerPage[i + 1]) {
            state.ordersPerPage[i + 1].unshift(lastItem)
          }
        } else {
          break
        }
      }

      const consecutivePages = [1]
      for (let i = 2; i <= state.totalPagesCount; i++) {
        if (state.restaurantsPerPage[i]) {
          if (consecutivePages.includes(i - 1)) {
            consecutivePages.push(i)
          } else {
            delete state.restaurantsPerPage[i]
          }
        }
      }

      state.totalOrders += 1
      state.totalPagesCount = Math.ceil(state.totalOrders / state.itemsPerPage)
    },
    setOrderStatus: (state, action) => {
      const { id, status } = action.payload
      const currentPageOrders = state.ordersPerPage[state.currentPage]
      const index = currentPageOrders.findIndex((order) => order?.id === id)

      if (index !== -1) {
        currentPageOrders[index] = { ...currentPageOrders[index], status }
      }

      if (state.orderDetails && state.orderDetails.id === id) {
        state.orderDetails = { ...state.orderDetails, status }
      }
    }
  },
  extraReducers: (builder) => {
    builder

      //Obtener todos los pedidos
      .addCase(fetchAllOrders.pending, (state) => {
        state.loadingOrders = true
      })
      .addCase(fetchAllOrders.fulfilled, (state, action) => {
        const { data, result, page } = action.payload
        state.ordersPerPage[page] = data
        state.loadingOrders = false
        state.currentPage = page
        state.totalOrders = result
        state.totalPagesCount = Math.ceil(result / action.meta.arg.limit)
      })
      .addCase(fetchAllOrders.rejected, (state, action) => {
        state.loadingOrders = false
        state.error = action.payload
      })

      //Obtener el detalle de la orden
      .addCase(fetchOrderDetails.pending, (state) => {
        state.loadingDetails = true
      })
      .addCase(fetchOrderDetails.fulfilled, (state, action) => {
        state.loadingDetails = false
        state.orderDetails = action.payload
      })
      .addCase(fetchOrderDetails.rejected, (state, action) => {
        state.loadingDetails = false
        state.error = action.payload
      })

      //Marcar el pedido como listo desde el rol de cocina
      .addCase(updateOrderStatus.pending, (state, action) => {
        state.updatingOrderStatus = true
      })
      .addCase(updateOrderStatus.fulfilled, (state, action) => {
        const { id, status } = action.payload
        state.orderDetails.status = status
        state.updatingOrderStatus = false
        const currentPageOrders = state.ordersPerPage[state.currentPage]
        const index = currentPageOrders.findIndex((order) => order?.id === id)

        if (index !== -1) {
          currentPageOrders[index] = { ...currentPageOrders[index], status }
        }
      })
      .addCase(updateOrderStatus.rejected, (state, action) => {
        state.updatingOrderStatus = false
        state.error = action.payload
      })

      //Confirmar orden desde el rol de administrador de restaurante o de sucursal
      .addCase(confirmOrder.pending, (state, action) => {
        state.updatingOrderStatus = true
      })
      .addCase(confirmOrder.fulfilled, (state, action) => {
        const { id, status } = action.payload
        const currentPageOrders = state.ordersPerPage[state.currentPage]
        const index = currentPageOrders.findIndex((order) => order?.id === id)
        state.orderDetails.status = status

        if (index !== -1) {
          currentPageOrders[index] = { ...currentPageOrders[index], status }
        }

        state.updatingOrderStatus = false
      })
      .addCase(confirmOrder.rejected, (state, action) => {
        state.updatingOrderStatus = false
        state.error = action.payload
      })

      //Cancelar la orden desde el rol de administrador de restaurante o de sucursal
      .addCase(cancelOrder.pending, (state, action) => {
        state.cancelOrderStatus = true
      })
      .addCase(cancelOrder.fulfilled, (state, action) => {
        const { id, status } = action.payload
        state.orderDetails.status = status
        state.cancelOrderStatus = false
        const currentPageOrders = state.ordersPerPage[state.currentPage]
        const index = currentPageOrders.findIndex((order) => order?.id === id)

        if (index !== -1) {
          currentPageOrders[index] = { ...currentPageOrders[index], status }
        }
      })
      .addCase(cancelOrder.rejected, (state, action) => {
        state.cancelOrderStatus = false
        state.error = action.payload
      })

      //Obtener las órdenes para las personas de cocina
      .addCase(fetchOrdersForKitchen.pending, (state) => {
        state.status = "loading"
      })
      .addCase(fetchOrdersForKitchen.fulfilled, (state, action) => {
        state.status = "succeeded"
        state.orders = action.payload
      })
      .addCase(fetchOrdersForKitchen.rejected, (state, action) => {
        state.status = "failed"
        state.error = action.payload
      })

      //Obtener la lista de motoristas de la sucursal
      .addCase(fetchDrivers.pending, (state) => {
        state.loadingDrivers = true
      })
      .addCase(fetchDrivers.fulfilled, (state, action) => {
        state.drivers = action.payload
        state.loadingDrivers = false
      })
      .addCase(fetchDrivers.rejected, (state, action) => {
        state.loadingDrivers = false
        state.error = action.payload
      })

      //Asignar un motorista para que entrege el pedido
      .addCase(assignDriver.pending, (state) => {
        state.updatingOrderStatus = true
      })
      .addCase(assignDriver.fulfilled, (state, action) => {
        const { id, status } = action.payload
        state.orderDetails.status = status
        state.orderDetails.driver = action.payload
        state.updatingOrderStatus = false
        const currentPageOrders = state.ordersPerPage[state.currentPage]
        const index = currentPageOrders.findIndex((order) => order?.id === id)

        if (index !== -1) {
          currentPageOrders[index] = { ...currentPageOrders[index], status }
        }
      })
      .addCase(assignDriver.rejected, (state, action) => {
        state.updatingOrderStatus = false
        state.error = action.payload
      })

      //Marcar el pedido como entregado desde el rol de administrador de restaurante o de sucursal
      .addCase(markOrderDelivered.pending, (state) => {
        state.updatingOrderStatus = true
      })
      .addCase(markOrderDelivered.fulfilled, (state, action) => {
        const { id, status } = action.payload
        state.orderDetails.status = status
        state.updatingOrderStatus = false
        const currentPageOrders = state.ordersPerPage[state.currentPage]
        const index = currentPageOrders.findIndex((order) => order?.id === id)

        if (index !== -1) {
          currentPageOrders[index] = { ...currentPageOrders[index], status }
        }
      })
      .addCase(markOrderDelivered.rejected, (state, action) => {
        state.updatingOrderStatus = false
        state.error = action.payload
      })
  }
})

export const { setCurrentPage, setTotalOrders, setNewOrder, setOrderStatus } = ordersSlice.actions

export default ordersSlice.reducer
