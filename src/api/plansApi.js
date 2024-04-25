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
  updatePlan: (id, params) => axiosClient.put(`api/v1/plan/${id}`, params),

  // Update or create plan feature
  updatePlanFeature: (params) => axiosClient.post(`api/v1/plan/plan-feature`, params),

  // Add or update feature to plan
  updateFeatureToPlan: (params) => axiosClient.patch(`api/v1/plan/plan-feature`, params),

  // Get all plans
  getAllPlans: (params) => axiosClient.get(`api/v1/plan/`, params),

  // Add card to restaurant (Admin restaurant)
  addCard: (params) => axiosClient.post(`api/v1/plan/credit-card/add-card`, params),

  // Get card to restaurant (Admin restaurant)
  getCard: () => axiosClient.get("api/v1/plan/credit-card/get-card")
}
export default plansApi
