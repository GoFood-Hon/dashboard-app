import * as React from "react"
import * as ReactDOM from "react-dom/client"
import { createBrowserRouter, RouterProvider } from "react-router-dom"
import "./index.css"
import Home from "./screens/Home.jsx"
import Login from "./screens/auth/Login.jsx"
import Register from "./screens/auth/Register.jsx"
import ForgetPassword from "./screens/auth/ForgetPassword"
import { ThemeProvider } from "./context/ThemeProvider"
import LoadingCircle from "./components/LoadingCircle"

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
    <React.Suspense fallback={LoadingCircle}>
      <ThemeProvider>
        <RouterProvider router={router} />
      </ThemeProvider>
    </React.Suspense>
  </React.StrictMode>
)
