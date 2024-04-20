import React, { useEffect, useState } from "react"
import { useLocation, useParams } from "react-router-dom"
import { Breadcrumbs, Card, Grid, Image, Modal } from "@mantine/core"
import { useDisclosure } from "@mantine/hooks"
import BaseLayout from "../../components/BaseLayout"
import BackButton from "../Dishes/components/BackButton"
import BreadCrumbNavigation from "../../components/BreadCrumbNavigation"
import plansApi from "../../api/plansApi"
import { formatDateDistanceToNow, getFormattedHNL } from "../../utils"

export const PlanDetails = () => {
  const { planId } = useParams()

  const [planDetails, setPlanDetails] = useState({})

  const [imageModalOpened, { open: openImageModal, close: closeImageModal }] = useDisclosure(false)
  const [formModalOpened, { open: openFormModal, close: closeFormModal }] = useDisclosure(false)

  useEffect(() => {
    ;(async () => {
      const response = await plansApi.getPlan(planId)

      setPlanDetails(response.data.plan)
    })()
  }, [])

  function getFeatureValue(feature) {
    if (feature?.type === "amount") {
      return feature?.PlanPlanFeatures?.quantity || "N/A" // Use PlanPlanFeatures.quantity if available, otherwise 'N/A'
    } else if (feature?.type === "boolean") {
      return feature?.PlanPlanFeatures?.available ? "Habilitado" : "Deshabilitado" // Translate based on availability
    }
    return "N/A" // Default for other cases
  }

  console.log(planDetails, "pl")

  return (
    <BaseLayout>
      <section>
        <div className="flex flex-row justify-between items-center pb-6">
          <BackButton title={planDetails?.name} />
          <div>
            <Breadcrumbs>
              <BreadCrumbNavigation location={location} dynamicRoute={planDetails?.name} />
            </Breadcrumbs>
          </div>
        </div>
      </section>
      <div className="flex flex-row w-full flex-wrap gap-2 xl:flex-nowrap">
        <section className="w-full xl:w-9/12 2xl:w-10/12 border border-blue-100 rounded-lg ">
          <Card padding="lg" radius="md">
            <section className="px-20">
              <Grid>
                <Grid.Col span={{ base: 12 }}>
                  <div className="flex w-full flex-col ">
                    <h1 className="h-full w-full pt-12  text-2xl font-semibold">{planDetails?.name}</h1>
                    <div className="flex w-full flex-row justify-between items-center">
                      <p className="text-zinc-500 text-sm font-medium pt-4">
                        {planDetails?.details || "Sin descripción disponible"}
                      </p>
                      <a
                        className="text-blue-600 text-base font-normal leading-normal cursor-pointer self-center"
                        onClick={() => {
                          openFormModal()
                        }}>
                        Editar
                      </a>
                    </div>
                  </div>
                </Grid.Col>
              </Grid>
            </section>
            <section className="px-20">
              <div className="pt-8">
                <span className="text-sky-950 text-base font-bold leading-normal">Tipo de plan</span>
                <p className="text-zinc-500 text-sm font-medium py-2">{planDetails?.paymentType}</p>
                <span className="text-sky-950 text-base font-bold leading-normal">Precio </span>
                <p className="text-zinc-500 text-sm font-medium py-2">{getFormattedHNL(planDetails?.price)}</p>
                <span className="text-sky-950 text-base font-bold leading-normal">Impuestos </span>
                <p className="text-zinc-500 text-sm font-medium py-2">{getFormattedHNL(planDetails?.tax)}</p>
                <span className="text-sky-950 text-base font-bold leading-normal">Ultima actualización </span>
                <p className="text-zinc-500 text-sm font-medium py-2">{formatDateDistanceToNow(planDetails?.updatedAt)}</p>
                <span className="text-sky-950 text-base font-bold leading-normal">Características</span>
                <ul className="list-disc pl-4 pt-2">
                  {planDetails?.PlanFeatures?.map((feature) => (
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
            </section>
          </Card>
        </section>
      </div>
      <Modal
        opened={formModalOpened}
        onClose={closeFormModal}
        centered
        size={"xl"}
        radius={"lg"}
        overlayProps={{
          backgroundOpacity: 0.55,
          blur: 3
        }}>
        {/* <EditRestaurant close={closeFormModal} details={planDetails} restaurantId={restaurantId} /> */}
      </Modal>
    </BaseLayout>
  )
}
