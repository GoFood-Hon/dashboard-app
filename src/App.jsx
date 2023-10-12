import React, { useContext } from "react"
import { Route, RouterProvider, createBrowserRouter, createRoutesFromElements } from "react-router-dom"

import AuthLayout from "./layout/AuthLayout"
import { AuthContext } from "./context/AuthProvider"
import Admin from "./screens/Admin"
import Home from "./screens/Home"
import Login from "./screens/auth/Login"
import UnauthenticatedLayout from "./layout/UnauthenticatedLayout"
import Register from "./screens/auth/Register"
import ForgetPassword from "./screens/auth/ForgetPassword"

function App() {
  const { user } = useContext(AuthContext)

  const router = createBrowserRouter(
    createRoutesFromElements(
      <>
        <Route element={<AuthLayout authenticated={user} />}>
          <Route path="/" element={<Home />} />
          <Route path="/admin" element={<Admin />} />
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
