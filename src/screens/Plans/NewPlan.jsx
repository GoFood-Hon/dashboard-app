import React, { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useForm } from "react-hook-form"
import { GeneralInformationForm } from "./GeneralInformationForm"
import { NAVIGATION_ROUTES_SUPER_ADMIN } from "../../routes"
import { DEFAULT_CURRENCY } from "../../utils/constants"
import { convertToDecimal } from "../../utils"
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

  const onSubmit = async (data) => {
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
          accordionStructure={accordionStructure}
          navigate={() => navigate(NAVIGATION_ROUTES_SUPER_ADMIN.Plans.path)}
          isLoading={isLoading}
        />
      </form>
    </>
  )
}
