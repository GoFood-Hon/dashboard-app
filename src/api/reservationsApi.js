import axiosClient from "./axiosClient"

const reservationsApi = {
  getReservationByBranch: ({ branchId, limit, page, order, search_field, search } = {}) => {
    const params = {
      limit,
      page,
      order,
      search_field,
      search
    }
    const validParams = Object.fromEntries(Object.entries(params).filter(([_, value]) => value !== undefined && value))

    const queryString = new URLSearchParams(validParams).toString()

    const url = `api/v1/sucursal/${branchId}/reservations${queryString ? `?${queryString}` : ""}`

    return axiosClient.get(url)
  },

  getReservationByRestaurant: ({ restaurantId, limit, page, order, search_field, search } = {}) => {
    const params = {
      limit,
      page,
      order,
      search_field,
      search
    }
    const validParams = Object.fromEntries(Object.entries(params).filter(([_, value]) => value !== undefined && value))

    const queryString = new URLSearchParams(validParams).toString()

    const url = `api/v1/restaurant/${restaurantId}/reservations${queryString ? `?${queryString}` : ""}`

    return axiosClient.get(url)
  },

  getReservationDetails: (reservationId) => axiosClient.get(`api/v1/table-reservation/${reservationId}`),

  addCommentsToReservations: (reservationId, params) =>
    axiosClient.post(`api/v1/table-reservation/${reservationId}/comment`, params),

  cancelReservation: (reservationId, params) => axiosClient.patch(`api/v1/table-reservation/${reservationId}/cancel`, params),

  approveReservation: (reservationId, revisedBy) =>
    axiosClient.patch(`api/v1/table-reservation/${reservationId}/approve`, { revisedBy }),

  setReservationToPending: (reservationId) => axiosClient.patch(`api/v1/table-reservation/${reservationId}/approve`)
}

export default reservationsApi
