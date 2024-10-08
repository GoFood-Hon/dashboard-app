import { Flex, Group, Input, Paper } from "@mantine/core"

const BookingInformation = () => {
  return (
    <Paper>
      <Group grow>
        <Input.Wrapper label="Precio por silla" fw={700} error="">
          <Input type="number" />
        </Input.Wrapper>
        <Input.Wrapper label="Cantidad de horas antes de cancelar pedido" fw={700} error="">
          <Input type="number" />
        </Input.Wrapper>
        <Input.Wrapper label="Cantidad de horas antes de pagar pedido" fw={700} error="">
          <Input type="number" />
        </Input.Wrapper>
      </Group>
    </Paper>
  )
}

export default BookingInformation
