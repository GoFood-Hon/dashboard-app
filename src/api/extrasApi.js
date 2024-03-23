import axiosClient from "./axiosClient"

const extrasApi = {
  createExtra: (params) => axiosClient.post("api/v1/extra", params),

  updateExtra: (extraId, params) => axiosClient.patch(`api/v1/extra/${extraId}`, params),

  deleteExtra: (extraId) => axiosClient.delete(`api/v1/extra/${extraId}`),

  createExtraDetails: (extraId, params) => axiosClient.post(`api/v1/extra/${extraId}/detail`, params),

  updateExtraDetails: (extraId, params) => axiosClient.patch(`api/v1/extra/${extraId}`, params),

  deleteExtraDetails: (extraId) => axiosClient.delete(`api/v1/extra/${extraId}`)
}

export default extrasApi
