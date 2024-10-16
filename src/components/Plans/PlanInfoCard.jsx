import { Button, Flex, Group, Modal, Paper, Text, ThemeIcon, rem } from "@mantine/core"
import { IconCreditCard } from "@tabler/icons-react"
import classes from "./CardGradient.module.css"
import { colors } from "../../theme/colors"
import { getFormattedHNL } from "../../utils"
import { useDisclosure } from "@mantine/hooks"

export function PlanInfoCard({ data, onCancelPlan }) {
  const [opened, { close, open }] = useDisclosure(false)

  const handleCancelPlan = async () => {
    onCancelPlan(true)
  }

  return (
    <Paper withBorder radius="md" className={classes.card}>
      <Flex align="center" gap="md">
        <ThemeIcon size="xl" radius="md" variant="gradient" gradient={{ deg: 0, from: "#EE364C", to: "#EDB23B" }}>
          <IconCreditCard style={{ width: rem(28), height: rem(28) }} stroke={1.5} />
        </ThemeIcon>
        <Text tt="uppercase" fw={500}>
          {data?.Plan?.name}
        </Text>
      </Flex>
      <Text mt="sm" c="dimmed">
        Su plan actual consta de un pago {data?.Plan?.paymentType?.toLowerCase()} de {getFormattedHNL(data?.Plan?.price)}. Puede
        cancelarlo en cualquier momento y ver en la lista los planes disponibles con el detalle de precios y características.
      </Text>
      <Flex mt="lg" justify="end">
        <Button variant="outline" onClick={open} color={colors.main_app_color}>
          Cancelar plan
        </Button>
      </Flex>

      <Modal
        opened={opened}
        onClose={close}
        size="auto"
        overlayProps={{
          backgroundOpacity: 0.55,
          blur: 3
        }}
        title="Confirmación">
        <Text>¿Estás seguro que deseas cancelar tu plan?</Text>

        <Group mt="sm" justify="end">
          <Button color={colors.main_app_color} variant="outline" onClick={close}>
            No
          </Button>
          <Button
            color={colors.main_app_color}
            onClick={() => {
              handleCancelPlan(data?.restaurantId)
              close()
            }}>
            Sí, deseo hacerlo
          </Button>
        </Group>
      </Modal>
    </Paper>
  )
}
