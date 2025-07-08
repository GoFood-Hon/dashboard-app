import { IconListDetails } from "@tabler/icons-react"
import { IconCalendarDue } from "@tabler/icons-react"
import { IconStar } from "@tabler/icons-react"
import { IconHistory } from "@tabler/icons-react"
import { IconAward } from "@tabler/icons-react"
import { IconAdjustments } from "@tabler/icons-react"
import {
  IconBox,
  IconHome,
  IconToolsKitchen,
  IconBuildingStore,
  IconUsers,
  IconSettings,
  IconCreditCard
} from "@tabler/icons-react"

export const NAVIGATION_ROUTES_SUPER_ADMIN = {
  Dashboard: {
    label: "Inicio",
    path: "/",
    icon: "dashboard"
  },

  Restaurants: {
    label: "Comercios",
    path: "/comercios",
    icon: "branch",
    NewRestaurant: {
      path: "/comercios/nuevoComercio"
    },
    RestaurantDetails: {
      path: "/comercios/:restaurantId"
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
  },
  Account: {
    label: "Cuenta",
    icon: "users",
    path: "/miCuenta"
  },
  KitchenTypesAndTags: {
    path: "/tipos-establecimientos-categorias"
  },
  Collections: {
    path: "/lista-de-colecciones",
    NewCollection: {
      path: "/lista-de-colecciones/nueva-coleccion"
    },
    EditCollection: {
      path: "/lista-de-colecciones/:collectionId"
    }
  },
  Loyalty: {
    path: "/programas-de-lealtad",
    EditLoyalty: {
      path: "/programas-de-lealtad/:loyaltyId"
    }
  }
}

export const NAVIGATION_ROUTES_SUPER_ADMIN_TWO = [
  { label: "Inicio", icon: IconHome, link: "/" },
  {
    label: "Comercios",
    icon: IconBuildingStore,
    initiallyOpened: false,
    links: [
      {
        label: "Lista de comercios",
        link: "/comercios"
      },
      {
        label: "Tipos de establecimientos y categorías",
        link: "/tipos-establecimientos-categorias"
      }
    ]
  },
  { label: "Colecciones", icon: IconListDetails, link: "/lista-de-colecciones" },
  { label: "Administradores", icon: IconUsers, link: "/administradores" },
  { label: "Programas de lealtad", icon: IconAward, link: "/programas-de-lealtad" },
  { label: "Planes", icon: IconCreditCard, link: "/planes" },
  { label: "Cuenta", icon: IconSettings, link: "/miCuenta" }
]

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
    },
    OrderPurchasesHistory: {
      label: "Historial de compras del pedido",
      path: "/pedidos/historial-compras"
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
        label: "Productos",
        icon: "menu",
        path: "/menu/productos",
        DishDetails: {
          label: "Detalles del producto",
          path: "/menu/productos/:dishId"
        },
        NewDish: {
          path: "/menu/productos/nuevoProducto"
        }
      }
    }
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
  Reservations: {
    path: "/lista-de-reservaciones",
    ReservationDetails: {
      path: "/lista-de-reservaciones/:reservationId"
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
  },
  Loyalty: {
    path: "/programas-de-lealtad",
    RewardsTracking: {
      path: "/seguimiento-de-recompensas"
    },
    EditLoyalty: {
      path: "/lista-de-colecciones/:collectionId"
    }
  },
  Reviews: {
    label: "Reseñas",
    path: "/reseñas",
    icon: "star"
  }
}

export const NAVIGATION_ROUTES_RES_ADMIN_TWO = [
  { label: "Inicio", icon: IconHome, link: "/" },
  {
    label: "Pedidos",
    icon: IconBox,
    initiallyOpened: false,
    links: [
      {
        label: "Lista de pedidos",
        link: "/pedidos"
      },
      {
        label: "Historial de compras",
        link: "/pedidos/historial-compras"
      }
    ]
  },
  {
    label: "Menú",
    icon: IconToolsKitchen,
    initiallyOpened: false,
    links: [
      {
        label: "Lista de menús",
        link: "/menu"
      },
      {
        label: "Productos",
        link: "/menu/productos"
      }
    ]
  },
  { label: "Reservaciones", icon: IconCalendarDue, link: "/lista-de-reservaciones" },
  {
    label: "Programa de lealtad",
    icon: IconAward,
    initiallyOpened: false,
    links: [
      {
        label: "Datos del programa",
        link: "/programas-de-lealtad"
      },
      {
        label: "Seguimiento de recompensas",
        link: "/seguimiento-de-recompensas"
      }
    ]
  },
  { label: "Sucursales", icon: IconBuildingStore, link: "/sucursales" },
  { label: "Reseñas", icon: IconStar, link: "/reseñas" },
  { label: "Usuarios", icon: IconUsers, link: "/usuarios" },
  {
    label: "Configuraciones",
    icon: IconSettings,
    initiallyOpened: false,
    links: [
      {
        label: "Datos del comercio",
        link: "/configuraciones/general"
      },
      {
        label: "Cuenta",
        link: "/configuraciones/cuenta"
      }
    ]
  },
  {
    label: "General",
    icon: IconAdjustments,
    initiallyOpened: false,
    links: [
      {
        label: "Promociones",
        link: "/configuraciones/lista-de-promociones"
      },
      {
        label: "Cupones",
        link: "/configuraciones/lista-de-cupones"
      },
      // {
      //   label: "Bancos",
      //   link: "/configuraciones/bancos"
      // },
      {
        label: "Administrar plan",
        link: "/configuraciones/plan"
      }
    ]
  }
]

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
    },
    OrderPurchasesHistory: {
      label: "Historial de compras del pedido",
      path: "/pedidos/historial-compras"
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
    label: "Productos",
    icon: "chefHat",
    path: "menu/productos",
    DishDetails: {
      label: "Detalles del producto",
      path: "menu/productos/:dishId"
    }
  },
  Reservations: {
    path: "/lista-de-reservaciones",
    ReservationDetails: {
      path: "/lista-de-reservaciones/:reservationId"
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
  },
  Reviews: {
    label: "Reseñas",
    icon: "star",
    path: "/reseñas"
  }
}

export const NAVIGATION_ROUTES_BRANCH_ADMIN_TWO = [
  { label: "Inicio", icon: IconHome, link: "/" },
  {
    label: "Pedidos",
    icon: IconBox,
    initiallyOpened: false,
    links: [
      {
        label: "Lista de pedidos",
        link: "/pedidos"
      },
      {
        label: "Historial de compras",
        link: "/pedidos/historial-compras"
      }
    ]
  },
  {
    label: "Menú",
    icon: IconToolsKitchen,
    initiallyOpened: false,
    links: [
      {
        label: "Lista de menús",
        link: "/menu"
      },
      {
        label: "Productos",
        link: "/menu/productos"
      }
    ]
  },
  { label: "Reservaciones", icon: IconCalendarDue, link: "/lista-de-reservaciones" },
  { label: "Reseñas", icon: IconStar, link: "/reseñas" },
  {
    label: "Cuenta",
    icon: IconSettings,
    link: "/miCuenta"
  }
]

export const NAVIGATION_ROUTES_CASHIER = {
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
    label: "Productos",
    icon: "chefHat",
    path: "menu/productos",
    DishDetails: {
      label: "Detalles del producto",
      path: "menu/productos/:dishId"
    }
  },
  Account: {
    label: "Cuenta",
    icon: "users",
    path: "/miCuenta"
  }
}

export const NAVIGATION_ROUTES_CASHIER_TWO = [
  { label: "Inicio", icon: IconHome, link: "/" },
  { label: "Pedidos", icon: IconBox, link: "/pedidos" },
  {
    label: "Menús",
    icon: IconToolsKitchen,
    initiallyOpened: false,
    links: [
      {
        label: "Lista de menús",
        link: "/menu"
      },
      {
        label: "Productos",
        link: "/menu/productos"
      }
    ]
  },
  {
    label: "Cuenta",
    icon: IconSettings,
    link: "/miCuenta"
  }
]

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

export const NAVIGATION_ROUTES_KITCHEN_TWO = [
  { label: "Inicio", icon: IconHome, link: "/" },
  { label: "Pedidos activos", icon: IconBox, link: "/pedidos" },
  { label: "Historial de pedidos", icon: IconHistory, link: "/historialDelPedido" },
  { label: "Cuenta", icon: IconSettings, link: "/miCuenta" }
]

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
    path: "/configuraciones/lista-de-promociones",
    icon: "label",
    newPromotion: {
      label: "Nueva Promoción",
      path: "/configuraciones/lista-de-promociones/nueva-promocion"
    },
    editPromotion: {
      label: "Editar Promoción",
      path: "/configuraciones/lista-de-promociones/:promotionId"
    }
  },
  Coupons: {
    type: "button",
    label: "Cupones",
    path: "/configuraciones/lista-de-cupones",
    icon: "label",
    newCoupon: {
      label: "Nuevo cupón",
      path: "/configuraciones/lista-de-cupones/nuevo-cupon"
    },
    editCoupon: {
      label: "Editar cupón",
      path: "/configuraciones/lista-de-cupones/:couponId"
    }
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
