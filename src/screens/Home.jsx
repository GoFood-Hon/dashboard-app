import { Grid, Stack, Title } from "@mantine/core"
import { DashboardScreen } from "./Dashboards/DashboardScreen"
import { OrderAmountChart } from "./Dashboards/OrderAmountChart"
import { DailySalesChart } from "./Dashboards/DailySalesChart"
import { HourlyPerformanceChart } from "./Dashboards/HourlyPerformanceChart"
import { PopularFoodChart } from "./Dashboards/PopularFoodChart"

function Home() {
  return (
    <Stack gap="md">
      <Title order={2}>Dashboard</Title>
      <DashboardScreen />
      <Grid gutter='sm'>
        <Grid.Col span={{ base: 12, md: 6, lg: 6 }}>
          <OrderAmountChart />
        </Grid.Col>
        <Grid.Col span={{ base: 12, md: 6, lg: 6 }}>
          <DailySalesChart />
        </Grid.Col>
        <Grid.Col span={{ base: 12, md: 6, lg: 6 }}>
          <HourlyPerformanceChart />
        </Grid.Col>
        <Grid.Col span={{ base: 12, md: 6, lg: 6 }}>
          <PopularFoodChart />
        </Grid.Col>
      </Grid>
    </Stack>
  )
}

export default Home
