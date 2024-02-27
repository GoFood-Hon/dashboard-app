import axiosClient from "./axiosClient"

const orderApi = {
  // Restaurant and Branch
  getAllOrders: () => axiosClient.get("api/v1/order/get-orders"),

  // Get orders, Kitchen
  getOrders: () => axiosClient.get("api/v1/order/kitchen/get-orders"),

  // Get order details
  getOrderDetails: (id) => axiosClient.get(`api/v1/order/get-order-details/${id}`),

  // Update order status, Kitchen
  updateOrderStatus: (id) => axiosClient.patch(`api/v1/order/kitchen/order-ready/${id}`),

  // Confirm order, Restaurant
  confirmOrder: (id) => axiosClient.patch(`api/v1/order/confirm-order/${id}`),

  // Cancel order, Restaurant
  cancelOrder: (id) => axiosClient.patch(`api/v1/order/cancel-order/${id}`)
}

export default orderApi
