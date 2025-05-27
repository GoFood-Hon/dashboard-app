import axiosClient from "./axiosClient"

const reviewsApi = {
  getAllReviews: (restaurantId) => axiosClient.get(`api/v1/review/restaurant/${restaurantId}`),

  getReviewById: (reviewId) => axiosClient.post(`api/v1/review/${reviewId}`),

  updateReviewVisibility: (reviewId, params) => axiosClient.patch(`api/v1/review/${reviewId}/toggle`, params)
}

export default reviewsApi
