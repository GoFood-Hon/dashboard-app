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
    path: "/shops",
    icon: "branch",
    NewRestaurant: {
      path: "/shops/new-shop"
    },
    RestaurantDetails: {
      path: "/shops/:restaurantId"
    }
  },

  Users: {
    label: "Administradores",
    path: "/administrators",
    icon: "users",
    NewUser: {
      path: "/administrators/new-admin"
    },
    UserDetails: {
      path: "/administrators/:adminId"
    }
  },

  Plans: {
    label: "Planes",
    path: "/plans",
    icon: "creditCard",
    NewPlan: {
      label: "Nuevo Plan",
      path: "/plans/new-plan"
    },
    PlanDetails: {
      label: "Detalles del Plan",
      path: "/plans/:planId"
    }
  },
  Account: {
    label: "Cuenta",
    icon: "users",
    path: "/my-account"
  },
  KitchenTypesAndTags: {
    path: "/shop-types-and-categories"
  },
  Collections: {
    path: "/collections",
    NewCollection: {
      path: "/collections/new-collection"
    },
    EditCollection: {
      path: "/collections/:collectionId"
    }
  },
  Loyalty: {
    path: "/loyalty-programs",
    EditLoyalty: {
      path: "/loyalty-programs/:loyaltyId"
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
        link: "/shops"
      },
      {
        label: "Tipos de establecimientos y categorías",
        link: "/shop-types-and-categories"
      }
    ]
  },
  { label: "Colecciones", icon: IconListDetails, link: "/collections" },
  { label: "Administradores", icon: IconUsers, link: "/administrators" },
  { label: "Programas de lealtad", icon: IconAward, link: "/loyalty-programs" },
  { label: "Planes", icon: IconCreditCard, link: "/plans" },
  { label: "Cuenta", icon: IconSettings, link: "/my-account" }
]

export const NAVIGATION_ROUTES_RES_ADMIN = {
  Dashboard: {
    label: "Inicio",
    path: "/",
    icon: "dashboard"
  },
  Pedidos: {
    label: "Pedidos",
    path: "/orders",
    icon: "shoppingCart",
    OrderDetails: {
      label: "Detalles del pedido",
      path: "/orders/:orderId"
    },
    OrderPurchasesHistory: {
      label: "Historial de compras del pedido",
      path: "/orders/purchase-history"
    }
  },
  Menu: {
    label: "Menú",
    icon: "menu",
    path: "/menus",
    MenuDetails: {
      label: "Detalles del menu",
      path: "/menus/:menuId"
    },
    NewMenu: {
      path: "/menus/new-menu"
    },
    submenu: {
      Dishes: {
        label: "Productos",
        icon: "menu",
        path: "/menus/products",
        DishDetails: {
          label: "Detalles del producto",
          path: "/menus/products/:dishId"
        },
        NewDish: {
          path: "/menus/products/new-product"
        }
      }
    }
  },
  Branches: {
    label: "Sucursales",
    path: "/branches",
    icon: "branch",
    NewBranch: {
      path: "/branches/new-branch"
    },
    BranchDetail: {
      path: "/branches/:branchId"
    }
  },
  Reservations: {
    path: "/reservations",
    ReservationDetails: {
      path: "/reservations/:reservationId"
    }
  },
  Users: {
    label: "Usuarios",
    path: "/users",
    icon: "users",
    UserDetails: {
      label: "Detalles de usuario",
      path: "/users/:userId"
    },
    NewUser: {
      path: "/users/new-user"
    }
  },
  Settings: {
    label: "Configuraciones",
    icon: "setting",
    path: "/settings/"
  },
  Loyalty: {
    path: "/loyalty-program",
    RewardsTracking: {
      path: "/rewards-tracking"
    },
    EditLoyalty: {
      path: "/collections/:collectionId"
    }
  },
  Reviews: {
    label: "Reseñas",
    path: "/reviews",
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
        link: "/orders"
      },
      {
        label: "Historial de compras",
        link: "/orders/purchase-history"
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
        link: "/menus"
      },
      {
        label: "Productos",
        link: "/menus/products"
      }
    ]
  },
  { label: "Reservaciones", icon: IconCalendarDue, link: "/reservations" },
  {
    label: "Programa de lealtad",
    icon: IconAward,
    initiallyOpened: false,
    links: [
      {
        label: "Datos del programa",
        link: "/loyalty-program"
      },
      {
        label: "Seguimiento de recompensas",
        link: "/rewards-tracking"
      }
    ]
  },
  { label: "Sucursales", icon: IconBuildingStore, link: "/branches" },
  { label: "Reseñas", icon: IconStar, link: "/reviews" },
  { label: "Usuarios", icon: IconUsers, link: "/users" },
  {
    label: "Configuraciones",
    icon: IconSettings,
    initiallyOpened: false,
    links: [
      {
        label: "Datos del comercio",
        link: "/settings/shop-information"
      },
      {
        label: "Cuenta",
        link: "/settings/my-account"
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
        link: "/settings/promotions"
      },
      {
        label: "Cupones",
        link: "/settings/coupons"
      },
      // {
      //   label: "Bancos",
      //   link: "/settings/bancos"
      // },
      {
        label: "Administrar plan",
        link: "/settings/plan-administration"
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
    path: "/orders",
    icon: "shoppingCart",
    OrderDetails: {
      label: "Detalles del pedido",
      path: "/orders/:orderId"
    },
    OrderPurchasesHistory: {
      label: "Historial de compras del pedido",
      path: "/orders/purchase-history"
    }
  },
  Menu: {
    label: "Menú",
    icon: "menu",
    path: "/menus",
    MenuDetails: {
      label: "Detalles del menu",
      path: "/menus/:menuId"
    },
    NewMenu: {
      path: "/menus/new-menu"
    }
  },
  Dishes: {
    label: "Productos",
    icon: "chefHat",
    path: "menus/products",
    DishDetails: {
      label: "Detalles del producto",
      path: "menus/products/:dishId"
    }
  },
  Reservations: {
    path: "/reservations",
    ReservationDetails: {
      path: "/reservations/:reservationId"
    }
  },
  Complements: {
    label: "Complementos",
    icon: "menu",
    path: "/menus/complementos",
    ComplementDetails: {
      label: "Detalles del complemento",
      path: "/menus/complementos/:complementId"
    },
    NewComplement: {
      path: "/menus/complementos/nuevoComplemento"
    }
  },
  Account: {
    label: "Cuenta",
    icon: "users",
    path: "/my-account"
  },
  Password: {
    label: "Contraseña",
    icon: "eye",
    path: "/contraseña"
  },
  Reviews: {
    label: "Reseñas",
    icon: "star",
    path: "/reviews"
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
        link: "/orders"
      },
      {
        label: "Historial de compras",
        link: "/orders/purchase-history"
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
        link: "/menus"
      },
      {
        label: "Productos",
        link: "/menus/products"
      }
    ]
  },
  { label: "Reservaciones", icon: IconCalendarDue, link: "/reservations" },
  { label: "Reseñas", icon: IconStar, link: "/reviews" },
  {
    label: "Cuenta",
    icon: IconSettings,
    link: "/my-account"
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
    path: "/orders",
    icon: "shoppingCart",
    OrderDetails: {
      label: "Detalles del pedido",
      path: "/orders/:orderId"
    }
  },
  Menu: {
    label: "Menú",
    icon: "menu",
    path: "/menus",
    MenuDetails: {
      label: "Detalles del menu",
      path: "/menus/:menuId"
    },
    NewMenu: {
      path: "/menus/new-menu"
    }
  },
  Dishes: {
    label: "Productos",
    icon: "chefHat",
    path: "menus/products",
    DishDetails: {
      label: "Detalles del producto",
      path: "menus/products/:dishId"
    }
  },
  Account: {
    label: "Cuenta",
    icon: "users",
    path: "/my-account"
  }
}

export const NAVIGATION_ROUTES_CASHIER_TWO = [
  { label: "Inicio", icon: IconHome, link: "/" },
  { label: "Pedidos", icon: IconBox, link: "/orders" },
  {
    label: "Menús",
    icon: IconToolsKitchen,
    initiallyOpened: false,
    links: [
      {
        label: "Lista de menús",
        link: "/menus"
      },
      {
        label: "Productos",
        link: "/menus/products"
      }
    ]
  },
  {
    label: "Cuenta",
    icon: IconSettings,
    link: "/my-account"
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
    path: "/active-orders",
    icon: "shoppingCart",
    OrderDetails: {
      label: "Detalles del pedido",
      path: "/orders-history/:orderId"
    }
  },
  OrderHistory: {
    label: "Historial",
    path: "/orders-history",
    icon: "invoice",
    OrderHistoryDetails: {
      label: "Detalles del historial del pedido",
      path: "/orders-history/:orderId"
    }
  },
  Account: {
    label: "Cuenta",
    icon: "users",
    path: "/my-account"
  },
  Password: {
    label: "Contraseña",
    icon: "eye",
    path: "/contraseña"
  }
}

export const NAVIGATION_ROUTES_KITCHEN_TWO = [
  { label: "Inicio", icon: IconHome, link: "/" },
  { label: "Pedidos activos", icon: IconBox, link: "/active-orders" },
  { label: "Historial de pedidos", icon: IconHistory, link: "/orders-history" },
  { label: "Cuenta", icon: IconSettings, link: "/my-account" }
]

export const SETTING_NAVIGATION_ROUTES = {
  General: {
    type: "button",
    label: "General",
    path: "/settings/shop-information",
    icon: "configuration"
  },
  Profile: {
    label: "Perfil"
  },
  Cuenta: {
    type: "button",
    label: "Cuenta",
    path: "/settings/my-account",
    icon: "user"
  },
  Password: {
    type: "button",
    label: "Contraseña",
    path: "/settings/contraseña",
    icon: "password"
  },
  Business: {
    label: "Negocio"
  },
  Business_btn: {
    type: "button",
    label: "Negocios",
    path: "/settings/negocios",
    icon: "building"
  },
  Promotions: {
    type: "button",
    label: "Promociones",
    path: "/settings/promotions",
    icon: "label",
    newPromotion: {
      label: "Nueva Promoción",
      path: "/settings/promotions/new-promotion"
    },
    editPromotion: {
      label: "Editar Promoción",
      path: "/settings/promotions/:promotionId"
    }
  },
  Coupons: {
    type: "button",
    label: "Cupones",
    path: "/settings/coupons",
    icon: "label",
    newCoupon: {
      label: "Nuevo cupón",
      path: "/settings/coupons/new-coupon"
    },
    editCoupon: {
      label: "Editar cupón",
      path: "/settings/coupons/:couponId"
    }
  },

  Billing: {
    label: "Facturación"
  },
  Bank: {
    type: "button",
    label: "Bancos",
    path: "/settings/bancos",
    icon: "bank"
  },
  Plan: {
    type: "button",
    label: "Plan",
    path: "/settings/plan-administration",
    icon: "creditCard"
  },

  More: {
    label: "Mas"
  },
  Administrative: {
    type: "button",
    label: "Administrable",
    path: "/settings/administrable",
    icon: "vrDesign"
  }
}

export const AUTH_NAVIGATION_ROUTES = {
  Login: {
    label: "Login",
    path: "/sign-in"
  },
  Register: {
    label: "Register",
    path: "/register"
  },
  ForgetPassword: {
    label: "Forget Password",
    path: "/forgot-password"
  },
  Logout: {
    label: "Logout",
    path: "/sign-out"
  }
}
