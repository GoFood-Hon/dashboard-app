import React, { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Accordion } from "@mantine/core"
import { useForm } from "react-hook-form"
import { GeneralInformationForm } from "./GeneralInformationForm"
import { NAVIGATION_ROUTES_SUPER_ADMIN } from "../../routes"
import { DEFAULT_CURRENCY } from "../../utils/constants"
import { convertToDecimal } from "../../utils"
import { colors } from "../../theme/colors"
import { useSelector } from "react-redux"
import { createPlan } from "../../store/features/plansSlice"
import { useDispatch } from "react-redux"
import FormLayout from "../../components/Form/FormLayout"

export const NewPlan = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const isLoading = useSelector((state) => state.plans.creatingPlan)

  const {
    register,
    handleSubmit,
    setValue,
    control,
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

  const onSubmit = async (data) => {
    console.log(data)
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
      paymentType: data.paymentType,
      currency: data.currency ?? DEFAULT_CURRENCY,
      features
    }

    dispatch(createPlan({ params: requestBody }))
      .unwrap()
      .then(() => {
        navigate(NAVIGATION_ROUTES_SUPER_ADMIN.Plans.path)
      })
      .catch((error) => {
        console.error("Error creating plan:", error)
      })
  }

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        <FormLayout
          title="Nuevo plan"
          show
          accordionTitles={["Información general"]}
          accordionItems={items}
          navigate={() => navigate(NAVIGATION_ROUTES_SUPER_ADMIN.Plans.path)}
          isLoading={isLoading}
        />
      </form>
    </>
  )
}
