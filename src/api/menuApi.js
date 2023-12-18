import axiosClient from "./axiosClient"

const menuApi = {
  getMenuByRestaurant: ({ restaurantId }) => axiosClient.get(`api/v1/restaurant/${restaurantId}/categories`),

  createMenu: (formData) => axiosClient.post("api/v1/restaurant/categories/create", formData),

  addImage: (dishId, params) =>
    axiosClient.post(`api/v1/restaurant/categories/${dishId}/images`, params, {
      contentType: `multipart/form-data; boundary=${params._boundary}`
    }),

  addDishesToMenu: (dishId, params) => axiosClient.post(`api/v1/dish/${dishId}/category`, params),

  updateMenu: (params, menuId) => axiosClient.patch(`api/v1/restaurant/categories/${menuId}`, params),

  updateDishesToMenu: (dishId, params) => axiosClient.patch(`api/v1/dish/${dishId}/category`, params),

  getMenuDetails: ({ menuId }) => axiosClient.get(`api/v1/restaurant/categories/${menuId}/dishes`)
}

export default menuApi
