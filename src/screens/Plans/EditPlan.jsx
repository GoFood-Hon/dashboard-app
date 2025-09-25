import React, { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import plansApi from "../../api/plansApi"
import { convertToDecimal } from "../../utils"
import { useNavigate, useParams } from "react-router-dom"
import { NAVIGATION_ROUTES_SUPER_ADMIN } from "../../routes"
import { EditGeneralInformationForm } from "./EditGeneralInformationForm"
import { updatePlanData } from "../../store/features/plansSlice"
import { useSelector } from "react-redux"
import { useDispatch } from "react-redux"
import FormLayout from "../../components/Form/FormLayout"
import { Characteristics } from "./Characteristics"
import { showNotification } from "@mantine/notifications"
import { zodResolver } from "@hookform/resolvers/zod"
import { newPlanSchema } from "../../utils/validationSchemas"
import { LoadingPage } from "../../components/LoadingPage"

export const EditPlan = () => {
  const { planId } = useParams()
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [planDetails, setPlanDetails] = useState({})
  const isLoading = useSelector((state) => state.plans.updatingPlan)
  const featuresList = useSelector((state) => state.plans.featuresList)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    ;(async () => {
      setLoading(true)
      try {
        const response = await plansApi.getPlan(planId)
        setPlanDetails(response.data.plan)
      } catch (error) {
        showNotification({
          title: "Error",
          message: "Fallo al obtener el plan. Por favor intente de nuevo.",
          color: "red",
          duration: 7000
        })
      } finally {
        setLoading(false)
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
  } = useForm({ resolver: zodResolver(newPlanSchema), defaultValues: planDetails || {} })

  const accordionStructure = [
    {
      title: "Información general",
      form: (
        <EditGeneralInformationForm
          data={planDetails}
          register={register}
          errors={errors}
          setValue={setValue}
          control={control}
        />
      )
    },
    {
      title: "Características",
      form: (
        <Characteristics
          register={register}
          errors={errors}
          control={control}
          setValue={setValue}
          defaultFeatures={planDetails.PlanFeatures}
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

  const onSubmit = async (data) => {
    const features = featuresList.map((feature) => {
      const input = data.features?.[feature.id] || {}

      return {
        id: feature.id,
        ...(feature.type === "boolean" ? { available: Boolean(input.available) } : { quantity: parseInt(input.quantity) || 0 })
      }
    })

    const transformedData = {
      name: data.name,
      price: convertToDecimal(data.price),
      tax: convertToDecimal(data.tax),
      paymentType: data.paymentType,
      currency: data.currency,
      features
    }

    dispatch(updatePlanData({ id: planId, params: transformedData }))
      .unwrap()
      .then(() => {
        navigate(NAVIGATION_ROUTES_SUPER_ADMIN.Plans.path)
      })
      .catch((error) => {
        console.error("Error updating plan:", error)
      })
  }

  return (
    <>
      {loading ? (
        <LoadingPage />
      ) : (
        <form onSubmit={handleSubmit(onSubmit)}>
          <FormLayout
            title={planDetails?.name}
            show
            accordionTitles={["Información general", "Características"]}
            accordionStructure={accordionStructure}
            navigate={() => navigate(NAVIGATION_ROUTES_SUPER_ADMIN.Plans.path)}
            isLoading={isLoading}
            update
          />
        </form>
      )}
    </>
  )
}
