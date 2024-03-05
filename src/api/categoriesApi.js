import axiosClient from "./axiosClient"
const categoriesApi = {
  createCategory: (params) => axiosClient.post("api/v1/category-dish", params),

  addCategoryToDish: (params) => {
    axiosClient.post("api/v1/category-dish/add-dish", params)
  }
}

export default categoriesApi
