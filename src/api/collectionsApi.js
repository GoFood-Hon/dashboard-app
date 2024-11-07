import axiosClient from "./axiosClient"

const collectionsApi = {
  getAllCollections: ({ limit, page, order, search_field, search } = {}) => {
    const params = {
      limit,
      page,
      order,
      search_field,
      search
    }

    // Filtrar valores no definidos o vacíos (más robusto)
    const validParams = Object.fromEntries(Object.entries(params).filter(([_, value]) => value !== undefined && value !== ""))

    const queryString = new URLSearchParams(validParams).toString()
    const url = `api/v1/set${queryString ? `?${queryString}` : ""}`

    return axiosClient.get(url)
  },

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
