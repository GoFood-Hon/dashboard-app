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
import { AppShell, Burger, Text, useMantineColorScheme, useMantineTheme } from "@mantine/core"
import { useDisclosure } from "@mantine/hooks"
import { AdminHeader } from "../components/Headers/AdminHeader"
import { Navbar } from "../components/Navbar/Navbar"
import { APP_ROLES } from "../utils/constants"

function AuthLayout() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [opened, { toggle }] = useDisclosure()
  const { colorScheme } = useMantineColorScheme()
  const theme = useMantineTheme()
  const bg = colorScheme === "dark" ? theme.colors.dark[7] : theme.colors.gray[0]

  const [loading, setLoading] = useState(true)

  //Start sidebar options
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
          <AdminHeader burger={<Burger opened={opened} onClick={toggle} hiddenFrom="sm" size="sm" mr="xl" />} />
        </AppShell.Header>
        <AppShell.Main bg={bg}>
          <Outlet />
        </AppShell.Main>
      </AppShell>
    </>
  )
}

export default AuthLayout
