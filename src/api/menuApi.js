import axiosClient from "./axiosClient"

const menuApi = {
  getMenuByRestaurant: ({ restaurantId }) => axiosClient.get(`api/v1/restaurant/${restaurantId}/categories`)
}

export default menuApi
