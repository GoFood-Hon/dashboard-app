import { Avatar, Flex, Menu, Text, rem } from "@mantine/core"
import { colors } from "../../theme/colors"
import { IconSettings } from "@tabler/icons-react"
import { IconMessageCircle } from "@tabler/icons-react"
import { IconPhoto } from "@tabler/icons-react"
import { IconSearch } from "@tabler/icons-react"
import { IconArrowsLeftRight } from "@tabler/icons-react"
import { useState } from "react"
import { IconLogout } from "@tabler/icons-react"
import { IconSun } from "@tabler/icons-react"

export function UserButton({ image, name, email, role }) {
  const [opened, setOpened] = useState(false)

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
              ? "Admin. de restaurante"
              : role === "admin-sucursal"
                ? "Admin. de sucursal"
                : role === "cashier"
                  ? "Cajero"
                  : role === "kitchen"
                    ? "Cocinero"
                    : role === "superadmin"
                      ? "Administrador principal"
                      : "Motorista"}
          </Menu.Label>
          <Menu.Item leftSection={<IconSettings style={{ width: rem(14), height: rem(14) }} />}>Cuenta</Menu.Item>
          <Menu.Item leftSection={<IconSun style={{ width: rem(14), height: rem(14) }} />}>Modo claro</Menu.Item>
          <Menu.Divider />
          <Menu.Item color="red" leftSection={<IconLogout style={{ width: rem(14), height: rem(14) }} />}>
            Cerrar sesión
          </Menu.Item>
        </Menu.Dropdown>
      </Menu>
    </Flex>
  )
}
