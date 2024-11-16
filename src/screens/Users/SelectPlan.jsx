import React, { useEffect, useState } from "react"
import { getFormattedHNL } from "../../utils"
import plansApi from "../../api/plansApi"
import { SimpleGrid, Card, Text, Paper, Flex, ThemeIcon, rem, Divider, Stack, List, Button } from "@mantine/core"
import classes from "./ArticlesCardsGrid.module.css"
import { IconCreditCard } from "@tabler/icons-react"
import { IconCircleCheckFilled } from "@tabler/icons-react"
import { colors } from "../../theme/colors"
import { showNotification } from "@mantine/notifications"

export function SelectPlan({ onSelected }) {
  const [plans, setPlans] = useState([])

  useEffect(() => {
    ;(async () => {
      const response = await plansApi.getAllPlans()

      if (response.error) {
        showNotification({
          title: "Error",
          message: response.message,
          color: "red",
          duration: 7000
        })
      } else {
        setPlans(response?.data)
      }
    })()
  }, [])

  const onSubmit = async (planId) => {
    onSelected(planId)
  }

  const cards = plans.map((plan) => (
    <Card
      withBorder
      key={plan.id}
      p="md"
      radius="md"
      h={420}
      className={classes.card}
      style={{ display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
      <Stack spacing="sm">
        <Flex align="center" gap="sm">
          <ThemeIcon size="lg" radius="md" variant="gradient" gradient={{ deg: 0, from: "#EE364C", to: "#EDB23B" }}>
            <IconCreditCard style={{ width: rem(28), height: rem(28) }} stroke={1.5} />
          </ThemeIcon>
          <Text c="dimmed" size="sm" tt="uppercase" fw={700}>
            {plan.name}
          </Text>
        </Flex>
        <Divider />
        <Text c="dimmed" size="sm" fw={700}>
          Tipo de pago: {plan.paymentType}
        </Text>
        <Text c="dimmed" size="sm" fw={700}>
          Valor: {getFormattedHNL(plan?.price)}
        </Text>
        <Text c="dimmed" size="sm" fw={700}>
          Impuestos: {getFormattedHNL(plan?.tax)}
        </Text>
        <Text c="dimmed" size="sm" fw={700}>
          Características:
        </Text>
        <List
          c="dimmed"
          fw={700}
          spacing="xs"
          size="sm"
          center
          icon={
            <ThemeIcon color="green" variant="transparent" radius="xl">
              <IconCircleCheckFilled />
            </ThemeIcon>
          }>
          {plan?.PlanFeatures?.map((feature, index) => (
            <Flex key={index} align="center" gap="xs">
              <List.Item>{feature.name}:</List.Item>
              {feature.type === "amount" && feature.PlanPlanFeatures?.quantity ? (
                <Text size="sm">{feature.PlanPlanFeatures.quantity}</Text>
              ) : (
                <Text size="sm">{feature.PlanPlanFeatures?.available ? "Habilitado" : "Deshabilitado"}</Text>
              )}
            </Flex>
          ))}
        </List>
      </Stack>
      <Button onClick={() => onSubmit({ id: plan.id, name: plan.name })} color={colors.main_app_color} mt="md">
        Seleccionar
      </Button>
    </Card>
  ))

  return <SimpleGrid cols={{ xs: 2, md: 3, sm: 2 }}>{cards}</SimpleGrid>
}
