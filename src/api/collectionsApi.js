import axiosClient from "./axiosClient"

const collectionsApi = {
  getAllCollections: ({ page, limit, order, orderBy, isActive }) =>
    axiosClient.get("api/v1/set", {
      params: {
        page,
        limit,
        order,
        orderBy,
        isActive
      }
    }),

  getCollectionDetails: (setId) => axiosClient.get(`api/v1/set/${setId}`),

  createCollection: (params) => axiosClient.post("api/v1/set", params),

  updateCollection: (setId, params) => axiosClient.patch(`api/v1/set/${setId}`, params),

  createCollectionImage: (setId, params) =>
    axiosClient.patch(`api/v1/set/${setId}/banner`, params, {
      contentType: `multipart/form-data; boundary=${params._boundary}`
    }),

  addDishToCollection: (setId, dishId) => axiosClient.post(`api/v1/set/${setId}/dishes/${dishId}`),

  deleteDishFromCollection: (setId, dishId) => axiosClient.delete(`api/v1/set/${setId}/dishes/${dishId}`),

  addRestaurantToCollection: (setId, restaurantId) => axiosClient.post(`api/v1/set/${setId}/restaurants/${restaurantId}`),

  deleteRestaurantFromCollection: (setId, restaurantId) => axiosClient.delete(`api/v1/set/${setId}/restaurants/${restaurantId}`)
}

export default collectionsApi
