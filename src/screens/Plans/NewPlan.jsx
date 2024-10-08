import React, { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Accordion, Flex, Paper, Button } from "@mantine/core"
import { useForm } from "react-hook-form"
import toast from "react-hot-toast"
import { GeneralInformationForm } from "./GeneralInformationForm"
import BackButton from "../Dishes/components/BackButton"
import { NAVIGATION_ROUTES_SUPER_ADMIN } from "../../routes"
import { DEFAULT_CURRENCY, DEFAULT_PAYMENT_TYPE } from "../../utils/constants"
import plansApi from "../../api/plansApi"
import { convertToDecimal } from "../../utils"
import { colors } from "../../theme/colors"

export const NewPlan = () => {
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(false)

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
    setIsLoading(true)
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

      const requestBody = {
        name: data.name,
        price: convertToDecimal(data.price),
        tax: convertToDecimal(data.tax),
        paymentType: data.paymentType ?? DEFAULT_PAYMENT_TYPE,
        currency: data.currency ?? DEFAULT_CURRENCY,
        features
      }

      const response = await plansApi.createPlan(requestBody)
      handleResponse(response)
    } catch (error) {
      handleError(error)
    }
    setIsLoading(false)
  }

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        <section>
          <div className="flex flex-row justify-between items-center pb-6 flex-wrap xs:gap-3">
            <BackButton title="Nuevo plan" show />
          </div>
        </section>
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
                  reset()
                  navigate(NAVIGATION_ROUTES_SUPER_ADMIN.Restaurants.path)
                }}>
                Descartar
              </Button>
              <Button loading={isLoading} color={colors.main_app_color} type="submit">
                Guardar
              </Button>
            </Flex>
          </Paper>
        </section>
      </form>
    </>
  )
}
