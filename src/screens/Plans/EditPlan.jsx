import React, { useEffect, useState } from "react"
import { Accordion } from "@mantine/core"
import { useForm } from "react-hook-form"
import toast from "react-hot-toast"
import Button from "../../components/Button"
import plansApi from "../../api/plansApi"
import { convertToDecimal } from "../../utils"
import { EditGeneralInformationForm } from "./EditGeneralInformationForm"
import { useNavigate, useParams } from "react-router-dom"
import { NAVIGATION_ROUTES_SUPER_ADMIN, SETTING_NAVIGATION_ROUTES } from "../../routes"
import BaseLayout from "../../components/BaseLayout"
import BackButton from "../Dishes/components/BackButton"

export const EditPlan = () => {
  const { planId } = useParams()
  const navigate = useNavigate()
  const [planDetails, setPlanDetails] = useState({})

  useEffect(() => {
    ;(async () => {
      try {
        const response = await plansApi.getPlan(planId)
        console.log(response)
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
        <div className="w-full rounded-lg flex-row flex items-center bg-white">
          <div className="text-slate-50 text-base font-bold bg-sky-950 rounded-full p-2 w-8 h-8 flex items-center justify-center">
            {key + 1}
          </div>
          <span className="text-sky-950 text-base font-bold  leading-normal ml-4">{item.title}</span>
          <span className="text-sky-950 text-base font-normal ml-1">({item?.requirement})</span>
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
    console.log(data)
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

      console.log(transformedData)

      // const response = plansApi.updatePlan(planId, transformedData)
      // handleResponse(response)

      // return response.data 
    } catch (error) {
      handleError(error)
    }
  }

  return (
    <BaseLayout>
      <section>
        <div className="flex flex-row justify-between items-center pb-6">
          <BackButton title={planDetails?.name} />
        </div>
      </section>
      <form onSubmit={handleSubmit(onSubmit)}>
        <section>
          <Accordion
            variant="separated"
            multiple
            defaultValue={["Información general"]}
            classNames={{
              label: "bg-white fill-white"
            }}>
            {items}
          </Accordion>
        </section>
        <section>
          <div className="w-full flex md:justify-end mt-6 md:gap-3 rounded-md bg-white px-8 py-5 border border-gray-200">
            <div className="md:w-2/3 lg:1/3 sm:w-full flex flex-row justify-end gap-3 sm:flex-wrap md:flex-nowrap">
              <Button text={"Descartar"} className={"text-xs border border-red-400 text-red-400 bg-white"} />
              <Button
                text={"Actualizar"}
                className="w-24 flex h-10 items-center justify-center rounded-md shadow-sm transition-all duration-700 focus:outline-none text-xs bg-sky-950 text-slate-50"
              />
            </div>
          </div>
        </section>
      </form>
    </BaseLayout>
  )
}
