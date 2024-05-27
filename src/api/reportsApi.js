import axiosClient from "./axiosClient"

const reportsApi = {
  // Get New Users (Super Admin, Admin Restaurant)
  getNewUsers: () => axiosClient.get("api/v1/reports/new-users?limit=8"),

  // Get Top Selling Dishes (Super Admin, Admin restaurant)
  // 5. Ranking de los productos mas vendidos  ❎
  getTopSellingDishes: () => axiosClient.get("api/v1/reports/top-selling-dishes"),

  // Get Daily Sales (Super admin, Admin restaurant)
  // 3. Ventas Diarias totales ❎
  getDailySales: (startDate, endDate) => axiosClient.get(`api/v1/reports/daily-sales?startDate=${startDate}&endDate=${endDate}`),

  // Get Average Ticket (Admin restaurant)
  getAverageTicket: () => axiosClient.get("api/v1/reports/average-ticket"),

  // Get Average Ticket and Quantity Sales Daily (Admin restaurant)
  // Total de pedidos diarios
  // 8. Promedio de valor ticket según venta diaria. ❎
  getAverageTicketDaily: () => axiosClient.get("api/v1/reports/average-ticket-daily"),

  // Get Orders Quantity By Channel (Super admin, admin restaurant)
  // 1. Cantidad de pedidos generados por dia en sus diferentes canales de entrega ❎
  getOrdersByChannel: () => axiosClient.get("api/v1/reports/total-sales-channel?startDate=2024-01-01&endDate=2024-12-12"),

  // Get Orders Sales By Channel (Super admin, admin restaurant)
  // 2. Venta por día de los diferentes canales de entrega. ❎
  getOrderSalesByChannel: () =>
    axiosClient.get("api/v1/reports/total-sales-channel-daily?startDate=2024-01-01&endDate=2024-12-12"),

  // Get Coupons Use (Super admin, admin restaurant, admin-sucursal) Copy
  getCouponsUse: () => axiosClient.get("api/v1/reports/coupon-usage"),

  // Get Offers usage (Admin Restaurant Admin Sucursal)
  getOffersUsage: () => axiosClient.get("api/v1/reports/offer-usage?startDate=2024-01-10"),

  // Get Users Count (Super Admin, Admin restaurant)
  // Total clientes  ❎
  getUsersCount: () => axiosClient.get("api/v1/reports/offer-usage?startDate=2024-01-01"),

  // Get Menu Sales (Admin restaurant)
  // Lista  de los Menus con el total de venta ❎
  getMenuSales: () => axiosClient.get("api/v1/reports/offer-usage?startDate=2024-01-10"),

  // Get Performance by Day and Hour (Admin restaurant)
  // 6. Rendimiento por hora y por semana actividad comercial según venta por hora. ❎
  getPerformanceByDayAndHour: () => axiosClient.get("api/v1/reports/performance-hour"),

  // Get Products Sales  (Admin restaurant)
  // Lista de los productos, ordenados por cantidad de ventas. ❎
  getProductSales: () => axiosClient.get("api/v1/reports/products-sold")
}

export default reportsApi
