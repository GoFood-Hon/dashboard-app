import { IconClockHour3 } from "@tabler/icons-react"
import { NAVIGATION_ROUTES_BRANCH_ADMIN, NAVIGATION_ROUTES_KITCHEN } from "../routes"
import { IconToolsKitchen } from "@tabler/icons-react"
import { IconUserPlus } from "@tabler/icons-react"
import { IconHomeCheck } from "@tabler/icons-react"
import { createTheme } from "@mantine/core"
import { IconMotorbike } from "@tabler/icons-react"

export const DEFAULT_DISCOUNT_PERCENTAGE = "5%"
export const DEFAULT_COUPON_TYPE = "Por fecha"
export const DEFAULT_CATEGORY = "Porcentual"

export const DEFAULT_INITIAL_DATE = new Date()
export const DEFAULT_END_DATE = new Date()

export const DEFAULT_CURRENCY = "HNL"
export const DEFAULT_PAYMENT_TYPE = "Mensual"

export const orderDeliveryTypes = {
  delivery: "delivery",
  pickUp: "pickup",
  onSite: "on-site"
}
export const orderStatusValues = {
  pending: "pending",
  onHold: "on-hold",
  confirmed: "confirmed",
  ready: "ready",
  driverAssigned: "ready-to-pick-up",
  onDelivery: " on-delivery",
  delivered: "delivered",

  readyForCustomer: "ready-for-customer"
}

export const CouponTypes = {
  AMOUNT: "Por cantidad de usos",
  DATE: "Por fecha"
}

export const APP_ROLES = {
  superAdmin: "superadmin",
  restaurantAdmin: "admin-restaurant",
  branchAdmin: "admin-sucursal",
  kitchenUser: "kitchen",
  cashierUser: "cashier"
}

export const branchWelcomeCards = [
  {
    title: "Ver mis pedidos",
    description: "Lista de pedidos actuales",
    link: NAVIGATION_ROUTES_BRANCH_ADMIN.Pedidos.path
  },
  {
    title: "Ver mi menú",
    description: "Visualiza y gestiona tu menú",
    link: NAVIGATION_ROUTES_BRANCH_ADMIN.Menu.path
  },
  {
    title: "Ver platillos",
    description: "Explora y gestiona tus platillos",
    link: NAVIGATION_ROUTES_BRANCH_ADMIN.Dishes.path
  },
  {
    title: "Ver cuenta",
    description: "Consulta y administra tu cuenta",
    link: NAVIGATION_ROUTES_BRANCH_ADMIN.Account.path
  }
]

export const kitchenWelcomeCards = [
  {
    title: "Ver mis pedidos",
    description: "Lista de pedidos",
    link: NAVIGATION_ROUTES_KITCHEN.Orders.path
  },
  {
    title: "Ver el historial",
    description: "Historial de pedidos",
    link: NAVIGATION_ROUTES_KITCHEN.OrderHistory.path
  },
  {
    title: "Ver mi cuenta",
    description: "Ajustar configuraciones",
    link: NAVIGATION_ROUTES_KITCHEN.Account.path
  }
]

export const USER_ROLES = {
  kitchen: "kitchen",
  driver: "driver",
  cashier: "cashier",
  administrator: "administrator"
}

export const userTypes = [
  {
    value: "admin-sucursal",
    label: "Administrador de sucursal"
  },
  {
    value: "kitchen",
    label: "Cocinero"
  },
  {
    value: "cashier",
    label: "Cajero"
  },
  {
    value: "driver",
    label: "Repartidor"
  }
]

export const collectionTypes = [
  {
    value: "dishes",
    label: "Platillos"
  },
  {
    value: "restaurants",
    label: "Restaurantes"
  }
]

export const dashboardCards = [
  {
    icon: "money",
    amount: 3500212.0,
    label: "Ventas totales",
    percentage: 0.43
  },
  {
    icon: "money",
    amount: 500212.0,
    label: "Ingresos totales",
    percentage: 2.59
  },
  {
    icon: "bag",
    amount: 1000,
    label: "Pedidos totales",
    percentage: 4.43
  },
  {
    icon: "search",
    amount: 3456,
    label: "Búsqueda totales",
    percentage: -0.95
  }
]

export const mapBoxStyles = "mapbox://styles/ot-dev/clyxy5xuc012m01p99fld27px"

export const hondurasDepartments = [
  { id: 1, name: "Atlántida" },
  { id: 2, name: "Colón" },
  { id: 3, name: "Comayagua" },
  { id: 4, name: "Copán" },
  { id: 5, name: "Cortés" },
  { id: 6, name: "Choluteca" },
  { id: 7, name: "El Paraíso" },
  { id: 8, name: "Francisco Morazán" },
  { id: 9, name: "Gracias a Dios" },
  { id: 10, name: "Intibucá" },
  { id: 11, name: "Islas de la Bahía" },
  { id: 12, name: "La Paz" },
  { id: 13, name: "Lempira" },
  { id: 14, name: "Ocotepeque" },
  { id: 15, name: "Olancho" },
  { id: 16, name: "Santa Bárbara" },
  { id: 17, name: "Valle" },
  { id: 18, name: "Yoro" }
]

export const menuType = [
  {
    id: 1,
    name: "Normal"
  },
  {
    id: 2,
    name: "Familiar"
  }
]

export const preparationTime = [
  {
    value: "5-9",
    label: "De 5 a 9 minutos"
  },
  {
    value: "10-19",
    label: "De 10 a 19 minutos"
  },
  {
    value: "20-29",
    label: "De 20 a 29 minutos"
  },
  {
    value: "+30",
    label: "Más de 30 minutos"
  }
]

export const loyaltyCardsDiscountType = [
  {
    value: "porcentaje",
    label: "Descuento porcentual"
  },
  {
    value: "fijo",
    label: "Descuento fijo"
  }
]

export const promotionsDiscountType = [
  {
    value: "porcentual",
    label: "Descuento porcentual"
  },
  {
    value: "fijo",
    label: "Descuento fijo"
  }
]

export const discountAppliedTo = [
  {
    value: "all",
    label: "Todos los platillos"
  },
  {
    value: "some",
    label: "Platillos seleccionados"
  }
]

export const couponsTypes = [
  {
    value: "fecha",
    label: "Por fecha"
  },
  {
    value: "cantidad",
    label: "Por cantidad de usos"
  }
]

export const daysOfWeek = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"]

export const daysOfWeekEn = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"]

export const orderStates = {
  delivery: [
    { icon: IconClockHour3, value: "confirmed", label: "Confirmación", step: 1 },
    { icon: IconToolsKitchen, value: "ready", label: "Preparación", step: 2 },
    { icon: IconUserPlus, value: "ready-to-pick-up", label: "Asignar repartidor", step: 3 },
    { icon: IconMotorbike, value: "on-delivery", label: "En camino", step: 4 },
    { icon: IconHomeCheck, value: "delivered", label: "Entregado", step: 5 }
  ],
  pickup: [
    { icon: IconClockHour3, value: "confirmed", label: "Confirmación", step: 1, loading: true },
    { icon: IconToolsKitchen, value: "ready-for-customer", label: "Preparación", step: 2, loading: false },
    { icon: IconHomeCheck, value: "delivered", label: "Entregado", step: 3, loading: false }
  ],
  onSite: [
    { icon: IconClockHour3, value: "confirmed", label: "Confirmación", step: 1 },
    { icon: IconToolsKitchen, value: "ready-for-customer", label: "Preparación", step: 2 },
    { icon: IconHomeCheck, value: "delivered", label: "Entregado", step: 3 }
  ]
}

export const PRIMARY_COL_HEIGHT = "508px"
export const SECONDARY_COL_HEIGHT = `calc(${PRIMARY_COL_HEIGHT} / 2 - var(--mantine-spacing-xs) / 2)`

export const theme = createTheme({
  cursorType: "pointer"
})
