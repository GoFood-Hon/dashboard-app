import authApi from "../api/authApi"

const authUtils = {
  isAuthenticated: async () => {
    const token = localStorage.getItem("token")
    if (!token) return false
    try {
      const res = await authApi.verifyToken()
      if (res?.status === "success") {
        const user = await authApi.getUser()
        return user?.data?.data
      } else {
        return false
      }
    } catch {
      return false
    }
  }
}

export default authUtils
