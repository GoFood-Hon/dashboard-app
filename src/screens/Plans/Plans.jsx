import React, { useEffect, useState } from "react"
import { Breadcrumbs } from "@mantine/core"
import { useLocation, useNavigate } from "react-router-dom"
import BaseLayout from "../../components/BaseLayout"
import BreadCrumbNavigation from "../../components/BreadCrumbNavigation"
import Button from "../../components/Button"
import plansApi from "../../api/plansApi"
import toast from "react-hot-toast"
import MenuTable from "../Menu/MenuTable"
import { NAVIGATION_ROUTES_SUPER_ADMIN } from "../../routes"
import LoadingCircle from "../../components/LoadingCircle"

export const Plans = () => {
  const navigate = useNavigate()

  const location = useLocation()

  const [plans, setPlans] = useState([])
  const [cardsSelected, setCardsSelected] = useState([])
  const [isLoading, setIsLoading] = useState(false)

  const handleNewPlan = () => {
    navigate(NAVIGATION_ROUTES_SUPER_ADMIN.Plans.NewPlan.path)
  }

  //* Fetch plans data *//
  useEffect(() => {
    ;(async () => {
      try {
        const response = await plansApi.getAllPlans()

        if (response.error) {
          toast.error(`Fallo al obtener la lista de planes. Por favor intente de nuevo. ${response.message}`, {
            duration: 7000
          })
        } else {
          setPlans(response.data)
        }
      } catch (error) {
        toast.error(`Error. Por favor intente de nuevo. ${error}`, {
          duration: 7000
        })
      }
    })()
  }, [])

  const refreshPage = async () => {
    try {
      setIsLoading(true)
      const response = await plansApi.getAllPlans()

      if (response.error) {
        toast.error(`Fallo al obtener la lista de planes. Por favor intente de nuevo. ${response.message}`, {
          duration: 7000
        })
      } else {
        setPlans(response.data)
      }
    } catch (error) {
      toast.error(`Error. Por favor intente de nuevo. ${error}`, {
        duration: 7000
      })
    } finally {
      setIsLoading(false)
      setCardsSelected([])
    }
  }

  return (
    <BaseLayout>
      <section>
        <div className="flex flex-row justify-between items-center pb-6">
          <div className="flex flex-row gap-x-3 items-center">
            <h1 className="text-white-200 text-2xl font-semibold">Planes</h1>
            <Button text={"Nuevo Plan"} className={"text-white text-md px-3 py-2 bg-primary_button"} onClick={handleNewPlan} />
          </div>
          <div>
            <Breadcrumbs>
              <BreadCrumbNavigation location={location} />
            </Breadcrumbs>
          </div>
        </div>
      </section>
      <section>
        {isLoading ? (
          <div className="flex justify-center items-center">
            <LoadingCircle />
          </div>
        ) : plans && plans.length > 0 ? (
          <div className="w-full p-4 h-full bg-white rounded-2xl border border-blue-100">
            <MenuTable refreshPage={refreshPage} items={plans} screenType="planScreen" />
          </div>
        ) : (
          <div className="text-center mt-4 text-gray-500">Sin Plans disponibles!</div>
        )}
      </section>
    </BaseLayout>
  )
}
