import { Divider, Paper } from "@mantine/core"
import { BarChart, PieChart, DonutChart } from "@mantine/charts"

export const PopularFoodChart = () => {
  const data = [
    { dishName: "Pinchos al carbón", productId: "0f5d32bc-7192-4d81-ba57-0b3540bd39de", totalQuantity: 21 },
    { dishName: "Taco especial", productId: "ec800068-ddad-413d-9ee2-c3a243816bcd", totalQuantity: 17 },
    { dishName: "Pescado Frito", productId: "359db531-bc3c-49ff-aeb1-7e7a2a2459e5", totalQuantity: 16 },
    { dishName: "Bistec en salsa de mora", productId: "f25427b7-f35b-435a-b09a-821fe4e4eea5", totalQuantity: 13 },
    { dishName: "Pollo frito con papas", productId: "6cbd59da-233c-4fe8-9cdf-6ec8f9158516", totalQuantity: 9 },
    { dishName: "Bowl de lasagna y pollo", productId: "6b7b249e-130e-4d9e-bcf6-e4aec4b4a08b", totalQuantity: 5 }
  ]

  const secondData = [
    { name: "USA", value: 400, color: "indigo.6" },
    { name: "India", value: 300, color: "yellow.6" },
    { name: "Japan", value: 300, color: "teal.6" },
    { name: "Other", value: 200, color: "gray.6" }
  ]

  return (
    <Paper
      withBorder
      p="md"
      radius="md"
      className="w-full bg-white rounded-2xl shadow border border-blue-100 flex flex-col p-2 mr-6">
      <div className="flex flex-row justify-between items-center p-2">
        <h2 className="text-white-200 text-xl font-semibold">Cantidad de ventas por tipo de servicio</h2>
      </div>
      <Divider my="md" />
      {/* <BarChart
        h={550}
        data={data.map((d) => ({ name: d.dishName, ventas: d.totalQuantity }))}
        dataKey="name"
        series={[{ name: "ventas", color: "blue" }]}
        withLegend
        withYAxis
        tickLine="none"
        gridAxis="none"
      /> */}
      <DonutChart h={490} size={350} thickness={50} data={secondData} />
    </Paper>
  )
}
