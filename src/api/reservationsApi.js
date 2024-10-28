import axiosClient from "./axiosClient"

const reservationsApi = {
  getReservationByBranch: (branchId) => axiosClient.get(`api/v1/sucursal/${branchId}/reservations`),

  getReservationByRestaurant: (restaurantId) => axiosClient.get(`api/v1/restaurant/${restaurantId}/reservations`),

  getReservationDetails: (reservationId) => axiosClient.get(`api/v1/table-reservation/${reservationId}`),

  addCommentsToReservations: (reservationId, params) =>
    axiosClient.post(`api/v1/table-reservation/${reservationId}/comment`, params),

  cancelReservation: (reservationId, params) => axiosClient.patch(`api/v1/table-reservation/${reservationId}/cancel`, params),

  approveReservation: (reservationId, revisedBy) =>
    axiosClient.patch(`api/v1/table-reservation/${reservationId}/approve`, { revisedBy }),

  setReservationToPending: (reservationId) => axiosClient.patch(`api/v1/table-reservation/${reservationId}/approve`)
}

export default reservationsApi
