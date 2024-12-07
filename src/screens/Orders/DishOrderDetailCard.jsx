import { Box, Group, Image, Paper, Text } from "@mantine/core"

export const DishOrderDetailCard = ({ orderDetails }) => {
  return (
    <Paper withBorder radius="md" p="xs">
      <Group>
        <Image
          h={"64px"}
          w={"64px"}
          radius="sm"
          fit="contain"
          src={orderDetails?.Dish?.images?.[0]?.location}
          fallbackSrc="https://placehold.co/600x400?text=Imagen+no+disponible"
        />

        <Box>
          <Text size="sm" tt="uppercase" fw={700}>
            {orderDetails?.Dish?.name}
          </Text>
          <Text c="dimmed" size="sm">
            Incluye bebida: {orderDetails?.includesDrink ? "Si" : "No"}
          </Text>
          <Text c="dimmed" size="sm">
            Cantidad: {orderDetails?.quantity}
          </Text>
        </Box>
      </Group>
    </Paper>
  )
}
