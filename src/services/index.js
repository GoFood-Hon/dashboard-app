import axios from "axios"

import { DEFAULT_API_CONFIG } from "./config"
import { ApiResponseMessage } from "./constants"

class Api {
  constructor(config = DEFAULT_API_CONFIG) {
    this.config = config
    this.client = axios.create({ baseURL: this.config.url, timeout: this.config.timeout })
  }

  setHeaders(header) {
    this.client.defaults.headers = { ...this.client.defaults.headers, ...header }
  }

  async withAuth() {
    const token = await getAuthToken()
    this.client.interceptors.request.use(function (config) {
      config.headers.Authorization = token ? `Bearer ${token}` : ""
      return config
    })
  }

  static getApiErrorMessage(error) {
    if (!error?.response) return ApiResponseMessage.NetworkError
    return error?.response?.data?.message || Api.getDefaultErrorMessage(error?.response?.status)
  }

  static getDefaultErrorMessage(status) {
    switch (status) {
      case 400:
        return ApiResponseMessage.BadRequest
      case 401:
        return ApiResponseMessage.Unauthorized
      case 403:
        return ApiResponseMessage.Forbidden
      case 404:
        return ApiResponseMessage.NotFound
      case 422:
        return ApiResponseMessage.UnProcessableEntity
      case 500:
        return ApiResponseMessage.InternalServerError
      default:
        return ApiResponseMessage.UnknownError
    }
  }
}

export default Api
