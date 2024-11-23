import React, { useEffect, useState } from "react"
import { Outlet, useNavigate } from "react-router-dom"
import authUtils from "../utils/authUtils"
import { useDispatch, useSelector } from "react-redux"
import { setUser } from "../store/features/userSlice"
import {
  AUTH_NAVIGATION_ROUTES,
  NAVIGATION_ROUTES_KITCHEN_TWO,
  NAVIGATION_ROUTES_SUPER_ADMIN_TWO,
  NAVIGATION_ROUTES_RES_ADMIN_TWO,
  NAVIGATION_ROUTES_BRANCH_ADMIN_TWO
} from "../routes"
import { AppShell, Burger, Container, useMantineColorScheme, useMantineTheme } from "@mantine/core"
import { useDisclosure } from "@mantine/hooks"
import { AdminHeader } from "../components/Headers/AdminHeader"
import { Navbar } from "../components/Navbar/Navbar"
import { APP_ROLES } from "../utils/constants"
import Lottie from "react-lottie"
import animatedBurger from '../assets/animation/LoadingBurgerAnimation.json'

function AuthLayout() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
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
  const roleRoutesMap = {
    [APP_ROLES.restaurantAdmin]: NAVIGATION_ROUTES_RES_ADMIN_TWO,
    [APP_ROLES.superAdmin]: NAVIGATION_ROUTES_SUPER_ADMIN_TWO,
    [APP_ROLES.branchAdmin]: NAVIGATION_ROUTES_BRANCH_ADMIN_TWO,
    [APP_ROLES.cashierUser]: NAVIGATION_ROUTES_BRANCH_ADMIN_TWO,
    [APP_ROLES.kitchenUser]: NAVIGATION_ROUTES_KITCHEN_TWO
  }

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

  return (
    <>
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
            <Outlet />
          </AppShell.Main>
        </AppShell>
      )}
    </>
  )
}

export default AuthLayout
