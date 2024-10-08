import React, { useEffect } from "react"
import { useNavigate } from "react-router-dom"
// import Button from "../../components/Button"
import MenuTable from "../Menu/MenuTable"
import { NAVIGATION_ROUTES_SUPER_ADMIN } from "../../routes"
import { useDispatch, useSelector } from "react-redux"
import { fetchAllPlans } from "../../store/features/plansSlice"
import { TableSkeleton } from "../../components/Skeletons/TableSkeleton"
import { Paper, Button } from "@mantine/core"
import { colors } from "../../theme/colors"

export const Plans = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const { plans, isLoading } = useSelector((state) => state.plans)

  const handleNewPlan = () => {
    navigate(NAVIGATION_ROUTES_SUPER_ADMIN.Plans.NewPlan.path)
  }

  // Fetch plans data using Redux
  useEffect(() => {
    dispatch(fetchAllPlans())
  }, [dispatch])

  const refreshPage = () => {
    dispatch(fetchAllPlans())
  }

  return (
    <>
      <section className="mb-3">
        <div className="flex flex-row justify-between items-center ">
          <h1 className="text-white-200 text-2xl font-semibold">Planes</h1>
          <Button color={colors.main_app_color} onClick={handleNewPlan}>
            Nuevo
          </Button>
        </div>
      </section>
      <section>
        <Paper withBorder p="md" radius="md">
          <MenuTable refreshPage={refreshPage} items={plans} screenType="planScreen" loadingData={isLoading} />
        </Paper>
      </section>
    </>
  )
}
