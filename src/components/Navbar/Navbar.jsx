import { Box, Divider, Flex, ScrollArea, ThemeIcon } from "@mantine/core"
import { NavLinksGroup } from "./NavLinksGroup"
import classes from "./Navbar.module.css"
import { useNavigate } from "react-router-dom"
import { AUTH_NAVIGATION_ROUTES } from "../../routes"
import { IconLogout } from "@tabler/icons-react"
import { colors } from "../../theme/colors"
import { useDispatch } from "react-redux"
import { logoutAction } from "../../store/features/authSlice"

export function Navbar({ data }) {
  const navigate = useNavigate()
  const dispatch  = useDispatch()
  const links = data?.map((item) => <NavLinksGroup key={item.label} {...item} />)

  const logout = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("setUserRole")
    dispatch(logoutAction());
    navigate(AUTH_NAVIGATION_ROUTES.Login.path)
  }

  return (
    <>
      <ScrollArea className={classes.links}>
        <Box mt='sm'>{links}</Box>
      </ScrollArea>
      <Divider />
      <div className={`cursor-pointer hover:bg-${colors.main_app_color}`} onClick={logout}>
        <Flex align="center" p={20}>
          <ThemeIcon variant="filled" color={colors.main_app_color} size={30}>
            <IconLogout size="1.1rem" />
          </ThemeIcon>
          <span className="text-sm ml-3">Cerrar sesión</span>
        </Flex>
      </div>
    </>
  )
}
