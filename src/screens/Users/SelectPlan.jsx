import { Card, Grid } from "@mantine/core"
import React, { useEffect, useState } from "react"
import Button from "../../components/Button"
import { formatDateDistanceToNow, getFormattedHNL } from "../../utils"
import plansApi from "../../api/plansApi"
import toast from "react-hot-toast"

export const SelectPlan = ({ restaurantId }) => {
  const [plans, setPlans] = useState([])

  useEffect(() => {
    ;(async () => {
      const response = await plansApi.getAllPlans()

      if (response.error) {
        toast.error(`Fallo al obtener la lista de planes. Por favor intente de nuevo. ${response.message}`, {
          duration: 7000
        })
      } else {
        setPlans(response?.data)
      }
    })()
  }, [])

  const onSubmit = async (planId) => {
    try {
      const response = await plansApi.assignPlan({
        restaurantId,
        planId
      })

      if (response.error) {
        toast.error(`Fallo al asignar el plan. Por favor intente de nuevo. ${response.message}`, {
          duration: 7000
        })
      } else {
        toast.success("Plan asignado exitosamente", {
          duration: 7000
        })
      }
    } catch (error) {
      toast.error(`Error. Por favor intente de nuevo. ${error}`, {
        duration: 7000
      })
    }
  }

  return (
    <section className="w-full border border-blue-100 rounded-lg">
      <Card padding="lg" radius="md">
        <section className="px-20">
          <Grid>
            {plans.map((plan, index) => (
              <Grid.Col span={{ base: 6 }} key={index}>
                <div className="border-2 border-blue-100 rounded-md p-4 h-full w-full flex flex-col justify-between">
                  <div className="flex w-full flex-col">
                    <h1 className="h-full w-full pt-4 text-2xl font-semibold">{plan?.name}</h1>
                    <div className="flex w-full flex-row justify-between items-center">
                      <p className="text-zinc-500 text-sm font-medium  pt-4">{plan?.details || "Sin descripción disponible"}</p>
                    </div>
                  </div>
                  <div className="py-8">
                    <span className="text-sky-950 text-base font-bold leading-normal">Tipo de plan</span>
                    <p className="text-zinc-500 text-sm font-medium py-2">{plan?.paymentType}</p>
                    <span className="text-sky-950 text-base font-bold leading-normal">Precio </span>
                    <p className="text-zinc-500 text-sm font-medium py-2">{getFormattedHNL(plan?.price)}</p>
                    <span className="text-sky-950 text-base font-bold leading-normal">Impuestos </span>
                    <p className="text-zinc-500 text-sm font-medium py-2">{getFormattedHNL(plan?.tax)}</p>
                    <span className="text-sky-950 text-base font-bold leading-normal">Ultima actualización </span>
                    <p className="text-zinc-500 text-sm font-medium py-2">{formatDateDistanceToNow(plan?.updatedAt)}</p>
                    <span className="text-sky-950 text-base font-bold leading-normal">Características</span>
                    <ul className="list-disc pl-4 pt-2">
                      {plan?.PlanFeatures?.map((feature) => (
                        <li key={feature.id} className="text-zinc-500 text-sm py-1">
                          <span className="font-bold">{feature.name}:</span>
                          {feature.type === "amount" && feature.PlanPlanFeatures?.quantity ? (
                            <span className="ml-2">{feature.PlanPlanFeatures.quantity}</span>
                          ) : (
                            <span className="ml-2">{feature.PlanPlanFeatures?.available ? "Habilitado" : "Deshabilitado"}</span>
                          )}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <Button
                    text={"Elegir Plan"}
                    className={"text-white text-md px-3 py-2 bg-primary_button"}
                    onClick={() => onSubmit(plan.id)}
                  />
                </div>
              </Grid.Col>
            ))}
            {plans.length === 0 && (
              <div className="flex w-full flex-col">
                <h1 className="h-full w-full p-12 text-2xl font-semibold text-sky-950">No hay planes disponibles</h1>
              </div>
            )}
          </Grid>
        </section>
      </Card>
    </section>
  )
}
