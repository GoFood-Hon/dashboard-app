import { Accordion, Box, Divider, Flex, Group, Image, List, Text } from "@mantine/core"
import { useState } from "react"

export const DishOrderDetailCard = ({ orderDetails }) => {
  const [expanded, setExpanded] = useState(false)

  return (
    <Accordion variant="separated" radius="md">
      <Accordion.Item value="dish-info">
        <Accordion.Control onClick={() => setExpanded(!expanded)}>
          <Flex justify={"space-between"} align={"center"}>
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
            <Text size="sm" mr={5}>
              {expanded ? "Ocultar" : "Mostrar"} detalles
            </Text>
          </Flex>
        </Accordion.Control>
        <Accordion.Panel>
          <Divider mb="xs" label="Extras y comentarios del platillo" labelPosition="center" />
          <Flex justify={"space-between"} align={"center"}>
            <Flex direction="column">
              <Text fw={700}>Complementos y extras:</Text>
              <List c="dimmed" size="sm" listStyleType="decimal">
                {orderDetails?.additionalsDetails?.length > 0 ? (
                  orderDetails?.additionalsDetails?.map((additional) => (
                    <List.Item key={additional.id}>{additional.name}</List.Item>
                  ))
                ) : (
                  <Text c="dimmed" size="sm">
                    No se especificaron complementos o extras para este platillo
                  </Text>
                )}
              </List>
            </Flex>
          </Flex>
          <Flex direction="column">
            <Text fw={700}>Comentarios:</Text>
            <Text c="dimmed" size="sm">
              {orderDetails?.orderDetailNote ? orderDetails?.orderDetailNote : "No hay comentarios"}
            </Text>
          </Flex>
        </Accordion.Panel>
      </Accordion.Item>
    </Accordion>
  )
}
