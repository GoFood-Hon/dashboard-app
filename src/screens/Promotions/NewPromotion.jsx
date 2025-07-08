import { useForm } from "react-hook-form"
import { GeneralInformationForm } from "./GeneralInformationForm"
import FormLayout from "../../components/Form/FormLayout"
import { SETTING_NAVIGATION_ROUTES } from "../../routes"
import { useSelector } from "react-redux"
import { createOffer } from "../../store/features/promotionsSlice"
import { useDispatch } from "react-redux"
import { useNavigate } from "react-router-dom"
import { newPromotionSchema } from "../../utils/validationSchemas"
import { zodResolver } from "@hookform/resolvers/zod"

export const NewPromotion = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { creatingPromotions } = useSelector((state) => state.promotions)

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
    control,
    watch
  } = useForm({
    resolver: zodResolver(newPromotionSchema),
    defaultValues: {
      allDishes: "all",
      category: "porcentual",
      percentage: "5",
      Dishes: [],
      startDate: new Date(),
      endDate: new Date()
    }
  })

  const accordionStructure = [
    {
      title: "Información general",
      requirement: "Obligatorio",
      form: <GeneralInformationForm register={register} errors={errors} setValue={setValue} control={control} watch={watch} />
    }
  ]

  const onSubmit = async (data) => {
    const formData = new FormData()
    formData.append("title", data.title)
    formData.append("minPurchase", data.minPurchase.includes(".00") ? data.minPurchase : data.minPurchase.concat(".00"))
    formData.append("category", data.category)
    data.category === "porcentual"
      ? formData.append("percentage", data.percentage)
      : formData.append("amount", data.amount.includes(".00") ? data.amount : data.amount.concat(".00"))
    formData.append("startDate", data.startDate)
    formData.append("endDate", data.endDate)
    formData.append("allDishes", data.allDishes === "all" ? true : false)

    const formDataImage = new FormData()
    formDataImage.append("files", data.files[0])


    dispatch(createOffer({ params: formData, imageParams: formDataImage, dishes: data?.allDishes === "some" ? data?.Dishes : [] }))
      .unwrap()
      .then(() => {
        navigate(SETTING_NAVIGATION_ROUTES.Promotions.path)
      })
      .catch((error) => {
        console.error("Error creating promotion:", error)
      })
  }

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        <FormLayout
          title="Nueva promoción"
          show
          accordionTitles={["Información general"]}
          accordionStructure={accordionStructure}
          navigate={() => navigate(SETTING_NAVIGATION_ROUTES.Promotions.path)}
          isLoading={creatingPromotions}
        />
      </form>
    </>
  )
}
