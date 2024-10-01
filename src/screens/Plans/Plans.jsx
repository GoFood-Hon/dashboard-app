import React, { useEffect } from "react"
import { useNavigate } from "react-router-dom"
import Button from "../../components/Button"
import MenuTable from "../Menu/MenuTable"
import { NAVIGATION_ROUTES_SUPER_ADMIN } from "../../routes"
import { useDispatch, useSelector } from "react-redux"
import { fetchAllPlans } from "../../store/features/plansSlice"
import { TableSkeleton } from "../../components/Skeletons/TableSkeleton"

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
      <section>
        <div className="flex flex-row justify-between items-center pb-6">
          <h1 className="text-white-200 text-2xl font-semibold">Planes</h1>
          <Button text={"Nuevo"} className={"text-white text-md px-3 py-2 bg-primary_button"} onClick={handleNewPlan} />
        </div>
      </section>
      <section>
        {isLoading ? (
          <TableSkeleton />
        ) : plans && plans.length > 0 ? (
          <div className="w-full p-4 h-full bg-white rounded-2xl border border-blue-100">
            <MenuTable refreshPage={refreshPage} items={plans} screenType="planScreen" />
          </div>
        ) : (
          <div className="text-center mt-4 text-gray-500">No hay planes para mostrar</div>
        )}
      </section>
    </>
  )
}
