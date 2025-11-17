import { Divider, Paper } from "@mantine/core"
import { PieChart } from "@mantine/charts"

export const HourlyPerformanceChart = () => {
  return (
    <Paper
      withBorder
      p="md"
      radius="md"
      className="min-h-[600px] w-full h-[600px] bg-white rounded-2xl shadow border border-blue-100 flex flex-col p-2 mr-6">
      <div className="flex flex-row justify-between items-center p-2">
        <h2 className="text-white-200 text-xl font-semibold">Gráfico del total de ventas</h2>
      </div>
      <Divider my="md" />
      <PieChart
        h={490}
        size={350}
        withLabelsLine
        labelsPosition="outside"
        labelsType="value"
        withLabels
        data={[
          { name: "Delivery", value: 11, color: "indigo.6" },
          { name: "Recoger en comercio", value: 7, color: "yellow.6" },
          { name: "Comer en comercio", value: 15, color: "teal.6" }
        ]}
      />
    </Paper>
  )
}
