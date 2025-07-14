import axiosClient from "./axiosClient"

const reviewsApi = {
  getAllReviews: ({ restaurantId, limit, page, order, search, search_field }) => {
    const params = {
      restaurantId,
      limit,
      page,
      order,
      search,
      search_field
    }

    const validParams = Object.fromEntries(Object.entries(params).filter(([_, value]) => value !== undefined))

    const queryString = new URLSearchParams(validParams).toString()
    const url = `api/v1/review/restaurant/${restaurantId}${queryString ? `?${queryString}` : ""}`

    return axiosClient.get(url)
  },

  getReviewById: (reviewId) => axiosClient.post(`api/v1/review/${reviewId}`),

  updateReviewVisibility: (reviewId, params) => axiosClient.patch(`api/v1/review/${reviewId}/toggle`, params)
}

export default reviewsApi
