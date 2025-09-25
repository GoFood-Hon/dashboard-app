import React, { useEffect } from "react"
import { getFormattedHNL, getFormattedUSD, toPercentage } from "../../utils"
import { SimpleGrid, Card, Text, Group, Flex, ThemeIcon, rem, Divider, Stack, List, Button, Pagination } from "@mantine/core"
import classes from "./ArticlesCardsGrid.module.css"
import { IconCreditCard } from "@tabler/icons-react"
import { colors } from "../../theme/colors"
import { useDispatch, useSelector } from "react-redux"
import { fetchAllPlansSelectPlan, setCurrentPageSelectPlan } from "../../store/features/plansSlice"
import { IconCircleXFilled } from "@tabler/icons-react"
import { IconCircleCheckFilled } from "@tabler/icons-react"

export function SelectPlan({ onSelected, currentPlan }) {
  const dispatch = useDispatch()
  const limit = useSelector((state) => state.plans.itemsPerPageSelectPlan)
  const page = useSelector((state) => state.plans.currentPageSelectPlan)
  const plansByPage = useSelector((state) => state.plans.plansByPageSelectPlan)
  const totalPagesCount = useSelector((state) => state.plans.totalPagesCountSelectPlan)
  const totalPlans = useSelector((state) => state.plans.totalPlansSelectPlan)
  const plans = plansByPage[page] || []

  useEffect(() => {
    dispatch(fetchAllPlansSelectPlan({ limit, page, order: "DESC", isActive: true }))
  }, [dispatch, limit, page])

  const onSubmit = async (planId) => {
    onSelected(planId)
  }

  const cards = plans.map((plan) => (
    <Card
      withBorder
      key={plan.id}
      p="md"
      radius="md"
      h={480}
      className={classes.card}
      style={{ display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
      <Stack spacing="xs">
        <Flex align="center" gap="sm">
          <ThemeIcon size="lg" radius="md" variant="gradient" gradient={{ deg: 0, from: "#EE364C", to: "#EDB23B" }}>
            <IconCreditCard style={{ width: rem(28), height: rem(28) }} stroke={1.5} />
          </ThemeIcon>
          <Text c="dimmed" size="sm" tt="uppercase" fw={700}>
            {plan.name}
          </Text>
        </Flex>
        <Divider />
        <Flex direction="column" justify={"space-between"} gap="xs">
          <Text c="dimmed" size="sm" fw={700}>
            Valor:{" "}
            {plan?.price != 0
              ? plan?.currency === "USD"
                ? getFormattedUSD(plan?.price)
                : getFormattedHNL(plan?.price)
              : "Gratuito"}
          </Text>
          <Text c="dimmed" size="sm" fw={700}>
            Impuesto: {plan?.tax !== "0.00" ? toPercentage(plan?.tax) : "Ninguno"}
          </Text>
          <Text c="dimmed" size="sm" fw={700}>
            Tipo de pago: {plan.paymentType}
          </Text>
        </Flex>
        <Stack gap="xs">
          <Text c="dimmed" size="sm" fw={700}>
            Características:
          </Text>
          <List c="dimmed" fw={700} spacing="" size="sm" center>
            {plan?.PlanFeatures?.slice()
              .sort((a, b) => {
                if (a.type === "amount" && b.type === "boolean") return -1
                if (a.type === "boolean" && b.type === "amount") return 1

                return a.name.localeCompare(b.name)
              })
              .map((feature, index) => {
                const planData = feature.PlanPlanFeatures
                const isActive = planData?.available || (planData?.quantity ?? 0) > 0

                return (
                  <Flex key={index} align="center" gap={4}>
                    <ThemeIcon color={isActive ? "green" : "gray"} variant="transparent" radius="xl">
                      {isActive ? <IconCircleCheckFilled /> : <IconCircleXFilled color={colors.main_app_color} />}
                    </ThemeIcon>

                    <List.Item>{feature.name}:</List.Item>

                    {feature.type === "amount" && typeof planData?.quantity === "number" ? (
                      <Text size="sm">{planData.quantity}</Text>
                    ) : (
                      <Text size="sm">{planData?.available ? "Habilitado" : "Deshabilitado"}</Text>
                    )}
                  </Flex>
                )
              })}
          </List>
        </Stack>
      </Stack>
      <Button
        onClick={() => onSubmit({ id: plan.id, name: plan.name })}
        color={colors.main_app_color}
        mt="md"
        disabled={currentPlan === plan.id}
        variant={currentPlan === plan.id ? "default" : "filled"}
        leftSection={currentPlan === plan.id ? <IconCircleCheckFilled /> : null}
        style={
          currentPlan === plan.id
            ? {
                borderColor: "var(--mantine-color-dark-4)",
                backgroundColor: "transparent",
                color: "var(--mantine-color-dark-2)",
                cursor: "not-allowed"
              }
            : {}
        }>
        {currentPlan === plan.id ? "Plan actual" : "Seleccionar plan"}
      </Button>
    </Card>
  ))

  return (
    <Stack gap="md">
      <SimpleGrid cols={{ xs: 2, md: 3, sm: 2 }}>{cards}</SimpleGrid>
      {totalPlans > limit && (
        <Flex align="center" justify="end">
          <Group>
            <Pagination
              total={totalPagesCount}
              page={page}
              onChange={(page) => dispatch(setCurrentPageSelectPlan(page))}
              color={colors.main_app_color}
              defaultValue={page}
              size="md"
              withEdges
            />
          </Group>
        </Flex>
      )}
    </Stack>
  )
}
