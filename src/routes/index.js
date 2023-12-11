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
    NewUser: {
      path: "/usuarios/nuevoUsuario"
    },
    submenu: {
      Admins: {
        label: "Admins",
        path: "/usuarios/administradores"
      },
      Settings: {
        label: "Configuraciones",
        path: "/usuarios/configuraciones"
      }
    }
  }
}

export const SETTING_NAVIGATION_ROUTES = {
  General: {
    type: "button",
    label: "General",
    path: "/usuario/configuraciones/general",
    icon: "configuration"
  },
  Profile: {
    label: "Perfil"
  },
  Cuenta: {
    type: "button",
    label: "Cuenta",
    path: "/usuario/configuraciones/cuenta",
    icon: "user"
  },
  Password: {
    type: "button",
    label: "Contraseña",
    path: "/usuario/configuraciones/contraseña",
    icon: "password"
  },
  Business: {
    label: "Negocio"
  },
  Business_btn: {
    type: "button",
    label: "Negocios",
    path: "/usuario/configuraciones/negocios",
    icon: "building"
  },
  Coupons: {
    type: "button",
    label: "Cupones",
    path: "/usuario/configuraciones/cupones",
    icon: "label"
  },
  Personal: {
    type: "button",
    label: "Personal",
    path: "/usuario/configuraciones/personal",
    icon: "users"
  },
  Branches: {
    type: "button",
    label: "Sucursales",
    path: "/usuario/configuraciones/sucursales",
    icon: "warehouse"
  },
  Kitchen: {
    type: "button",
    label: "Cocina",
    path: "/usuario/configuraciones/cocina",
    icon: "chefHat"
  },
  Billing: {
    label: "Facturación"
  },
  Bank: {
    type: "button",
    label: "Bancos",
    path: "/usuario/configuraciones/bancos",
    icon: "bank"
  },
  Plan: {
    type: "button",
    label: "Plan",
    path: "/usuario/configuraciones/plan",
    icon: "creditCard"
  },
  More: {
    label: "Mas"
  },
  Administrative: {
    type: "button",
    label: "Administrable",
    path: "/usuario/configuraciones/administrable",
    icon: "vrDesign"
  },
  Notification: {
    type: "button",
    label: "Notificaciones",
    path: "/usuario/configuraciones/notificaciones",
    icon: "bell"
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
