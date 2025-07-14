import { Divider, Group, Loader, Paper, Text } from "@mantine/core"
import { AreaChart } from "@mantine/charts"
import { getFormattedHNL, transformChartsData } from "../../utils"
import { colors } from "../../theme/colors"
import { useSelector } from "react-redux"

export const SellsByChannel = ({ data, loading }) => {
  const user = useSelector((state) => state.user.value)
  const haveOnSiteModule =
    user?.role === "superadmin" ||
    !!user?.Restaurant?.Subscription?.Plan?.PlanFeatures?.some(
      (feature) => feature.featureCode === "on-site-service-module" && feature.PlanPlanFeatures?.avai === true
    )
  const isEmpty = Array.isArray(data) && data.length === 0
  const formattedData = transformChartsData(data ?? [], haveOnSiteModule)

  return (
    <Paper
      withBorder
      p="md"
      radius="md"
      className="w-full bg-white rounded-2xl shadow border border-blue-100 flex flex-col p-2 mr-6 overflow-hidden">
      <div className="flex flex-row justify-between items-center p-2">
        <h2 className="text-white-200 text-xl font-semibold">Ventas por canal de entrega</h2>
      </div>
      <Divider my="md" />

      {loading ? (
        <Group h={450} justify="center" align="center" className="w-full">
          <Loader color={colors.main_app_color} />
        </Group>
      ) : isEmpty ? (
        <Group h={450} justify="center" align="center" className="w-full">
          <Text c="dimmed">No hay datos para mostrar</Text>
        </Group>
      ) : (
        <AreaChart
          h={450}
          data={formattedData}
          dataKey="date"
          type="default"
          withLegend
          legendProps={{ verticalAlign: "top" }}
          series={[
            { name: "A domicilio", color: "red.6" },
            { name: "Para llevar", color: "pink.6" },
            ...(haveOnSiteModule ? [{ name: "Venta en mesa", color: "blue.6" }] : [])
          ]}
          valueFormatter={(value) => getFormattedHNL(value)}
          margin={{ top: 20, right: 20, bottom: 30, left: 20 }}
        />
      )}
    </Paper>
  )
}
