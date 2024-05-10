import axiosClient from "./axiosClient"

const reportsApi = {
  // Get New Users (Super Admin, Admin Restaurant)
  getNewUsers: () => axiosClient.get("api/v1/reports/new-users?limit=8"),

  // Get Top Selling Dishes
  getTopSellingDishes: () => axiosClient.get("api/v1/reports/top-selling-dishes"),

  // Get Daily Sales (Super admin, Admin restaurant)
  getDailySales: (startDate, endDate) => axiosClient.get(`api/v1/reports/daily-sales?startDate=${startDate}&endDate=${endDate}`),

  // Get Average Ticket (Admin restaurant)
  getAverageTicket: () => axiosClient.get("api/v1/reports/average-ticket"),

  // Get Average Ticket Daily (Super admin, admin restaurant)
  getAverageTicketDaily: () => axiosClient.get("api/v1/reports/average-ticket-daily"),

  // Get Orders By Channel (Super admin, admin restaurant, admin-sucursal)
  getOrdersByChannel: () => axiosClient.get("api/v1/reports/total-sales-channel?startDate=2024-01-01&endDate=2024-05-02"),

  // Get Coupons Use (Super admin, admin restaurant, admin-sucursal) Copy
  getCouponsUse: () => axiosClient.get("api/v1/reports/coupon-usage"),

  // Get Offers usage (Admin Restaurant Admin Sucursal)
  getOffersUsage: () => axiosClient.get("api/v1/reports/offer-usage?startDate=2024-01-10")
}

export default reportsApi
