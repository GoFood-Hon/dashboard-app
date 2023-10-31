import authApi from "../api/authApi"

const authUtils = {
  isAuthenticated: async () => {
    const token = localStorage.getItem("token")
    const refreshToken = localStorage.getItem("refreshToken")
    if (!token) return false
    try {
      const user = await authApi.getUser()

      if (user.status === "error" || !user) {
        const res = await authApi.verifyToken(refreshToken)
        console.log(res)
        localStorage.setItem("token", res.token)
      }

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
