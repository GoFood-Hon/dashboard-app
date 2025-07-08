import { Divider, Group, Loader, Paper, Text } from "@mantine/core"
import { BarChart } from "@mantine/charts"
import { colors } from "../../theme/colors"
import { getFormattedHNL } from "../../utils"

export const TopShops = ({ data, loading }) => {
  const isEmpty = Array.isArray(data) && data.length === 0

  return (
    <Paper
      withBorder
      p="md"
      radius="md"
      className="w-full bg-white rounded-2xl shadow border border-blue-100 flex flex-col p-2 mr-6 overflow-hidden">
      <div className="flex flex-row justify-between items-center p-2">
        <h2 className="text-white-200 text-xl font-semibold">Comercios líderes en ventas</h2>
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
        <BarChart
          h={450}
          data={data.map((item) => ({ name: item.name, "Total vendido": item.total }))}
          dataKey="name"
          series={[{ name: "Total vendido", color: "gray.6" }]}
          barProps={{ radius: 8 }}
          tickLine="none"
          valueFormatter={(value) => getFormattedHNL(value)}
          margin={{ top: 20, right: 20, bottom: 30, left: 20 }}
          withYAxis={false}
        />
      )}
    </Paper>
  )
}
