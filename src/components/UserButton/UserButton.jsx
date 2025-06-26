import { Avatar, Flex, Menu, Text, rem, useMantineColorScheme } from "@mantine/core"
import { colors } from "../../theme/colors"
import { useState } from "react"
import { IconLogout } from "@tabler/icons-react"
import { IconSun } from "@tabler/icons-react"
import { AUTH_NAVIGATION_ROUTES } from "../../routes"
import { useNavigate } from "react-router-dom"
import { IconMoon } from "@tabler/icons-react"
import { logoutAction } from "../../store/features/authSlice"
import { useDispatch } from "react-redux"

export function UserButton({ image, name, email, role }) {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [opened, setOpened] = useState(false)
  const { colorScheme, setColorScheme } = useMantineColorScheme()
  const logout = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("setUserRole")
    dispatch(logoutAction())
    navigate(AUTH_NAVIGATION_ROUTES.Login.path)
  }

  const toggleColorScheme = () => {
    setColorScheme(colorScheme === "dark" ? "light" : "dark")
  }

  return (
    <Flex direction="row" gap={8}>
      <div>
        <Text size="sm" ta={"right"}>
          {name}
        </Text>

        <Text color="dimmed" size="sm">
          {email}
        </Text>
      </div>

      <Menu withArrow opened={opened} onChange={setOpened} position="bottom-end" arrowPosition="center" shadow="md" width={200}>
        <Menu.Target>
          <Avatar
            style={{ cursor: "pointer" }}
            src={image}
            alt="it's me"
            name={name
              ?.split(" ")
              .filter((_, i, arr) => i === 0 || i === arr.length - 1)
              .map((palabra) => palabra.charAt(0))
              .join("")
              .toUpperCase()}
            color={colors.main_app_color}
            onClick={() => setOpened(!opened)}
          />
        </Menu.Target>

        <Menu.Dropdown>
          <Menu.Label>
            {role === "admin-restaurant"
              ? "Administrador de restaurante"
              : role === "admin-sucursal"
                ? "Administrador de sucursal"
                : role === "cashier"
                  ? "Cajero"
                  : role === "kitchen"
                    ? "Cocinero"
                    : role === "superadmin"
                      ? "Administrador principal"
                      : "Motorista"}
          </Menu.Label>
          <Menu.Item
            leftSection={
              colorScheme === "dark" ? (
                <IconSun style={{ width: rem(14), height: rem(14) }} />
              ) : (
                <IconMoon style={{ width: rem(14), height: rem(14) }} />
              )
            }
            onClick={toggleColorScheme}>
            {colorScheme === "dark" ? "Modo claro" : "Modo oscuro"}
          </Menu.Item>
          <Menu.Divider />
          <Menu.Item color="red" leftSection={<IconLogout style={{ width: rem(14), height: rem(14) }} />} onClick={logout}>
            Cerrar sesión
          </Menu.Item>
        </Menu.Dropdown>
      </Menu>
    </Flex>
  )
}
