import axiosClient from "./axiosClient"

const dishesApi = {
  getAllDishes: ({ limit, page, order }) => axiosClient.get(`api/v1/dish?limit=${limit}&page=${page}&order=${order}`),

  getAllDishesByRestaurant: ({ limit, page, order, restaurantId, status, price, startDate, endDate }) => {
    const params = {
      limit,
      page,
      order,
      startDate,
      endDate,
      status,
      price
    }

    const validParams = Object.fromEntries(Object.entries(params).filter(([_, value]) => value !== undefined && value))

    const queryString = new URLSearchParams(validParams).toString()
    const url = `api/v1/restaurant/${restaurantId}/dishes${queryString ? `?${queryString}` : ""}`

    return axiosClient.get(url)
  },

  getDish: (dishId) => axiosClient.get(`api/v1/dish/${dishId}`),
  createDish: (params) =>
    axiosClient.post("api/v1/dish/", params, { contentType: `multipart/form-data; boundary=${params._boundary}` }),
  updateDish: (params, dishId) => axiosClient.patch(`api/v1/dish/${dishId}`, params),
  deleteDish: (dishId) => axiosClient.del(`api/v1/dish/${dishId}`)
}

export default dishesApi
