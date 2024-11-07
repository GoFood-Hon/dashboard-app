import axiosClient from "./axiosClient"

const orderApi = {
  // Restaurant and Branch
  getAllOrders: ({ limit, page, order, search_field, search } = {}) => {
    const params = {
      limit,
      page,
      order,
      search_field,
      search
    }

    // Filtrar valores no definidos o vacíos (más robusto)
    const validParams = Object.fromEntries(Object.entries(params).filter(([_, value]) => value !== undefined && value !== ""))

    const queryString = new URLSearchParams(validParams).toString()
    const url = `api/v1/order/get-orders${queryString ? `?${queryString}` : ""}`

    return axiosClient.get(url)
  },

  // Get orders, Kitchen
  getOrdersForKitchen: ({ limit, page, order, search_field, search } = {}) => {
    const params = {
      limit,
      page,
      order,
      search_field,
      search
    }

    // Filtrar valores no definidos o vacíos (más robusto)
    const validParams = Object.fromEntries(Object.entries(params).filter(([_, value]) => value !== undefined && value !== ""))

    const queryString = new URLSearchParams(validParams).toString()
    const url = `api/v1/order/kitchen/get-orders${queryString ? `?${queryString}` : ""}`

    return axiosClient.get(url)
  },

  // Get order details
  getOrderDetails: (id) => axiosClient.get(`api/v1/order/get-order-details/${id}`),

  // Update order status, Kitchen
  updateOrderStatus: (id) => axiosClient.patch(`api/v1/order/kitchen/order-ready/${id}`),

  // Confirm order, Restaurant
  confirmOrder: (id) => axiosClient.patch(`api/v1/order/confirm-order/${id}`),

  // Cancel order, Restaurant
  cancelOrder: (id) => axiosClient.patch(`api/v1/order/cancel-order/${id}`),

  // Get Order History (kitchen)
  getKitchenOrders: () => axiosClient.get("api/v1/order/get-kitchen-order-history"),

  // Get Drivers by Sucursal (admin sucursal, admin restaurant)
  getDrivers: (sucursalId) => axiosClient.get(`api/v1/order/get-drivers/${sucursalId}`),

  // Assign Driver (admin restaurant, admin sucursal)
  assignDriver: (params) => axiosClient.patch("api/v1/order/assign-driver", params),

  // Mark order as delivered (Admin sucursal, admin restaurant)
  markOrderDelivered: (id) => axiosClient.patch(`api/v1/order/mark-order-as-delivered/${id}`)
}

export default orderApi
