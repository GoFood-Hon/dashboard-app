import { Divider, Paper } from "@mantine/core"
import { BarChart } from "@mantine/charts"

const data = [
  { dishName: "Pinchos al carbón", productId: "0f5d32bc-7192-4d81-ba57-0b3540bd39de", totalQuantity: 21 },
  { dishName: "Taco especial", productId: "ec800068-ddad-413d-9ee2-c3a243816bcd", totalQuantity: 17 },
  { dishName: "Pescado Frito", productId: "359db531-bc3c-49ff-aeb1-7e7a2a2459e5", totalQuantity: 16 },
  { dishName: "Bistec en salsa de mora", productId: "f25427b7-f35b-435a-b09a-821fe4e4eea5", totalQuantity: 13 },
  { dishName: "Pollo frito con papas", productId: "6cbd59da-233c-4fe8-9cdf-6ec8f9158516", totalQuantity: 9 }
]

export const MostSelledDishes = () => {
  return (
    <Paper
      withBorder
      p="md"
      radius="md"
      className="w-full bg-white rounded-2xl shadow border border-blue-100 flex flex-col p-2 mr-6">
      <div className="flex flex-row justify-between items-center p-2">
        <h2 className="text-white-200 text-xl font-semibold">Top 5 de platillos más vendidos</h2>
      </div>
      <Divider my="md" />
      <BarChart
        h={450}
        data={data.map((d) => ({ name: d.dishName, 'Unidades vendidas': d.totalQuantity }))}
        dataKey="name"
        series={[{ name: "Unidades vendidas", color: "red.6" }]}
        barProps={{ radius: 10, width: 20 }}
        tickLine="none"
      />
    </Paper>
  )
}
