import axiosClient from "./axiosClient"

const menuApi = {
  getAllMenus: ({ limit, page, order, search, search_field } = {}) => {
    const params = {
      limit,
      page,
      order,
      search,
      search_field
    }

    const validParams = Object.fromEntries(Object.entries(params).filter(([_, value]) => value !== undefined))

    const queryString = new URLSearchParams(validParams).toString()
    const url = `api/v1/restaurant/categories/all${queryString ? `?${queryString}` : ""}`

    return axiosClient.get(url)
  },

  getMenuByRestaurant: ({ restaurantId, limit, page, order, search, search_field } = {}) => {
    const params = {
      restaurantId,
      limit,
      page,
      order,
      search,
      search_field
    }

    const validParams = Object.fromEntries(Object.entries(params).filter(([_, value]) => value !== undefined))

    const queryString = new URLSearchParams(validParams).toString()
    const url = `api/v1/restaurant/${restaurantId}/categories${queryString ? `?${queryString}` : ""}`

    return axiosClient.get(url)
  },

  getAllDishesByRestaurant: ({ limit, restaurantId, page, order, search_field, search } = {}) => {
    const params = { limit, restaurantId, page, order, search_field, search }

    const filteredParams = Object.fromEntries(Object.entries(params).filter(([_, value]) => value !== undefined && value))

    const queryString = new URLSearchParams(filteredParams).toString()
    const url = `api/v1/restaurant/${restaurantId}/dishes${queryString ? `?${queryString}` : ""}`

    return axiosClient.get(url)
  },

  createMenu: (formData) => axiosClient.post("api/v1/restaurant/categories/create", formData),

  addImage: (menuId, params) =>
    axiosClient.post(`api/v1/restaurant/categories/${menuId}/image`, params, {
      contentType: `multipart/form-data; boundary=${params._boundary}`
    }),

  addDishesToMenu: (menuId, params) => axiosClient.put(`api/v1/restaurant/categories/${menuId}/dishes`, params),

  updateMenu: (params, menuId) => axiosClient.patch(`api/v1/restaurant/categories/${menuId}`, params),

  getMenuDetails: ({ menuId }) => axiosClient.get(`api/v1/restaurant/${menuId}/categories/`)
}

export default menuApi
