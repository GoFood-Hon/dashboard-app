import React, { useEffect, useState } from "react"
import { getFormattedHNL } from "../../utils"
import plansApi from "../../api/plansApi"
import { SimpleGrid, Card, Text, Group, Flex, ThemeIcon, rem, Divider, Stack, List, Button, Pagination } from "@mantine/core"
import classes from "./ArticlesCardsGrid.module.css"
import { IconCreditCard } from "@tabler/icons-react"
import { IconCircleCheckFilled } from "@tabler/icons-react"
import { colors } from "../../theme/colors"
import { showNotification } from "@mantine/notifications"
import { ITEMS_PER_PAGE_CARDS } from "../../utils/paginationConfig"
import { useDispatch, useSelector } from "react-redux"
import { fetchAllPlansSelectPlan, setCurrentPageSelectPlan } from "../../store/features/plansSlice"

export function SelectPlan({ onSelected }) {
  const dispatch = useDispatch()
  const limit = useSelector((state) => state.plans.itemsPerPageSelectPlan)
  const page = useSelector((state) => state.plans.currentPageSelectPlan)
  const plansByPage = useSelector((state) => state.plans.plansByPageSelectPlan)
  const totalPagesCount = useSelector((state) => state.plans.totalPagesCountSelectPlan)
  const totalPlans = useSelector((state) => state.plans.totalPlansSelectPlan)
  const plans = plansByPage[page] || []
  const loadingPlans = useSelector((state) => state.plans.loadingPlansSelectPlan)

  useEffect(() => {
    if (!plansByPage[page]) {
      dispatch(fetchAllPlansSelectPlan({ limit, page, order: "DESC" }))
    }
  }, [dispatch, limit, page, plansByPage])

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
          Valor: {plan?.price != 0 ? getFormattedHNL(plan?.price) : "Gratuito"}
        </Text>
        <Text c="dimmed" size="sm" fw={700}>
          Impuestos: {plan?.tax != 0 ? getFormattedHNL(plan?.tax) : "Ninguno"}
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

  return (
    <Stack gap="md">
      <SimpleGrid cols={{ xs: 2, md: 3, sm: 2 }}>{cards}</SimpleGrid>
      {totalPlans > limit && (
        <Flex align="center" justify="end">
          <Group>
            <Pagination
              total={totalPagesCount}
              page={page}
              onChange={(page) => setCurrentPageSelectPlan(page)}
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
