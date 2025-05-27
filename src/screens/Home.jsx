import { Grid, Stack, Title, Flex, Menu, ActionIcon, Text } from "@mantine/core"
import { DashboardScreen } from "./Dashboards/DashboardScreen"
import { MostSelledDishes } from "./Dashboards/MostSelledDishes"
import { OrdersByChannel } from "./Dashboards/OrdersByChannel"
import { SellsByChannel } from "./Dashboards/SellsByChannel"
import { MostSelledMenus } from "./Dashboards/MostSelledMenus"
import {
  IconSettings,
  IconSearch,
  IconPhoto,
  IconMessageCircle,
  IconTrash,
  IconArrowsLeftRight,
  IconAdjustments
} from "@tabler/icons-react"
import { colors } from "../theme/colors"

function Home() {
  return (
    <Stack gap="xs">
      <Flex justify="space-between" align="center">
        <Title order={2}>Dashboard</Title>
        {/* <Menu shadow="md" width={200} position="bottom-end">
          <Menu.Target>
            <ActionIcon variant="filled" aria-label="Settings" color={colors.main_app_color}>
              <IconAdjustments style={{ width: "70%", height: "70%" }} stroke={1.5} />
            </ActionIcon>
          </Menu.Target>

          <Menu.Dropdown>
            <Menu.Label>Accesos rápidos</Menu.Label>
            <Menu.Item>Semana en curso</Menu.Item>
            <Menu.Item>Semana anterior</Menu.Item>
            <Menu.Item>Mes actual</Menu.Item>
            <Menu.Item>Mes anterior</Menu.Item>
          </Menu.Dropdown>
        </Menu> */}
      </Flex>
      <DashboardScreen />
      <Grid gutter="xs">
        <Grid.Col span={{ base: 12, md: 6, lg: 6 }}>
          <OrdersByChannel />
        </Grid.Col>
        <Grid.Col span={{ base: 12, md: 6, lg: 6 }}>
          <SellsByChannel />
        </Grid.Col>
        <Grid.Col span={{ base: 12, md: 6, lg: 6 }}>
          <MostSelledMenus />
        </Grid.Col>
        <Grid.Col span={{ base: 12, md: 6, lg: 6 }}>
          <MostSelledDishes />
        </Grid.Col>
      </Grid>
    </Stack>
  )
}

export default Home
