import axiosClient from "./axiosClient"

const couponApi = {
  createCoupon: (params) => axiosClient.post("api/v1/coupon/", params),

  deleteCoupon: (id, params) => axiosClient.delete(`api/v1/coupon/${id}`, params),

  getCoupons: () => axiosClient.get("api/v1/coupon")
}

export default couponApi
