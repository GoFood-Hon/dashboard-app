import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import orderApi from "../../api/orderApi"
import { ITEMS_PER_PAGE } from "../../utils/paginationConfig"

export const fetchAllOrders = createAsyncThunk(
  "orders/fetchAllOrders",
  async ({ limit, page, search_field, search }, { rejectWithValue }) => {
    try {
      const response = await orderApi.getAllOrders({
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
    return response.data
  } catch (error) {
    return rejectWithValue(error.response?.data || error.message)
  }
})

export const confirmOrder = createAsyncThunk("orders/confirmOrder", async (id, { rejectWithValue }) => {
  try {
    const response = await orderApi.confirmOrder(id)
    return response.data
  } catch (error) {
    return rejectWithValue(error.response?.data || error.message)
  }
})

export const cancelOrder = createAsyncThunk("orders/cancelOrder", async (id, { rejectWithValue }) => {
  try {
    const response = await orderApi.cancelOrder(id)
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
    return response.data
  } catch (error) {
    return rejectWithValue(error.response?.data || error.message)
  }
})

export const markOrderDelivered = createAsyncThunk("orders/markOrderDelivered", async (id, { rejectWithValue }) => {
  try {
    const response = await orderApi.markOrderDelivered(id)
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
    ordersPerPage: {},
    orderDetails: null,
    loadingOrders: false,
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
    }
  },
  extraReducers: (builder) => {
    builder
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
      .addCase(fetchOrderDetails.pending, (state) => {
        state.status = "loading"
      })
      .addCase(fetchOrderDetails.fulfilled, (state, action) => {
        state.status = "succeeded"
        state.orderDetails = action.payload
      })
      .addCase(fetchOrderDetails.rejected, (state, action) => {
        state.status = "failed"
        state.error = action.payload
      })
      .addCase(updateOrderStatus.fulfilled, (state, action) => {
        const updatedOrder = action.payload
        state.orders = state.orders.map((order) => (order.id === updatedOrder.id ? updatedOrder : order))
      })
      .addCase(confirmOrder.fulfilled, (state, action) => {
        const confirmedOrder = action.payload
        state.orders = state.orders.map((order) => (order.id === confirmedOrder.id ? confirmedOrder : order))
      })
      .addCase(cancelOrder.fulfilled, (state, action) => {
        const cancelledOrder = action.payload
        state.orders = state.orders.map((order) => (order.id === cancelledOrder.id ? cancelledOrder : order))
      })
      .addCase(fetchKitchenOrders.fulfilled, (state, action) => {
        state.orders = action.payload
      })
      .addCase(fetchDrivers.fulfilled, (state, action) => {
        state.drivers = action.payload
      })
      .addCase(assignDriver.fulfilled, (state, action) => {
        const updatedOrder = action.payload
        state.orders = state.orders.map((order) => (order.id === updatedOrder.id ? updatedOrder : order))
      })
      .addCase(markOrderDelivered.fulfilled, (state, action) => {
        const deliveredOrder = action.payload
        state.orders = state.orders.map((order) => (order.id === deliveredOrder.id ? deliveredOrder : order))
      })
  }
})

export const { setCurrentPage, setTotalOrders } = ordersSlice.actions

export default ordersSlice.reducer
