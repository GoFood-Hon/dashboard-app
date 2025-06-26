import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import orderApi from "../../api/orderApi"
import { ITEMS_PER_PAGE, ITEMS_PER_PAGE_CARDS } from "../../utils/paginationConfig"
import { showNotification } from "@mantine/notifications"

const initialState = {
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
  searchField: "name",
  searchData: null,
  searchValue: null,

  //kitchen data
  itemsForKitchenPerPage: ITEMS_PER_PAGE_CARDS,
  currentOrdersForKitchenPage: 1,
  totalOrdersForKitchenPagesCount: 0,
  totalOrdersForKitchen: 0,
  ordersForKitchenPerPage: [],
  loadingOrdersForKitchen: false,

  //Drivers data
  loadingDrivers: false,
  updatingDriver: false,
  drivers: [],
  status: "idle",
  error: null,

  //Purchase history data
  purchaseHistoryData: [],
  dateRange: [],
  loadingHistory: false
}

export const fetchAllOrders = createAsyncThunk(
  "orders/fetchAllOrders",
  async ({ limit, page, order, search_field, search, status }, { rejectWithValue }) => {
    try {
      const response = await orderApi.getAllOrders({
        limit,
        page,
        order,
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
  async ({ limit, page, order, search_field, search, status }, { rejectWithValue }) => {
    try {
      const response = await orderApi.getAllOrders({
        limit,
        page,
        order,
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
      title: "Confirmaciòn exitosa",
      message: "El estado del pedido se marcó como confirmado",
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

    return { ...response.data, status: "ready-to-pick-up" }
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
      message: "El pedido se marcó como entregado",
      color: "green",
      duration: 7000
    })
    return response.data
  } catch (error) {
    return rejectWithValue(error.response?.data || error.message)
  }
})

export const getOrdersHistoryRestaurant = createAsyncThunk(
  "orders/getOrdersHistoryRestaurant",
  async ({ restaurantId, startDate, endDate }, { rejectWithValue }) => {
    try {
      const response = await orderApi.getOrdersHistoryRestaurant({ restaurantId, startDate, endDate })
      if (response.error) {
        showNotification({
          title: "Error",
          message: response.message,
          color: "red"
        })

        return rejectWithValue(response.message)
      }

      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message)
    }
  }
)

export const getOrdersHistorySucursal = createAsyncThunk(
  "orders/getOrdersHistorySucursal",
  async ({ sucursalId, startDate, endDate }, { rejectWithValue }) => {
    try {
      const response = await orderApi.getOrdersHistorySucursal({ sucursalId, startDate, endDate })
      if (response.error) {
        showNotification({
          title: "Error",
          message: response.message,
          color: "red"
        })

        return rejectWithValue(response.message)
      }

      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message)
    }
  }
)

// Slice de órdenes
const ordersSlice = createSlice({
  name: "orders",
  initialState,
  reducers: {
    setCurrentPage: (state, action) => {
      state.currentPage = action.payload
    },
    setCurrentPageForKitchen: (state, action) => {
      state.currentOrdersForKitchenPage = action.payload
    },
    setTotalOrders: (state, action) => {
      state.totalOrders = action.payload
    },
    setNewOrder: (state, action) => {
      const newOrder = action.payload
      const itemsPerPage = state.itemsForKitchenPerPage
      const newOrdersPerPage = { ...state.ordersForKitchenPerPage }

      // Buscar la última página que tenga espacio
      let lastPage = state.totalOrdersForKitchenPagesCount

      // Si la última página no existe, la creamos vacía
      if (!newOrdersPerPage[lastPage]) {
        newOrdersPerPage[lastPage] = []
      }

      // Agregamos el pedido al final de la última página
      newOrdersPerPage[lastPage].push(newOrder)

      // Si la última página se excede, pasamos el último pedido a una nueva página
      if (newOrdersPerPage[lastPage].length > itemsPerPage) {
        const overflowOrder = newOrdersPerPage[lastPage].pop()
        lastPage += 1
        newOrdersPerPage[lastPage] = [overflowOrder]
      }

      // Actualizamos conteos
      const updatedTotalOrders = state.totalOrdersForKitchen + 1
      const updatedTotalPagesCount = Math.ceil(updatedTotalOrders / itemsPerPage)

      // Limpiar páginas inválidas en restaurantsPerPage
      const validPages = new Set([...Array(updatedTotalPagesCount).keys()].map((i) => i + 1))
      const newRestaurantsPerPage = { ...state.restaurantsPerPage }

      for (const page in newRestaurantsPerPage) {
        if (!validPages.has(Number(page))) {
          delete newRestaurantsPerPage[page]
        }
      }

      // Guardamos el nuevo estado
      state.ordersForKitchenPerPage = newOrdersPerPage
      state.totalOrdersForKitchen = updatedTotalOrders
      state.totalOrdersForKitchenPagesCount = updatedTotalPagesCount
      state.restaurantsPerPage = newRestaurantsPerPage
    },
    setOrderStatus: (state, action) => {
      const { id, status, sentToKitchenTimestamp, finishedCookingTimestamp } = action.payload
      const currentPageOrders = state.ordersPerPage[state.currentPage]
      const index = currentPageOrders.findIndex((order) => order?.id === id)

      if (index !== -1) {
        currentPageOrders[index] = { ...currentPageOrders[index], status }
      }

      if (state.orderDetails && state.orderDetails.id === id) {
        state.orderDetails = { ...state.orderDetails, status, sentToKitchenTimestamp, finishedCookingTimestamp }
      }
    },
    setDateRange: (state, action) => {
      state.dateRange = action.payload
    },
    setSelectedSearchOption: (state, action) => {
      state.searchField = action.payload
    },
    setSearchData: (state, action) => {
      state.searchData = action.payload
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
      .addCase(updateOrderStatus.pending, (state) => {
        state.updatingOrderStatus = true
      })
      .addCase(updateOrderStatus.fulfilled, (state, action) => {
        const { id } = action.payload
        const currentPageOrdersForKitchen = state.ordersForKitchenPerPage[state.currentOrdersForKitchenPage]
        const updatedOrders = currentPageOrdersForKitchen?.filter((order) => order.id !== id)
        state.ordersForKitchenPerPage[state.currentOrdersForKitchenPage] = updatedOrders

        state.updatingOrderStatus = false
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

        if (index !== -1) {
          currentPageOrders[index] = { ...currentPageOrders[index], status }
        }

        state.orderDetails.status = status
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
        const currentPageOrders = state.ordersPerPage[state.currentPage]
        const index = currentPageOrders.findIndex((order) => order?.id === id)

        if (index !== -1) {
          currentPageOrders[index] = { ...currentPageOrders[index], status }
        }
        state.orderDetails.status = status
        state.cancelOrderStatus = false
      })
      .addCase(cancelOrder.rejected, (state, action) => {
        state.cancelOrderStatus = false
        state.error = action.payload
      })

      //Obtener las órdenes para las personas de cocina
      .addCase(fetchOrdersForKitchen.pending, (state) => {
        state.loadingOrdersForKitchen = true
      })
      .addCase(fetchOrdersForKitchen.fulfilled, (state, action) => {
        const { data, result, page } = action.payload
        state.ordersForKitchenPerPage[page] = data
        state.loadingOrdersForKitchen = false
        state.currentOrdersForKitchenPage = page
        state.totalOrdersForKitchen = result
        state.totalOrdersForKitchenPagesCount = Math.ceil(result / action.meta.arg.limit)
      })
      .addCase(fetchOrdersForKitchen.rejected, (state, action) => {
        state.loadingOrdersForKitchen = false
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
        state.updatingDriver = true
      })
      .addCase(assignDriver.fulfilled, (state, action) => {
        const { id, status } = action.payload
        const currentPageOrders = state.ordersPerPage[state.currentPage]
        const index = currentPageOrders.findIndex((order) => order?.id === id)

        if (index !== -1) {
          currentPageOrders[index] = { ...currentPageOrders[index], status }
        }
        state.orderDetails.status = status
        state.orderDetails.driver = action.payload
        state.updatingDriver = false
      })
      .addCase(assignDriver.rejected, (state, action) => {
        state.updatingDriver = false
        state.error = action.payload
      })

      //Marcar el pedido como entregado desde el rol de administrador de restaurante o de sucursal
      .addCase(markOrderDelivered.pending, (state) => {
        state.updatingOrderStatus = true
      })
      .addCase(markOrderDelivered.fulfilled, (state, action) => {
        const { id, status } = action.payload
        const currentPageOrders = state.ordersPerPage[state.currentPage]
        const index = currentPageOrders.findIndex((order) => order?.id === id)

        if (index !== -1) {
          currentPageOrders[index] = { ...currentPageOrders[index], status }
        }
        state.orderDetails.status = status
        state.updatingOrderStatus = false
      })
      .addCase(markOrderDelivered.rejected, (state, action) => {
        state.updatingOrderStatus = false
        state.error = action.payload
      })

      .addCase(getOrdersHistoryRestaurant.pending, (state) => {
        state.loadingHistory = true
      })
      .addCase(getOrdersHistoryRestaurant.fulfilled, (state, action) => {
        state.purchaseHistoryData = action.payload
        state.loadingHistory = false
      })
      .addCase(getOrdersHistoryRestaurant.rejected, (state, action) => {
        state.loadingHistory = false
        state.error = action.payload
      })

      .addCase(getOrdersHistorySucursal.pending, (state) => {
        state.loadingHistory = true
      })
      .addCase(getOrdersHistorySucursal.fulfilled, (state, action) => {
        state.purchaseHistoryData = action.payload
        state.loadingHistory = false
      })
      .addCase(getOrdersHistorySucursal.rejected, (state, action) => {
        state.loadingHistory = false
        state.error = action.payload
      })
  }
})

export const {
  setCurrentPage,
  setTotalOrders,
  setNewOrder,
  setOrderStatus,
  setDateRange,
  setSelectedSearchOption,
  setSearchData
} = ordersSlice.actions

export default ordersSlice.reducer
