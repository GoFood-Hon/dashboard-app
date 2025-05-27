import { Divider, Paper } from "@mantine/core"
import { AreaChart } from "@mantine/charts"
import { getFormattedHNL } from "../../utils"

export const data = [
  { date: "Mayo 20", "A domicilio": 13200, "Para llevar": 7400, "Comer en sitio": 5800 },
  { date: "Mayo 21", "A domicilio": 17800, "Para llevar": 9200, "Comer en sitio": 11000 },
  { date: "Mayo 22", "A domicilio": 14300, "Para llevar": 6800, "Comer en sitio": 9400 },
  { date: "Mayo 23", "A domicilio": 19900, "Para llevar": 8400, "Comer en sitio": 11500 },
  { date: "Mayo 24", "A domicilio": 12800, "Para llevar": 9700, "Comer en sitio": 10300 }
]

export const SellsByChannel = () => {
  return (
    <Paper
      withBorder
      p="md"
      radius="md"
      className="w-full bg-white rounded-2xl shadow border border-blue-100 flex flex-col p-2 mr-6 overflow-hidden">
      <div className="flex flex-row justify-between items-center p-2">
        <h2 className="text-white-200 text-xl font-semibold">Ventas semanales por canal de entrega</h2>
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
          { name: "A domicilio", color: "red.6" },
          { name: "Para llevar", color: "pink.6" },
          { name: "Comer en sitio", color: "blue.6" }
        ]}
        valueFormatter={(value) => getFormattedHNL(value)}
        margin={{ top: 20, right: 20, bottom: 30, left: 20 }}
      />
    </Paper>
  )
}
