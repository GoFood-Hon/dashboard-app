import axiosClient from "./axiosClient"

const dishesApi = {
  getAllDishes: () => axiosClient.get("api/v1/dish/"),
  getDish: (dishId) => axiosClient.patch(`api/v1/dish/${dishId}`),
  createDish: (params) => axiosClient.get("api/v1/dish/", params),
  updateDish: (params, dishId) => axiosClient.patch(`api/v1/dish/${dishId}`, params),
  deleteDish: (dishId) => axiosClient.patch(`api/v1/dish/${dishId}`)
}

export default dishesApi
