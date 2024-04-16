import { Grid, Image } from "@mantine/core"
import React from "react"
import { getFormattedHNL } from "../../utils"
import { OrderDetails } from "./OrderDetails"

export const DishOrderDetailCard = ({ orderDetails }) => {
  return (
    <div className="w-full bg-white rounded-2xl border border-blue-100 p-4 mt-4">
      <Grid gutter={"xs"}>
        <Grid.Col span={{ base: 12, md: "auto" }}>
          <Image
            h={"120px"}
            w={"130px"}
            fit="contain"
            src={orderDetails?.Dish?.images?.[0]?.location}
            fallbackSrc="https://placehold.co/600x400?text=Imagen+no+disponible"
          />
        </Grid.Col>
        <Grid.Col span={{ base: 12, md: "auto" }}>
          <div className="flex flex-col">
            <span className="text-zinc-500 text-sm  font-medium leading-normal">{orderDetails?.Dish?.name}</span>
            <span className="text-blue-600 text-xs py-2 font-bold leading-normal">Cantidad: {orderDetails?.quantity}</span>
            <span className="text-zinc-500 text-xs py-2 font-bold leading-normal">
              Incluye bebida: {orderDetails?.includesDrink ? "Si" : "No"}
            </span>
          </div>
        </Grid.Col>

        <Grid.Col span={{ base: 12, md: 2 }}>
          <div className="flex flex-col">
            <span className="text-zinc-500 text-sm  font-medium leading-normal">Precio Unit.</span>
            <span className="text-sky-950  text-xs py-2 font-bold leading-normal">
              {getFormattedHNL(orderDetails?.Dish?.price)}
            </span>
          </div>
        </Grid.Col>
      </Grid>
    </div>
  )
}
