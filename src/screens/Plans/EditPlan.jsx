import React, { useState } from "react"
import { Accordion } from "@mantine/core"
import { useForm } from "react-hook-form"
import toast from "react-hot-toast"

import Button from "../../components/Button"
import plansApi from "../../api/plansApi"
import { convertToDecimal } from "../../utils"
import { EditGeneralInformationForm } from "./EditGeneralInformationForm"
import { useNavigate } from "react-router-dom"
import { NAVIGATION_ROUTES_SUPER_ADMIN, SETTING_NAVIGATION_ROUTES } from "../../routes"

export const EditPlan = ({ closeFormModal, data }) => {
  const navigate = useNavigate()

  const {
    register,
    handleSubmit,
    setValue,
    control,
    formState: { errors }
  } = useForm({ defaultValues: data })

  const [featuresList, setFeaturesList] = useState([])

  const accordionStructure = [
    {
      title: "Información general",
      requirement: "Obligatorio",
      form: (
        <EditGeneralInformationForm
          data={data}
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
  }

  return (
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
            <Button
              text={"Descartar"}
              className={"text-xs border border-red-400 text-red-400 bg-white"}
              onClick={closeFormModal}
            />
            <Button
              text={"Guardar Plan"}
              className="flex h-10 w-full items-center justify-center px-4 rounded-md shadow-sm transition-all duration-700 focus:outline-none text-xs bg-sky-950 text-slate-50"
            />
          </div>
        </div>
      </section>
    </form>
  )
}
