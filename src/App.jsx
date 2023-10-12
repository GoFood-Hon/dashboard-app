import React, { Suspense } from "react"
import Login from "./screens/auth/Login"
import { RouterProvider } from "react-router-dom"
import Register from "./screens/auth/Register"
import Home from "./screens/Home"
import ForgetPassword from "./screens/auth/ForgetPassword"

function App() {
  return <Login />
}

export default App
