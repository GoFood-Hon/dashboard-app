import * as React from "react"
import * as ReactDOM from "react-dom/client"
import { createBrowserRouter, RouterProvider } from "react-router-dom"
import "./index.css"
import Home from "./screens/Home.jsx"
import Login from "./screens/auth/Login.jsx"
import Register from "./screens/auth/Register.jsx"
import ForgetPassword from "./screens/auth/ForgetPassword"
import { ThemeProvider } from "./context/ThemeProvider"

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />
  },
  {
    path: "/login",
    element: <Login />
  },
  {
    path: "/register",
    element: <Register />
  },
  {
    path: "/forgetPassword",
    element: <ForgetPassword />
  }
])

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ThemeProvider>
      <RouterProvider router={router} />
    </ThemeProvider>
  </React.StrictMode>
)
