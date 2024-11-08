import axiosClient from "./axiosClient"

const plansApi = {
  // Create plan (super admin)
  createPlan: (params) => axiosClient.post(`api/v1/plan`, params),

  // Get plan (super admin)
  getPlan: (id) => axiosClient.get(`api/v1/plan/${id}/get`),

  // Get features (super admin)
  getFeatures: () => axiosClient.get("api/v1/plan/feature"),

  // Update feature (super admin)
  updateFeature: (params, id) => axiosClient.patch(`api/v1/plan/feature/${id}`, params),

  // Create feature (super admin)
  createFeature: (params) => axiosClient.post("api/v1/plan/feature", params),

  // Update plan (super admin)
  updatePlan: (id, params) => axiosClient.patch(`api/v1/plan/${id}`, params),

  // Update or create plan feature
  updatePlanFeature: (params) => axiosClient.post(`api/v1/plan/plan-feature`, params),

  // Add or update feature to plan
  updateFeatureToPlan: (params) => axiosClient.patch(`api/v1/plan/plan-feature`, params),

  // Get all plans
  getAllPlans: ({ limit, page, order, search_field, search } = {}) => {
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
    const url = `api/v1/plan${queryString ? `?${queryString}` : ""}`

    return axiosClient.get(url)
  },

  // Add card to restaurant (Admin restaurant)
  addCard: (params) => axiosClient.post(`api/v1/plan/credit-card/add-card`, params),

  // Get card to restaurant (Admin restaurant)
  getCard: () => axiosClient.get("api/v1/plan/credit-card/get-card"),

  // Create subscription for restaurant (Superadmin)
  assignPlan: (params) => axiosClient.post(`api/v1/plan/subscription/create`, params),

  //Cancel active subscription for restaurant (Admin restaurant)
  cancelPlan: (params) =>
    axiosClient.delete("/api/v1/plan/subscription/cancel", {
      data: params
    })
}
export default plansApi
