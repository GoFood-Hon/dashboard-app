import React, { useEffect, useState } from "react"
import { Accordion, Flex, Paper, Button } from "@mantine/core"
import { useForm } from "react-hook-form"
import toast from "react-hot-toast"
import plansApi from "../../api/plansApi"
import { convertToDecimal } from "../../utils"
import { EditGeneralInformationForm } from "./EditGeneralInformationForm"
import { useNavigate, useParams } from "react-router-dom"
import { NAVIGATION_ROUTES_SUPER_ADMIN, SETTING_NAVIGATION_ROUTES } from "../../routes"
import BackButton from "../Dishes/components/BackButton"
import { colors } from "../../theme/colors"

export const EditPlan = () => {
  const { planId } = useParams()
  const navigate = useNavigate()
  const [planDetails, setPlanDetails] = useState({})
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    ;(async () => {
      try {
        const response = await plansApi.getPlan(planId)
        setPlanDetails(response.data.plan)
      } catch (error) {
        toast.error(`Fallo al obtener el plan. Por favor intente de nuevo. ${error}`, {
          duration: 7000
        })
      }
    })()
  }, [])

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    control,
    formState: { errors }
  } = useForm({ defaultValues: planDetails || {} })

  const [featuresList, setFeaturesList] = useState([])

  const accordionStructure = [
    {
      title: "Información general",
      requirement: "Obligatorio",
      form: (
        <EditGeneralInformationForm
          data={planDetails}
          register={register}
          errors={errors}
          setValue={setValue}
          control={control}
          featuresList={featuresList}
          setFeaturesList={setFeaturesList}
        />
      )
    }
  ]

  useEffect(() => {
    if (Object.keys(planDetails).length > 0) {
      reset(planDetails)
    }
    window.scrollTo(0, 0)
  }, [planDetails, reset])

  const items = accordionStructure.map((item, key) => (
    <Accordion.Item key={key} value={item.title}>
      <Accordion.Control>
        <div className="w-full rounded-lg flex-row flex items-center">
          <div
            className={`text-slate-50 text-base font-bold bg-[${colors.main_app_color}] rounded-full p-2 w-8 h-8 flex items-center justify-center`}>
            {key + 1}
          </div>
          <span className="text-base font-bold  leading-normal ml-4">{item.title}</span>
          <span className="text-base font-normal ml-1">({item?.requirement})</span>
        </div>
      </Accordion.Control>
      <Accordion.Panel>{item.form}</Accordion.Panel>
    </Accordion.Item>
  ))

  const handleResponse = (response) => {
    if (response.error) {
      toast.error(`Fallo al actualizar el plan. Por favor intente de nuevo. ${response.message}`, {
        duration: 7000
      })
    } else {
      navigate(NAVIGATION_ROUTES_SUPER_ADMIN.Plans.path)

      toast.success("Plan actualizado exitosamente", {
        duration: 7000
      })
    }
  }
  const handleError = (error) => {
    toast.error(`Error. Por favor intente de nuevo. ${error}`, {
      duration: 7000
    })
  }

  const onSubmit = async (data) => {
    setIsLoading(true)
    try {
      const planId = data.id

      const transformedData = {
        name: data.name,
        price: convertToDecimal(data.price),
        tax: convertToDecimal(data.tax),
        paymentType: data.paymentType,
        currency: data.currency,
        features: data.PlanFeatures.map((feature) => {
          const featureObj = {}
          featureObj.id = feature.id
          if (feature.featureCode === "quantity-menu" || feature.featureCode === "quantity-sucursals") {
            featureObj.quantity = feature.PlanPlanFeatures.quantity
          } else {
            featureObj.available = feature.PlanPlanFeatures.available
          }
          return featureObj
        })
      }

      const response = plansApi.updatePlan(planId, transformedData)
      handleResponse(response)

      return response.data
    } catch (error) {
      handleError(error)
    }
    setIsLoading(false)
  }

  return (
    <>
      <section>
        <div className="flex flex-row justify-between items-center pb-6">
          <BackButton title={planDetails?.name} show />
        </div>
      </section>
      <form onSubmit={handleSubmit(onSubmit)}>
        <section>
          <Accordion variant="separated" multiple defaultValue={["Información general"]}>
            {items}
          </Accordion>
        </section>
        <section>
          <Paper withBorder radius="md" className="w-full flex md:justify-end mt-6 md:gap-3 rounded-md px-8 py-5">
            <Flex justify="end" gap="xs">
              <Button
                color={colors.main_app_color}
                variant="outline"
                onClick={() => {
                  navigate(NAVIGATION_ROUTES_SUPER_ADMIN.Plans.path)
                }}>
                Descartar
              </Button>
              <Button loading={isLoading} color={colors.main_app_color} type="submit">
                Actualizar
              </Button>
            </Flex>
          </Paper>
        </section>
      </form>
    </>
  )
}
