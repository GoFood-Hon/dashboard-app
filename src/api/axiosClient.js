import axios from "axios"
import queryString from "query-string"
import { DEFAULT_API_CONFIG } from "../services/config"
import { ApiResponseMessage } from "../services/constants"
import Api from "../services"

const baseUrl = DEFAULT_API_CONFIG.url
const getToken = () => localStorage.getItem("token")

const axiosClient = axios.create({
  baseURL: baseUrl,
  paramsSerializer: (params) => queryString.stringify({ params })
})

axiosClient.interceptors.request.use(async (config) => {
  const token = getToken()

  const headers = {
    "Content-Type": `${config.contentType ?? "application/json"}`,
    authorization: `Bearer ${config.refreshToken ?? token}`
  }

  return {
    ...config,
    headers
  }
})

axiosClient.interceptors.response.use(
  (response) => {
    if (response && response.data) return response.data
    return response
  },
  (err) => {
    if (!err?.response) return ApiResponseMessage.NetworkError
    return err?.response?.data || Api.getDefaultErrorMessage(err?.statusCode)
  }
)

export default axiosClient
