import React, { useState } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import { Breadcrumbs, Accordion } from "@mantine/core"
import { useForm } from "react-hook-form"
import toast from "react-hot-toast"
import { GeneralInformationForm } from "./GeneralInformationForm"
import BaseLayout from "../../components/BaseLayout"
import BackButton from "../Dishes/components/BackButton"
import BreadCrumbNavigation from "../../components/BreadCrumbNavigation"
import Button from "../../components/Button"

import { NAVIGATION_ROUTES_SUPER_ADMIN } from "../../routes"
import { DEFAULT_CURRENCY, DEFAULT_PAYMENT_TYPE } from "../../utils/constants"
import plansApi from "../../api/plansApi"
import { convertToDecimal } from "../../utils"

export const NewPlan = () => {
  const location = useLocation()
  const navigate = useNavigate()

  const {
    register,
    handleSubmit,
    setValue,
    control,
    reset,
    formState: { errors }
  } = useForm({})

  const [featuresList, setFeaturesList] = useState([])

  const accordionStructure = [
    {
      title: "Información general",
      requirement: "Obligatorio",
      form: (
        <GeneralInformationForm
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

  const handleError = (error) => {
    toast.error(`Error. Por favor intente de nuevo. ${error}`, {
      duration: 7000
    })
  }

  const handleResponse = (response) => {
    if (response.error) {
      toast.error(`Fallo al crear el plan. Por favor intente de nuevo. ${response.message}`, {
        duration: 7000
      })
    } else {
      navigate(NAVIGATION_ROUTES_SUPER_ADMIN.Plans.path)
      toast.success("Plan creado exitosamente", {
        duration: 7000
      })
    }
  }
  const onSubmit = async (data) => {
    try {
      const features = featuresList
        .map((feature) => {
          if (data.featureIds.includes(feature.id)) {
            if (feature.type === "amount") {
              return { id: feature.id, quantity: parseInt(data[feature.featureCode]) || 0 }
            } else if (feature.type === "boolean") {
              return { id: feature.id, available: true }
            }
          }
          return null
        })
        .filter((feature) => feature !== null)

      const requestBody = JSON.stringify({
        name: data.name,
        price: convertToDecimal(data.price),
        tax: convertToDecimal(data.tax),
        paymentType: data.paymentType ?? DEFAULT_PAYMENT_TYPE,
        currency: data.currency ?? DEFAULT_CURRENCY,
        features
      })

      const response = await plansApi.createPlan(requestBody)
      handleResponse(response)
    } catch (error) {
      handleError(error)
    }
  }

  return (
    <BaseLayout>
      <form onSubmit={handleSubmit(onSubmit)}>
        <section>
          <div className="flex flex-row justify-between items-center pb-6 flex-wrap xs:gap-3">
            <BackButton title="Nuevo plan" />
          </div>
        </section>
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
                onClick={() => {
                  reset()
                  navigate(NAVIGATION_ROUTES_SUPER_ADMIN.Plans.path)
                }}
              />
              <Button
                text={"Guardar"}
                className="w-24 flex h-10 items-center justify-center rounded-md shadow-sm transition-all duration-700 focus:outline-none text-xs bg-sky-950 text-slate-50"
              />
            </div>
          </div>
        </section>
      </form>
    </BaseLayout>
  )
}
