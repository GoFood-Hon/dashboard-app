import { Divider, Paper } from "@mantine/core"
import { AreaChart } from "@mantine/charts"

export const data = [
    { date: "Mayo 20", "A domicilio": 120, "Para llevar": 80, "Comer en sitio": 60 },
  { date: "Mayo 21", "A domicilio": 135, "Para llevar": 75, "Comer en sitio": 95 },
  { date: "Mayo 22", "A domicilio": 150, "Para llevar": 90, "Comer en sitio": 100 },
  { date: "Mayo 23", "A domicilio": 170, "Para llevar": 95, "Comer en sitio": 110 },
  { date: "Mayo 24", "A domicilio": 160, "Para llevar": 85, "Comer en sitio": 105 },
]

export const OrdersByChannel = () => {
  return (
    <Paper
      withBorder
      p="md"
      radius="md"
      className="w-full bg-white rounded-2xl shadow border border-blue-100 flex flex-col p-2 mr-6 overflow-hidden">
      <div className="flex flex-row justify-between items-center p-2">
        <h2 className="text-white-200 text-xl font-semibold">Pedidos semanales por canal de entrega</h2>
      </div>
      <Divider my="md" />
      <AreaChart
        h={450}
        data={data}
        dataKey="date"
        type="stacked"
        withLegend
        legendProps={{ verticalAlign: "top" }}
        series={[
          { name: "A domicilio", color: "indigo.6" },
          { name: "Para llevar", color: "teal.6" },
          { name: "Comer en sitio", color: "orange.6" }
        ]}
      />
    </Paper>
  )
}
