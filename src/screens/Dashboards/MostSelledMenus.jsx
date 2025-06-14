import { Divider, Paper } from "@mantine/core"
import { BarChart } from "@mantine/charts"

const data = [
  { menuName: "Menú Ejecutivo", totalQuantity: 120 },
  { menuName: "Desayuno Clásico", totalQuantity: 95 },
  { menuName: "Combo Familiar", totalQuantity: 80 },
  { menuName: "Cena Romántica", totalQuantity: 60 },
  { menuName: "Menú Infantil", totalQuantity: 45 }
]

export const MostSelledMenus = () => {
  const isEmpty = Array.isArray(data) && data.length === 0
  
  return (
    <Paper
      withBorder
      p="md"
      radius="md"
      className="w-full bg-white rounded-2xl shadow border border-blue-100 flex flex-col p-2 mr-6">
      <div className="flex flex-row justify-between items-center p-2">
        <h2 className="text-white-200 text-xl font-semibold">Menús más vendidos</h2>
      </div>
      <Divider my="md" />
      <BarChart
        orientation="vertical"
        h={450}
        data={data.map((item) => ({ name: item.menuName, "Unidades vendidas": item.totalQuantity }))}
        dataKey="name"
        series={[{ name: "Unidades vendidas", color: "gray.6" }]}
        barProps={{ radius: 8 }}
        tickLine="none"
      />
    </Paper>
  )
}
