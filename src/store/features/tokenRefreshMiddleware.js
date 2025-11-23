import { store } from "../store"

export const tokenRefreshMiddleware =
  ({ dispatch }) =>
  (next) =>
  (action) => {
    if (action.type.endsWith("/rejected") && action.meta?.arg) {
      const err = action.payload || action.error

      const data = err?.data ?? err
      const status = data?.status

      if (status !== "token_expired") {
        return next(action)
      }

      if (action.meta.arg.__isRetry) {
        return next(action)
      }

      if (data.token) {
        localStorage.setItem("token", data.token)
      }
      if (data.refreshToken) {
        localStorage.setItem("refreshToken", data.refreshToken)
      }
      if (data.user?.role) {
        localStorage.setItem("setUserRole", data.user.role)
      }

      const originalArgs = action.meta.arg

      const typePrefix = action.type.replace("/rejected", "")

      const thunkCreator = store.extraArgument?.[typePrefix]

      if (thunkCreator) {
        const retryArgs = {
          ...originalArgs,
          __isRetry: true
        }

        return dispatch(thunkCreator(retryArgs))
      }
    }

    return next(action)
  }
