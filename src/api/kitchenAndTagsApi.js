import axiosClient from "./axiosClient"

const kitchenAndTagsApi = {
  //Endpoints para los tipos de cocina
  getAllKitchenType: () => axiosClient.get("api/v1/cuisine-type"),

  createKitchenType: (params) => axiosClient.post(`api/v1/cuisine-type`, params),

  updateKitchenType: (params, id) => axiosClient.patch(`api/v1/cuisine-type/${id}`, params),

  deleteKitchenType: (id) => axiosClient.delete(`api/v1/cuisine-type/${id}`),

  //Endpoints para los tags de los productos
  getAllDishesTags: () => axiosClient.get("api/v1/tag"),

  createDishesTag: (params) => axiosClient.post("api/v1/tag", params),

  updateDishesTag: (id, params) => axiosClient.patch(`api/v1/tag/${id}`, params),

  deleteDishesTag: (id) => axiosClient.delete(`api/v1/tag/${id}`),
}

export default kitchenAndTagsApi
