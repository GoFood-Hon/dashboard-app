export const APP_ROLES = {
  superAdmin: "superadmin",
  restaurantAdmin: "admin-restaurant",
  branchAdmin: "admin-sucursal"
}

export const welcomeCards = [
  {
    title: "Ver mis pedidos",
    description: "Lista de pedidos actuales",
    link: "/pedidos"
  },
  {
    title: "Ver mi menú",
    description: "Visualiza y gestiona tu menú",
    link: "/menu"
  },
  {
    title: "Ver platillos",
    description: "Explora y gestiona tus platillos",
    link: "/platillos"
  },
  {
    title: "Ver mi Cuenta",
    description: "Consulta y administra tu cuenta",
    link: "/miCuenta"
  },
  {
    title: "Actualizar contraseña",
    description: "Crea o actualiza tu contraseña",
    link: "/contraseña"
  },
  {
    title: "Ver Notificaciones",
    description: "Ver las ultimas actualizaciones",
    link: "/"
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
    value: "kitchen",
    label: "Cocina"
  },
  {
    value: "cashier",
    label: "Cajero"
  },
  {
    value: "driver",
    label: "Motorista"
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

export const mapBoxStyles = "mapbox://styles/onetouchstudio/clopr8g1x00il01nz2nw7045t"

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
    label: "5 - 9 minutos"
  },
  {
    value: "10-19",
    label: "10 - 19 minutos"
  },
  {
    value: "20-29",
    label: "20 - 29 minutos"
  },
  {
    value: "+30",
    label: "+30 minutos"
  }
]
