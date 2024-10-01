import { Divider, Flex, ScrollArea } from "@mantine/core"
import { NavLinksGroup } from "./NavLinksGroup"
import classes from "./Navbar.module.css"
import { useNavigate } from "react-router-dom"
import { AUTH_NAVIGATION_ROUTES } from "../../routes"
import { IconLogout } from "@tabler/icons-react"

export function Navbar({ data }) {
  const navigate = useNavigate()
  const links = data?.map((item) => <NavLinksGroup key={item.label} {...item} />)

  const logout = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("setUserRole")
    navigate(AUTH_NAVIGATION_ROUTES.Login.path)
  }

  return (
    <>
      <ScrollArea className={classes.links}>
        <div className={classes.linksInner}>{links}</div>
      </ScrollArea>
      <Divider />
      <div className="cursor-pointer" onClick={logout}>
        <Flex align="center" p={24}>
          <IconLogout size={17}  />
          <span className="text-sm ml-3">Cerrar sesión</span>
        </Flex>
      </div>
    </>
  )
}
