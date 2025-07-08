import { useNavigate } from "react-router-dom"
import { useForm } from "react-hook-form"
import { GeneralInformationForm } from "./GeneralInformationForm"
import { NAVIGATION_ROUTES_SUPER_ADMIN } from "../../routes"
import { convertToDecimal } from "../../utils"
import { useSelector, useDispatch } from "react-redux"
import { createPlan } from "../../store/features/plansSlice"
import FormLayout from "../../components/Form/FormLayout"
import { Characteristics } from "./Characteristics"
import { newPlanSchema } from "../../utils/validationSchemas"
import { zodResolver } from "@hookform/resolvers/zod"

export const NewPlan = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const isLoading = useSelector((state) => state.plans.creatingPlan)
  const featuresList = useSelector((state) => state.plans.featuresList)

  const {
    register,
    handleSubmit,
    setValue,
    control,
    formState: { errors }
  } = useForm({ resolver: zodResolver(newPlanSchema) })

  const accordionStructure = [
    {
      title: "Información general",
      form: <GeneralInformationForm register={register} errors={errors} setValue={setValue} control={control} />
    },
    {
      title: "Características",
      form: <Characteristics register={register} errors={errors} control={control} />
    }
  ]

  const onSubmit = async (data) => {
    const features = featuresList.map((feature) => {
      const input = data.features?.[feature.id] || {}

      return {
        id: feature.id,
        ...(feature.type === "boolean" ? { available: Boolean(input.available) } : { quantity: parseInt(input.quantity) || 0 })
      }
    })

    const requestBody = {
      name: data.name,
      price: convertToDecimal(data.price),
      tax: convertToDecimal(data.tax),
      paymentType: data.paymentType,
      currency: data.currency,
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
    <form onSubmit={handleSubmit(onSubmit)}>
      <FormLayout
        title="Nuevo plan"
        show
        accordionTitles={["Información general", "Características"]}
        accordionStructure={accordionStructure}
        navigate={() => navigate(NAVIGATION_ROUTES_SUPER_ADMIN.Plans.path)}
        isLoading={isLoading}
      />
    </form>
  )
}
