import React, { useEffect, useState } from "react"
import { Outlet, useLocation, useNavigate } from "react-router-dom"
import SideBar from "../components/SideBar"
import Header from "../components/Header"
import toast from "react-hot-toast"
import authUtils from "../utils/authUtils"
import LoadingCircle from "../components/LoadingCircle"
import { useDispatch, useSelector } from "react-redux"
import { setUser } from "../store/features/userSlice"
// import { AUTH_NAVIGATION_ROUTES, NAVIGATION_ROUTES_RES_ADMIN } from "../routes"
import {
  AUTH_NAVIGATION_ROUTES,
  NAVIGATION_ROUTES_RES_ADMIN,
  NAVIGATION_ROUTES_BRANCH_ADMIN,
  NAVIGATION_ROUTES_SUPER_ADMIN,
  NAVIGATION_ROUTES_KITCHEN
} from "../routes"
import SettingsSidebar from "../screens/Users/SettingsSidebar"
import { AppShell, Burger, Text, useMantineColorScheme, useMantineTheme } from "@mantine/core"
import { useDisclosure } from "@mantine/hooks"
import { AdminHeader } from "../components/Headers/AdminHeader"
import { Navbar } from "../components/Navbar/Navbar"
import { IconHome, IconBox, IconSettings, IconToolsKitchen, IconBuildingStore, IconUsers } from "@tabler/icons-react"
import { APP_ROLES } from "../utils/constants"

function AuthLayout({ children }) {
  const [opened, { toggle }] = useDisclosure()
  const { colorScheme } = useMantineColorScheme()
  const theme = useMantineTheme()
  const bg = colorScheme === "dark" ? theme.colors.dark[7] : theme.colors.gray[0]

  const navigate = useNavigate()
  const location = useLocation()

  const dispatch = useDispatch()
  const [loading, setLoading] = useState(true)
  const { pathname } = location
  const shouldRenderSettings = pathname.includes(NAVIGATION_ROUTES_RES_ADMIN.Settings.path)
  const shouldRenderSideBar = pathname.includes("/unauthorized")

  //Start sidebar options
  const user = useSelector((state) => state.user.value)
  const [selectedRoute, setSelectedRoute] = useState(null)
  const [submenuState, setSubmenuState] = useState({})
  const [selectedSubmenuRoute, setSelectedSubmenuRoute] = useState(null)

  useEffect(() => {
    const roleRoutesMap = {
      [APP_ROLES.restaurantAdmin]: NAVIGATION_ROUTES_RES_ADMIN,
      [APP_ROLES.superAdmin]: NAVIGATION_ROUTES_SUPER_ADMIN,
      [APP_ROLES.branchAdmin]: NAVIGATION_ROUTES_BRANCH_ADMIN,
      [APP_ROLES.cashierUser]: NAVIGATION_ROUTES_BRANCH_ADMIN
    }

    const routeArray = roleRoutesMap[user.role] || []

    if (Array.isArray(routeArray)) {
      const currentRoute = routeArray.find((item) => location.pathname === item.path)

      if (currentRoute !== undefined) {
        setSelectedRoute(currentRoute)
        setSelectedSubmenuRoute(null)
      } else {
        const submenuItems = routeArray.filter((item) => item.submenu).flatMap((item) => Object.values(item.submenu))

        const currentSubmenuRoute = submenuItems.find((item) => location.pathname === item.path)

        setSelectedRoute(null)
        setSelectedSubmenuRoute(currentSubmenuRoute)
      }
    }
  }, [location.pathname])

  const logout = () => {
    localStorage.removeItem("token")
    navigate(AUTH_NAVIGATION_ROUTES.Login.path)
  }

  const roleRoutesMap = {
    [APP_ROLES.restaurantAdmin]: NAVIGATION_ROUTES_RES_ADMIN,
    [APP_ROLES.superAdmin]: NAVIGATION_ROUTES_SUPER_ADMIN,
    [APP_ROLES.branchAdmin]: NAVIGATION_ROUTES_BRANCH_ADMIN,
    [APP_ROLES.kitchenUser]: NAVIGATION_ROUTES_KITCHEN,
    [APP_ROLES.cashierUser]: NAVIGATION_ROUTES_BRANCH_ADMIN
  }

  const selectedRoutes = roleRoutesMap[user.role] || NAVIGATION_ROUTES_SUPER_ADMIN

  const renderedItems = Object.values(selectedRoutes).map((item) => {
    const isSelected = item === selectedRoute
    const isOpen = submenuState[item.label]

    // return (
    //   <NavigationItem
    //     key={item.label}
    //     item={item}
    //     isSelected={isSelected}
    //     isOpen={isOpen}
    //     toggleSubMenu={toggleSubMenu}
    //     selectedSubmenuRoute={selectedSubmenuRoute}
    //   />
    // )
  })
  //End sidebar options

  useEffect(() => {
    const checkAuth = async () => {
      const user = await authUtils.isAuthenticated()
      if (!user) {
        navigate(AUTH_NAVIGATION_ROUTES.Login.path)
      } else {
        dispatch(setUser(user))
        setLoading(false)
      }
    }
    checkAuth()
  }, [navigate])

  const navLinks = [
    { label: "Inicio", icon: IconHome, link: "/dashboard" },
    { label: "Pedidos", icon: IconBox, link: "/dashboard" },
    {
      label: "Menú",
      icon: IconToolsKitchen,
      initiallyOpened: true,
      links: [
        {
          label: "Platillos",
          link: "/dashboard/table"
        }
        // {
        //   label: "Form",
        //   link: "/dashboard/form",
        // },
      ]
    },
    // {
    //   label: "Auth",
    //   icon: IconLock,
    //   initiallyOpened: true,
    //   links: [
    //     {
    //       label: "Login",
    //       link: "/login",
    //     },
    //     {
    //       label: "Register",
    //       link: "/register",
    //     },
    //   ],
    // },
    { label: "Sucursales", icon: IconBuildingStore, link: "/dashboard" },
    { label: "Usuarios", icon: IconUsers, link: "/dashboard" },
    { label: "Configuración", icon: IconSettings, link: "/dashboard" }
    // {
    //   label: "Sample",
    //   icon: IconMoodSmile,
    //   initiallyOpened: true,
    //   links: [
    //     {
    //       label: "Landing",
    //       link: "/",
    //     },
    //   ],
    // },
  ]

  return loading ? (
    <div className="flex flex-col items-center justify-center h-screen w-screen">
      <LoadingCircle />
    </div>
  ) : (
    <>
      <Header />
      {!shouldRenderSideBar && <SideBar />}
      {shouldRenderSettings && <SettingsSidebar />}
      <Outlet />
      
      {/* <AppShell
        header={{ height: 60 }}
        navbar={{ width: 300, breakpoint: "sm", collapsed: { mobile: !opened } }}
        padding="md"
        transitionDuration={500}
        transitionTimingFunction="ease">
        <AppShell.Navbar>
          <Navbar data={navLinks} hidden={!opened} />
        </AppShell.Navbar>
        <AppShell.Header>
          <AdminHeader burger={<Burger opened={opened} onClick={toggle} hiddenFrom="sm" size="sm" mr="xl" />} />
        </AppShell.Header>
        <AppShell.Main bg={bg}>{children}</AppShell.Main>
        <Outlet />
      </AppShell> */}
    </>
  )
}

export default AuthLayout
