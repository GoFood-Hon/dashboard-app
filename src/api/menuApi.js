import axiosClient from "./axiosClient"

const menuApi = {
  getMenuByRestaurant: ({ restaurantId }) => axiosClient.get(`api/v1/restaurant/${restaurantId}/categories`),

  createMenu: (formData) => axiosClient.post("api/v1/restaurant/categories/create", formData),

  addImage: (dishId, params) =>
    axiosClient.post(`api/v1/restaurant/categories/${dishId}/images`, params, {
      contentType: `multipart/form-data; boundary=${params._boundary}`
    })
}

export default menuApi
