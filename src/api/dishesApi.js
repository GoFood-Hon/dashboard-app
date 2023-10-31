import axiosClient from "./axiosClient"

const dishesApi = {
  getAllDishes: () => axiosClient.get("api/v1/dish/"),
  getDish: (dishId) => axiosClient.get(`api/v1/dish/${dishId}`),
  createDish: (params) =>
    axiosClient.post("api/v1/dish/", params, { contentType: `multipart/form-data; boundary=${params._boundary}` }),
  updateDish: (params, dishId) =>
    axiosClient.patch(`api/v1/dish/${dishId}`, params, {
      headers: {
        "Content-Type": `multipart/form-data; boundary=${params._boundary}`
      }
    }),
  deleteDish: (dishId) => axiosClient.del(`api/v1/dish/${dishId}`)
}

export default dishesApi
