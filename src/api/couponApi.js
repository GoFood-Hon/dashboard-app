import axiosClient from "./axiosClient"

const couponApi = {
  // Get coupon history
  getCoupons: ({ limit, page, order, search_field, search } = {}) => {
    const params = {
      limit,
      page,
      order,
      search_field,
      search
    }
    const validParams = Object.fromEntries(Object.entries(params).filter(([_, value]) => value !== undefined && value))

    const queryString = new URLSearchParams(validParams).toString()

    const url = `api/v1/coupon${queryString ? `?${queryString}` : ""}`

    return axiosClient.get(url)
  },
  
  // Create coupon
  createCoupon: (params) => axiosClient.post("api/v1/coupon/", params),

  // Delete coupon
  deleteCoupon: (couponId) => axiosClient.delete(`api/v1/coupon/${couponId}`),

  // Add or update image
  addImage: (couponId, params) =>
    axiosClient.post(`api/v1/coupon/${couponId}/images`, params, {
      contentType: `multipart/form-data; boundary=${params._boundary}`
    }),
    
  // Activate or Deactivate coupon
  updateStatus: (couponId, params) => axiosClient.patch(`api/v1/coupon/status/${couponId}`, params),

  // Activate or Deactivate coupon
  updateCoupon: (couponId, params) => axiosClient.patch(`api/v1/coupon/${couponId}`, params)
}

export default couponApi
