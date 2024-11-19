import { Card, Flex, Grid, Group, Image, Paper, Text } from "@mantine/core"
import React from "react"
import { getFormattedHNL } from "../../utils"
import { OrderDetails } from "./OrderDetails"

export const DishOrderDetailCard = ({ orderDetails }) => {
  return (
    // <Card withBorder>
    //   <Flex align='start' justify='space-between'>
    //     <Image
    //       h={"70px"}
    //       w={"70px"}
    //       radius="sm"
    //       fit="cover"
    //       src={orderDetails?.Dish?.images?.[0]?.location}
    //       fallbackSrc="https://placehold.co/600x400?text=Imagen+no+disponible"
    //     />
    //     <Flex direction="column" align="start">
    //       <Text fw={700}>{orderDetails?.Dish?.name}</Text>
    //       <Text>Cantidad: {orderDetails?.quantity}</Text>
    //       <Text>Incluye bebida: {orderDetails?.includesDrink ? "Si" : "No"}</Text>
    //     </Flex>
    //     <Flex direction="column" justify="center">
    //       <Text fw={700}>Precio unitario</Text>
    //       <Text c="dimmed">{getFormattedHNL(orderDetails?.Dish?.price)}</Text>
    //     </Flex>
    //   </Flex>
    //   {/* <Grid align="center">
    //     <Grid.Col span={{ base: 12, md: "auto" }}>
    //     </Grid.Col>
    //     <Grid.Col span={{ base: 12, md: "auto" }}>
    //     </Grid.Col>

    //     <Grid.Col span={{ base: 12, md: 2 }}>
    //     </Grid.Col>
    //   </Grid> */}
    // </Card>
    <Paper withBorder radius="md" p="xs">
      <Group>
        <Image
          h={"70px"}
          w={"70px"}
          radius="sm"
          fit="cover"
          src={orderDetails?.Dish?.images?.[0]?.location}
          fallbackSrc="https://placehold.co/600x400?text=Imagen+no+disponible"
        />

        <div>
          <Text size="sm" tt="uppercase" fw={700}>
            {orderDetails?.Dish?.name}
          </Text>
          <Text c="dimmed" size="sm">
            Incluye bebida: {orderDetails?.includesDrink ? "Si" : "No"}
          </Text>
          <Text c="dimmed" size="sm">
            Cantidad: {orderDetails?.quantity}
          </Text>
        </div>
      </Group>
    </Paper>
  )
}
