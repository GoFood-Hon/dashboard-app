import axiosClient from "./axiosClient"

const dishesCategoriesApi = {
  createCategory: (params) => axiosClient.post("api/v1/restaurant/categories/create", params),

  getCategoryByRestaurant: (restaurantId) => axiosClient.get(`api/v1/restaurant/${restaurantId}/categories`),

  getAllCategories: (limit, page) => axiosClient.get(`api/v1/restaurant/categories/all?limit=${limit}&page=${page}`),

  updateCategory: (params, categoryId) => axiosClient.patch(`api/v1/addon/categories/${categoryId}`, params),

  deleteCategory: (categoryId) => axiosClient.del(`api/v1/restaurant/categories/${categoryId}`)
}

export default dishesCategoriesApi
