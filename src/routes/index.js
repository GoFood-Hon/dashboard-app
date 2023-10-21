export const NAVIGATION_ROUTES = {
  Dashboard: {
    label: "Inicio",
    path: "/",
    icon: "dashboard"
  },
  Orders: {
    label: "Pedidos",
    path: "/orders",
    icon: "shoppingCart"
  },
  Menu: {
    label: "Menú",
    icon: "menu",
    path: "/menu",
    submenu: {
      Platillos: {
        label: "Platillos",
        icon: "menu",
        path: "/menu/dishes"
      },
      Complements: {
        label: "Complementos",
        icon: "menu",
        path: "/menu/complements"
      },
      Combos: {
        label: "Combos",
        icon: "menu",
        path: "/menu/combos"
      }
    }
  },
  Transactions: {
    label: "Transacciones",
    path: "/transactions",
    icon: "invoice"
  },
  /*  Complements: {
    label: "Complementos",
    path: "/complements",
    icon: "layout"
  }, */
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
