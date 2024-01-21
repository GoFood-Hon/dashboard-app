export const NAVIGATION_ROUTES = {
  Dashboard: {
    label: "Inicio",
    path: "/",
    icon: "dashboard"
  },
  Pedidos: {
    label: "Pedidos",
    path: "/pedidos",
    icon: "shoppingCart",
    OrderDetails: {
      label: "Detalles del pedido",
      path: "/pedidos/:pedidoId"
    }
  },
  Menu: {
    label: "Menú",
    icon: "menu",
    path: "/menu",
    MenuDetails: {
      label: "Detalles del menu",
      path: "/menu/:menuId"
    },
    NewMenu: {
      path: "/menu/nuevoMenu"
    },
    submenu: {
      Dishes: {
        label: "Platillos",
        icon: "menu",
        path: "/menu/platillos",
        DishDetails: {
          label: "Detalles del platillo",
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
        path: "/menu/complementos",
        ComplementDetails: {
          label: "Detalles del complemento",
          path: "/menu/complementos/:complementId"
        },
        submenu: {
          NewComplement: {
            path: "/menu/complementos/nuevoComplemento"
          }
        }
      }
    }
  },
  Transactions: {
    label: "Transacciones",
    path: "/transacciones",
    icon: "invoice"
  },

  Branches: {
    label: "Sucursales",
    path: "/sucursales",
    icon: "branch",
    NewBranch: {
      path: "/sucursales/nuevaSucursal"
    },
    BranchDetail: {
      path: "/sucursales/:branchId"
    }
  },
  Users: {
    label: "Usuarios",
    path: "/usuarios",
    icon: "users",
    UserDetails: {
      label: "Detalles de usuario",
      path: "/usuarios/:usuarioId"
    },
    NewUser: {
      path: "/usuarios/nuevoUsuario"
    },
    submenu: {
      Settings: {
        label: "Configuraciones",
        path: "/usuarios/configuraciones/"
      }
    }
  }
}

export const NAVIGATION_ROUTES_SUPER_ADMIN = {
  Dashboard: {
    label: "Inicio",
    path: "/",
    icon: "dashboard"
  },
  Restaurants: {
    label: "Restaurantes",
    path: "/restaurantes",
    icon: "branch"
  },
  Transactions: {
    label: "Transacciones",
    path: "/transacciones",
    icon: "invoice"
  }
}

export const SETTING_NAVIGATION_ROUTES = {
  General: {
    type: "button",
    label: "General",
    path: "/usuarios/configuraciones/general",
    icon: "configuration"
  },
  Profile: {
    label: "Perfil"
  },
  Cuenta: {
    type: "button",
    label: "Cuenta",
    path: "/usuarios/configuraciones/cuenta",
    icon: "user"
  },
  Password: {
    type: "button",
    label: "Contraseña",
    path: "/usuarios/configuraciones/contraseña",
    icon: "password"
  },
  Business: {
    label: "Negocio"
  },
  Business_btn: {
    type: "button",
    label: "Negocios",
    path: "/usuarios/configuraciones/negocios",
    icon: "building"
  },
  Coupons: {
    type: "button",
    label: "Cupones",
    path: "/usuarios/configuraciones/cupones",
    icon: "label"
  },

  Billing: {
    label: "Facturación"
  },
  Bank: {
    type: "button",
    label: "Bancos",
    path: "/usuarios/configuraciones/bancos",
    icon: "bank"
  },
  Plan: {
    type: "button",
    label: "Plan",
    path: "/usuarios/configuraciones/plan",
    icon: "creditCard"
  }
  /*
  More: {
    label: "Mas"
  }
   Administrative: {
    type: "button",
    label: "Administrable",
    path: "/usuarios/configuraciones/administrable",
    icon: "vrDesign"
  }
   Notification: {
    type: "button",
    label: "Notificaciones",
    path: "/usuarios/configuraciones/notificaciones",
    icon: "bell"
  } */
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
