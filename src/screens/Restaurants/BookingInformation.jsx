import { Flex, Grid, Group, Input, Paper } from "@mantine/core"

const BookingInformation = () => {
  return (
    <Grid grow>
      <Grid.Col span={{ base: 12, md: 6, lg: 3 }}>
        <Input.Wrapper label="Precio por silla" fw={700} error="">
          <Input type="number" />
        </Input.Wrapper>
      </Grid.Col>
      <Grid.Col span={{ base: 12, md: 6, lg: 3 }}>
        <Input.Wrapper label="Cantidad de horas antes de cancelar pedido" fw={700} error="">
          <Input type="number" />
        </Input.Wrapper>
      </Grid.Col>
      <Grid.Col span={{ base: 12, md: 6, lg: 3 }}>
        <Input.Wrapper label="Cantidad de horas antes de pagar pedido" fw={700} error="">
          <Input type="number" />
        </Input.Wrapper>
      </Grid.Col>
    </Grid>
  )
}

export default BookingInformation
