import axiosClient from "./axiosClient"

const couponApi = {
  // Create coupon
  createCoupon: (params) => axiosClient.post("api/v1/coupon/", params),
  // Delete coupon
  deleteCoupon: (id, params) => axiosClient.delete(`api/v1/coupon/${id}`, params),
  // Get coupon history
  getCoupons: () => axiosClient.get("api/v1/coupon"),
  // Add or update image
  addImage: (couponId, params) =>
    axiosClient.post(`api/v1/coupon/${couponId}/images`, params, {
      contentType: `multipart/form-data; boundary=${params._boundary}`
    })
}

export default couponApi
