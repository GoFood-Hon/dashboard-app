import axiosClient from "./axiosClient"

const reservationsApi = {
  getReservationByBranch: (branchId) => axiosClient.get(`api/v1/sucursal/${branchId}/reservations`),

  getReservationByRestaurant: (restaurantId) => axiosClient.get(`api/v1/restaurant/${restaurantId}/reservations`),

  getReservationDetails: (reservationId) => axiosClient.get(`api/v1/table-reservation/${reservationId}`),

  addCommentsToReservations: (reservationId, params) => axiosClient.post(`api/v1/table-reservation/${reservationId}/comment`, params),

  cancelReservation: (reservationId) => axiosClient.patch(`api/v1/table-reservation/${reservationId}/cancel`),

  approveReservation: (reservationId) => axiosClient.patch(`api/v1/table-reservation/${reservationId}/approve`)
}

export default reservationsApi
