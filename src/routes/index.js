export const NAVIGATION_ROUTES_SUPER_ADMIN = {
  Dashboard: {
    label: "Inicio",
    path: "/",
    icon: "dashboard"
  },

  Restaurants: {
    label: "Restaurantes",
    path: "/restaurantes",
    icon: "branch",
    NewRestaurant: {
      path: "/restaurantes/nuevoRestaurante"
    },
    RestaurantDetails: {
      path: "/restaurantes/:restaurantId"
    }
  },

  Users: {
    label: "Administradores",
    path: "/administradores",
    icon: "users",
    NewUser: {
      path: "/administradores/nuevoAdministrador"
    },
    UserDetails: {
      path: "/administradores/:adminId"
    }
  },

  Plans: {
    label: "Planes",
    path: "/planes",
    icon: "creditCard",
    NewPlan: {
      label: "Nuevo Plan",
      path: "/planes/nuevoPlan"
    },
    PlanDetails: {
      label: "Detalles del Plan",
      path: "/planes/:planId"
    }
  }
}

export const NAVIGATION_ROUTES_RES_ADMIN = {
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
      path: "/pedidos/:orderId"
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
        NewDish: {
          path: "/menu/platillos/nuevoPlatillo"
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
        NewComplement: {
          path: "/menu/complementos/nuevoComplemento"
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
      path: "/usuarios/:userId"
    },
    NewUser: {
      path: "/usuarios/nuevoUsuario"
    }
  },
  Settings: {
    label: "Configuraciones",
    icon: "setting",
    path: "/configuraciones/"
  }
}

export const NAVIGATION_ROUTES_BRANCH_ADMIN = {
  Home: {
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
      path: "/pedidos/:orderId"
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
    }
  },
  Dishes: {
    label: "Platillos",
    icon: "chefHat",
    path: "/platillos",
    DishDetails: {
      label: "Detalles del platillo",
      path: "/platillos/:dishId"
    }
  },

  Account: {
    label: "Cuenta",
    icon: "users",
    path: "/miCuenta"
  },
  Password: {
    label: "Contraseña",
    icon: "eye",
    path: "/contraseña"
  }
}

export const NAVIGATION_ROUTES_KITCHEN = {
  Home: {
    label: "Inicio",
    path: "/",
    icon: "dashboard"
  },
  Orders: {
    label: "Pedidos",
    path: "/pedidos",
    icon: "shoppingCart",
    OrderDetails: {
      label: "Detalles del pedido",
      path: "/pedidos/:orderId"
    }
  },
  OrderHistory: {
    label: "Historial",
    path: "/historialDelPedido",
    icon: "invoice",
    OrderHistoryDetails: {
      label: "Detalles del historial del pedido",
      path: "/pedidos/:orderId"
    }
  }
}

export const SETTING_NAVIGATION_ROUTES = {
  General: {
    type: "button",
    label: "General",
    path: "/configuraciones/general",
    icon: "configuration"
  },
  Profile: {
    label: "Perfil"
  },
  Cuenta: {
    type: "button",
    label: "Cuenta",
    path: "/configuraciones/cuenta",
    icon: "user"
  },
  Password: {
    type: "button",
    label: "Contraseña",
    path: "/configuraciones/contraseña",
    icon: "password"
  },
  Business: {
    label: "Negocio"
  },
  Business_btn: {
    type: "button",
    label: "Negocios",
    path: "/configuraciones/negocios",
    icon: "building"
  },
  Promotions: {
    type: "button",
    label: "Promociones",
    path: "/configuraciones/promociones",
    icon: "label"
  },

  Billing: {
    label: "Facturación"
  },
  Bank: {
    type: "button",
    label: "Bancos",
    path: "/configuraciones/bancos",
    icon: "bank"
  },
  Plan: {
    type: "button",
    label: "Plan",
    path: "/configuraciones/plan",
    icon: "creditCard"
  },

  More: {
    label: "Mas"
  },
  Administrative: {
    type: "button",
    label: "Administrable",
    path: "/configuraciones/administrable",
    icon: "vrDesign"
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
