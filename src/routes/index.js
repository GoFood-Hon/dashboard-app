export const NAVIGATION_ROUTES = {
  Dashboard: {
    label: "Inicio",
    path: "/",
    icon: "dashboard"
  },
  Pedidos: {
    label: "Pedidos",
    path: "/pedidos",
    icon: "shoppingCart"
  },
  Menu: {
    label: "Menú",
    icon: "menu",
    path: "/menu",
    submenu: {
      Dishes: {
        label: "Platillos",
        icon: "menu",
        path: "/menu/platillos",
        DishDetails: {
          label: "Detalles del Platillo",
          path: "/menu/platillos/:dishId"
        },
        submenu: {
          NewDish: {
            path: "/menu/platillos/nuevoPlatillo"
          }
        }
      },
      Complements: {
        label: "Complementos",
        icon: "menu",
        path: "/menu/complementos"
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
    path: "/transacciones",
    icon: "invoice"
  },
  /*  Complements: {
    label: "Complementos",
    path: "/complements",
    icon: "layout"
  }, */
  Branches: {
    label: "Sucursales",
    path: "/sucursales",
    icon: "branch"
  },
  Users: {
    label: "Usuarios",
    path: "/usuarios",
    icon: "users",
    submenu: {
      Admins: {
        label: "Admins",
        icon: "users",
        path: "/usuarios/administradores"
      }
    }
  }
}

export const AUTH_NAVIGATION_ROUTES = {
  Login: {
    label: "Login",
    path: "/iniciarSesión"
  },
  Register: {
    label: "Register",
    path: "/Registrarse"
  },
  ForgetPassword: {
    label: "Forget Password",
    path: "/olvideMiContraseña"
  },
  Logout: {
    label: "Logout",
    path: "/CerrarSesión"
  }
}
