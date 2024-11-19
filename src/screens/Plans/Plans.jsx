import React, { useEffect } from "react"
import { useNavigate } from "react-router-dom"
import MenuTable from "../Menu/MenuTable"
import { NAVIGATION_ROUTES_SUPER_ADMIN } from "../../routes"
import { useDispatch, useSelector } from "react-redux"
import { fetchAllPlans } from "../../store/features/plansSlice"
import { Paper, Button, Group, Flex, Title, Text } from "@mantine/core"
import { colors } from "../../theme/colors"

export const Plans = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const limit = useSelector((state) => state.plans.itemsPerPage)
  const page = useSelector((state) => state.plans.currentPage)
  const plansByPage = useSelector((state) => state.plans.plansByPage)
  const totalPagesCount = useSelector((state) => state.plans.totalPagesCount)
  const totalPlans = useSelector((state) => state.plans.totalPlans)
  const plans = plansByPage[page] || []
  const loadingPlans = useSelector((state) => state.plans.loadingPlans)

  useEffect(() => {
    if (!plansByPage[page]) {
      dispatch(fetchAllPlans({ limit, page, order: "DESC" }))
    }
  }, [dispatch, limit, page, plansByPage])

  const handleNewPlan = () => {
    navigate(NAVIGATION_ROUTES_SUPER_ADMIN.Plans.NewPlan.path)
  }

  return (
    <>
      <Group grow className="mb-3">
        <Flex align="center" justify="space-between">
          <Title order={2} fw={700}>
            Planes
          </Title>
          <Flex align="center" gap="xs">
            <Flex align="center" gap={5}>
              <Text fw={700}>
                {page === 1 ? 1 : (page - 1) * limit + 1}-{page === 1 ? limit : Math.min(page * limit, totalPlans)}
              </Text>
              <Text>de</Text>
              <Text fw={700}>{totalPlans} planes</Text>
            </Flex>
            <Button color={colors.main_app_color} onClick={handleNewPlan}>
              Nuevo
            </Button>
          </Flex>
        </Flex>
      </Group>
      <MenuTable
        items={plans}
        screenType="planScreen"
        totalItems={totalPagesCount}
        currentPage={page}
        loadingData={loadingPlans}
      />
    </>
  )
}
