import React, { useEffect } from "react"
import { useNavigate } from "react-router-dom"
import MenuTable from "../Menu/MenuTable"
import { NAVIGATION_ROUTES_SUPER_ADMIN } from "../../routes"
import { useDispatch, useSelector } from "react-redux"
import { fetchAllPlans } from "../../store/features/plansSlice"
import { Paper, Button, Group, Flex, Title, Text } from "@mantine/core"
import { colors } from "../../theme/colors"
import TableViewLayout from "../TableViewLayout"

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
      <TableViewLayout
        title="Planes"
        page={page}
        limit={limit}
        totalElements={totalPlans}
        onNewItemClick={handleNewPlan}
        items={plans}
        tableStructure="planScreen"
        totalItems={totalPagesCount}
        loading={loadingPlans}
        setPage={(newPage) => dispatch(setCurrentPage(newPage))}
      />
    </>
  )
}
