import React, { useEffect, useState } from "react"
import { Outlet, useNavigate, useRouteError } from "react-router-dom"
import authUtils from "../utils/authUtils"
import { useDispatch, useSelector } from "react-redux"
import { setUser } from "../store/features/userSlice"
import {
  AUTH_NAVIGATION_ROUTES,
  NAVIGATION_ROUTES_KITCHEN_TWO,
  NAVIGATION_ROUTES_SUPER_ADMIN_TWO,
  NAVIGATION_ROUTES_RES_ADMIN_TWO,
  NAVIGATION_ROUTES_BRANCH_ADMIN_TWO,
  NAVIGATION_ROUTES_CASHIER_TWO
} from "../routes"
import { AppShell, Burger, Container, useMantineColorScheme, useMantineTheme } from "@mantine/core"
import { useDisclosure } from "@mantine/hooks"
import { AdminHeader } from "../components/Headers/AdminHeader"
import { Navbar } from "../components/Navbar/Navbar"
import { APP_ROLES } from "../utils/constants"
import Lottie from "react-lottie"
import animatedBurger from "../assets/animation/LoadingBurgerAnimation.json"
import { NotificationProvider } from "../components/NotificationProvider"
import { useLocation } from "react-router-dom"
import { Alerts } from "../components/Alerts"
import { ReactErrorBoundary } from "../screens/ReactErrorBoundary"

function AuthLayout() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const location = useLocation()
  const error = useRouteError()
  const [opened, { toggle }] = useDisclosure()
  const { colorScheme } = useMantineColorScheme()
  const theme = useMantineTheme()
  const bg = colorScheme === "dark" ? theme.colors.dark[8] : theme.colors.gray[2]
  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animatedBurger,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice"
    }
  }
  const [loading, setLoading] = useState(true)
  const user = useSelector((state) => state.user.value)
  const [showAlert, setShowAlert] = useState(() => {
    // Preferimos sessionStorage (por sesión). Si no está, revisamos localStorage (compat viejo).
    const hiddenSession = sessionStorage.getItem("hideSubscriptionAlert")
    const hiddenLegacy = localStorage.getItem("hideSubscriptionAlert")

    // Migración/limpieza de legado (opcional pero recomendado)
    if (hiddenLegacy === "true" && hiddenSession === null) {
      // Si alguna vez guardaste en localStorage, limpia para no “arrastrar” estado viejo
      localStorage.removeItem("hideSubscriptionAlert")
    }

    return hiddenSession !== "true"
  })

  const roleRoutesMap = {
    [APP_ROLES.restaurantAdmin]: NAVIGATION_ROUTES_RES_ADMIN_TWO,
    [APP_ROLES.superAdmin]: NAVIGATION_ROUTES_SUPER_ADMIN_TWO,
    [APP_ROLES.branchAdmin]: NAVIGATION_ROUTES_BRANCH_ADMIN_TWO,
    [APP_ROLES.cashierUser]: NAVIGATION_ROUTES_CASHIER_TWO,
    [APP_ROLES.kitchenUser]: NAVIGATION_ROUTES_KITCHEN_TWO
  }

  const userFromStore = useSelector((state) => state.user.value)

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const apiUser = await authUtils.isAuthenticated()
        if (!apiUser) {
          navigate(AUTH_NAVIGATION_ROUTES.Login.path)
          return
        }

        if (!userFromStore?.id) {
          dispatch(setUser(apiUser))
        } else {
          const mergedUser = {
            ...userFromStore,
            ...apiUser,
            Restaurant: {
              ...userFromStore?.Restaurant,
              ...apiUser?.Restaurant,
              isActive: apiUser?.Restaurant?.isActive ?? userFromStore?.Restaurant?.isActive ?? null,
              Subscription: apiUser?.Restaurant?.Subscription ?? userFromStore?.Restaurant?.Subscription ?? null
            }
          }

          dispatch(setUser(mergedUser))
        }
      } catch (error) {
        navigate(AUTH_NAVIGATION_ROUTES.Login.path)
      } finally {
        setLoading(false)
      }
    }

    checkAuth()
  }, [navigate])

  useEffect(() => {
    if (opened) {
      toggle()
    }
  }, [location.pathname])

  return (
    <>
      <NotificationProvider>
        {loading ? (
          <Container
            fluid
            style={{
              height: "100vh",
              display: "flex",
              justifyContent: "center",
              alignItems: "center"
            }}>
            <Lottie options={defaultOptions} height={180} width={180} />
          </Container>
        ) : (
          <AppShell
            header={{ height: 70 }}
            navbar={{ width: 300, breakpoint: "sm", collapsed: { mobile: !opened } }}
            padding="md"
            transitionDuration={500}
            transitionTimingFunction="ease">
            <AppShell.Navbar>
              <Navbar data={roleRoutesMap[user.role]} hidden={!opened} />
            </AppShell.Navbar>
            <AppShell.Header>
              <AdminHeader burger={<Burger opened={opened} onClick={toggle} hiddenFrom="sm" size="sm" />} />
            </AppShell.Header>
            <AppShell.Main bg={bg}>
              <ReactErrorBoundary>
                <Outlet />
              </ReactErrorBoundary>
            </AppShell.Main>
          </AppShell>
        )}
        {user?.role !== "superadmin" && user?.Restaurant?.Subscription === null && showAlert && !loading && (
          <Alerts
            title="Alerta de suscripción"
            setShowAlert={setShowAlert}
            description="Este comercio no tiene un plan activo. Mientras no se contrate uno, no podrá recibir pedidos ni aparecerá en la
            aplicación móvil."
            subdescription="Contacta con soporte para adquirir o renovar tu plan y de este modo podrás hacer uso de todas las funcionalidades del
            sistema."
          />
        )}
        {user?.role !== "superadmin" &&
          user?.Restaurant?.isActive === false &&
          user?.Restaurant?.Subscription !== null &&
          showAlert &&
          !loading && (
            <Alerts
              title="Alerta de comercio inactivo"
              setShowAlert={setShowAlert}
              description="Este comercio actualmente se encuentra inactivo."
              subdescription="Contacta con soporte para poder reactivar el comercio y de este modo podrás hacer uso de todas las funcionalidades del sistema."
            />
          )}
      </NotificationProvider>
    </>
  )
}

export default AuthLayout
