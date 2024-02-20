import axiosClient from "./axiosClient"

const plansApi = {
  // Create plan (super admin)
  createPlan: (params) => axiosClient.post(`api/v1/plan`, params),

  // Get plan (super admin)
  getPlan: (params, id) => axiosClient.get(`api/v1/plan/${id}/get`, params),

  // Get features (super admin)
  getFeatures: (params) => axiosClient.get("api/v1/plan/feature", params),

  // Update feature (super admin)
  updateFeature: (params, id) => axiosClient.patch(`api/v1/plan/feature/${id}`, params),

  // Create feature (super admin)
  createFeature: (params) => axiosClient.post("api/v1/plan/feature", params),

  // Update plan (super admin)
  updatePlan: (params, id) => axiosClient.patch(`api/v1/plan/${id}`, params),

  // Update or create plan feature
  updatePlanFeature: (params) => axiosClient.post(`api/v1/plan/plan-feature`, params),

  // Add or update feature to plan
  updateFeatureToPlan: (params) => axiosClient.patch(`api/v1/plan/plan-feature`, params),

  // Get all plans
  getAllPlans: (params) => axiosClient.get(`api/v1/plan/`, params)
}
export default plansApi
