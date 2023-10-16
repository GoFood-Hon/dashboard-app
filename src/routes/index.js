import { lazy } from "react"

export const NAVIGATION_ROUTES = {
  Dashboard: {
    label: "Dashboard",
    path: "/",
    icon: "dashboard"
  },
  Orders: {
    label: "Pedidos",
    path: "/orders",
    icon: "shoppingCart"
  },
  Transactions: {
    label: "Transacciones",
    path: "/transactions",
    icon: "invoice"
  },
  Menu: {
    label: "Menus",
    path: "/menu",
    icon: "menu"
  },
  Complements: {
    label: "Complementos",
    path: "/complements",
    icon: "layout"
  },
  Branches: {
    label: "Sucursales",
    path: "/branches",
    icon: "branch"
  },
  Users: {
    label: "Usuarios",
    path: "/users",
    icon: "users"
  }
}

export const AUTH_NAVIGATION_ROUTES = {
  Loin: {
    label: "Login",
    path: "/login"
  },
  Register: {
    label: "Register",
    path: "/register"
  },
  ForgetPassword: {
    label: "Forget Password",
    path: "/forgetPassword"
  }
}
