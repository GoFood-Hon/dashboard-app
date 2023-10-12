/* import { lazy } from "react"
import { Route, Switch, useLocation } from "react-router-dom"

const Home = lazy(() => import("../screens/Home"))
const Login = lazy(() => import("../screens/auth/Login"))
const Register = lazy(() => import("../screens/auth/Register"))
const ForgetPassword = lazy(() => import("../screens/auth/ForgetPassword"))

const Error = lazy(() => import("../screens/Error"))

export const routes = {
  home: "/",
  login: "/login",
  register: "/register",
  forgetPassword: "/forgetPassword"
}

const BaseRoutes = () => {
  const location = useLocation()
  const background = location.state?.background

  return (
    <>
      <Switch location={background || location}>
        <Route path={routes.home} exact component={Home} />
        <Route path={routes.login} exact component={Login} />
        <Route path={routes.register} exact component={Register} />
        <Route path={routes.forgetPassword} exact component={ForgetPassword} />

        <Route path="*" component={Error} />
      </Switch>
    </>
  )
}

export default BaseRoutes
 */
