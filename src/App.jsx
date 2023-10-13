import React, { useContext } from "react"
import { Route, RouterProvider, createBrowserRouter, createRoutesFromElements } from "react-router-dom"

import AuthLayout from "./layout/AuthLayout"
import { AuthContext } from "./context/AuthProvider"

import Home from "./screens/Home"
import Login from "./screens/auth/Login"
import UnauthenticatedLayout from "./layout/UnauthenticatedLayout"
import Register from "./screens/auth/Register"
import ForgetPassword from "./screens/auth/ForgetPassword"
import Orders from "./screens/Orders"
import Transactions from "./screens/Transactions"
import Menu from "./screens/Menu"
import Complements from "./screens/Complements"
import Branches from "./screens/Branches"
import Users from "./screens/Users"

function App() {
  const { user } = useContext(AuthContext)

  const router = createBrowserRouter(
    createRoutesFromElements(
      <>
        <Route element={<AuthLayout authenticated={user} />}>
          <Route path="/" element={<Home />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/transactions" element={<Transactions />} />
          <Route path="/menu" element={<Menu />} />
          <Route path="/complements" element={<Complements />} />
          <Route path="/branches" element={<Branches />} />
          <Route path="/users" element={<Users />} />
        </Route>
        <Route element={<UnauthenticatedLayout />}>
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
          <Route path="forgetPassword" element={<ForgetPassword />} />
        </Route>
      </>
    )
  )
  return <RouterProvider router={router} />
}

export default App
