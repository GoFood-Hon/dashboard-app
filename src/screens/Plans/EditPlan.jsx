import React, { useEffect, useState } from "react"
import { Accordion } from "@mantine/core"
import { useForm } from "react-hook-form"
import toast from "react-hot-toast"
import plansApi from "../../api/plansApi"
import { convertToDecimal } from "../../utils"
import { useNavigate, useParams } from "react-router-dom"
import { NAVIGATION_ROUTES_SUPER_ADMIN } from "../../routes"
import { colors } from "../../theme/colors"
import { EditGeneralInformationForm } from "./EditGeneralInformationForm"
import { updatePlanData } from "../../store/features/plansSlice"
import { useSelector } from "react-redux"
import { useDispatch } from "react-redux"
import FormLayout from "../../components/Form/FormLayout"

export const EditPlan = () => {
  const { planId } = useParams()
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [planDetails, setPlanDetails] = useState({})
  const isLoading = useSelector((state) => state.plans.updatingPlan)

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

  const onSubmit = async (data) => {
    const planId = data.id

    const transformedData = {
      name: data.name,
      price: convertToDecimal(data.price),
      tax: convertToDecimal(data.tax),
      paymentType: data.paymentType,
      currency: data.currency,
      features: data.PlanFeatures.filter((feature) => !data.featureIds || data.featureIds.includes(feature.id)).map((feature) => {
        const featureObj = { id: feature.id }

        if (feature.featureCode === "quantity-menu") {
          featureObj.quantity = parseInt(data["quantity-menu"])
        } else if (feature.featureCode === "quantity-sucursals") {
          featureObj.quantity = parseInt(data["quantity-sucursals"])
        } else {
          featureObj.available = feature.PlanPlanFeatures.available
        }

        return featureObj
      })
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
      <form onSubmit={handleSubmit(onSubmit)}>
        <FormLayout
          title={planDetails?.name}
          show
          accordionTitles={["Información general"]}
          accordionStructure={accordionStructure}
          navigate={() => navigate(NAVIGATION_ROUTES_SUPER_ADMIN.Plans.path)}
          isLoading={isLoading}
          update
        />
      </form>
    </>
  )
}
