import React from "react"
import { AUTH_NAVIGATION_ROUTES, NAVIGATION_ROUTES } from "./routes"
import { Route, RouterProvider, createBrowserRouter, createRoutesFromElements } from "react-router-dom"
import AuthLayout from "./layout/AuthLayout"

import Login from "./screens/auth/Login"
import UnauthenticatedLayout from "./layout/UnauthenticatedLayout"
import Register from "./screens/auth/Register"
import ForgetPassword from "./screens/auth/PasswordRecovery/ForgetPassword"
import Home from "./screens/Home"
import Orders from "./screens/Orders"
import Transactions from "./screens/Transactions"
import Menu from "./screens/Menu"
import Complements from "./screens/Complements"
import Branches from "./screens/Branches"
import Users from "./screens/Users"
import Logout from "./screens/Logout"

function App() {
  const router = createBrowserRouter(
    createRoutesFromElements(
      <>
        <Route element={<AuthLayout />}>
          <Route path={NAVIGATION_ROUTES.Dashboard.path} element={<Home />} />
          <Route path={NAVIGATION_ROUTES.Orders.path} element={<Orders />} />
          <Route path={NAVIGATION_ROUTES.Transactions.path} element={<Transactions />} />
          <Route path={NAVIGATION_ROUTES.Menu.path} element={<Menu />} />
          <Route path={NAVIGATION_ROUTES.Complements.path} element={<Complements />} />
          <Route path={NAVIGATION_ROUTES.Branches.path} element={<Branches />} />
          <Route path={NAVIGATION_ROUTES.Users.path} element={<Users />} />
          <Route path={"logout"} element={<Logout />} />
        </Route>
        <Route element={<UnauthenticatedLayout />}>
          <Route path={AUTH_NAVIGATION_ROUTES.Loin.path} element={<Login />} />
          <Route path={AUTH_NAVIGATION_ROUTES.Register.path} element={<Register />} />
          <Route path={AUTH_NAVIGATION_ROUTES.ForgetPassword.path} element={<ForgetPassword />} />
        </Route>
      </>
    )
  )
  return <RouterProvider router={router} />
}

export default App
