import { useForm } from "react-hook-form"
import { GeneralInformationForm } from "./GeneralInformationForm"
import FormLayout from "../../components/Form/FormLayout"
import { SETTING_NAVIGATION_ROUTES } from "../../routes"
import { useSelector } from "react-redux"
import { updateOffer } from "../../store/features/promotionsSlice"
import { useDispatch } from "react-redux"
import { useNavigate } from "react-router-dom"
import { zodResolver } from "@hookform/resolvers/zod"
import { editPromotionSchema } from "../../utils/validationSchemas"
import { toISOWithHNOffset } from "../../utils"

export const EditPromotion = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { selectedPromotion, updatingPromotions } = useSelector((state) => state.promotions)

  const {
    register,
    handleSubmit,
    setValue,
    control,
    watch,
    formState: { errors }
  } = useForm({
    resolver: zodResolver(editPromotionSchema),
    defaultValues: {
      ...selectedPromotion,
      allDishes: selectedPromotion?.allDishes === true ? "all" : "some",
      category: selectedPromotion?.category || "porcentual",
      percentage: selectedPromotion?.percentage?.toString() || "5",
      Dishes: selectedPromotion?.Dishes
    }
  })

  const imageLocation = watch("images[0].location")

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
          watch={watch}
          image={imageLocation}
          offersData={selectedPromotion}
          update
        />
      )
    }
  ]

  const formatDishes = (dishes) => {
    if (Array.isArray(dishes) && dishes.every((item) => typeof item === "object" && item !== null && "id" in item)) {
      return dishes.map((item) => item.id)
    }
    return dishes
  }

  const onSubmit = (data) => {
    const formData = new FormData()

    formData.append("title", data.title)
    formData.append("minPurchase", data.minPurchase.includes(".00") ? data.minPurchase : data.minPurchase.concat(".00"))

    if (data.category === "porcentual") {
      formData.append("percentage", data.percentage)
    } else {
      formData.append("amount", data.amount.includes(".00") ? data.amount : data.amount.concat(".00"))
    }

    formData.append("startDate", toISOWithHNOffset(data.startDate))
    formData.append("endDate", toISOWithHNOffset(data.endDate))

    let formDataImage = null
    if (data?.files?.[0]) {
      formDataImage = new FormData()
      formDataImage.append("files", data.files[0])
    }

    const formattedDishes = data.allDishes === "some" ? formatDishes(data.Dishes) : []

    dispatch(
      updateOffer({
        promotionId: selectedPromotion.id,
        params: formData,
        imageParams: formDataImage,
        dishes: formattedDishes
      })
    )
      .unwrap()
      .then(() => {
        navigate(SETTING_NAVIGATION_ROUTES.Promotions.path)
      })
      .catch((error) => {
        console.error("Error updating promotion:", error)
      })
  }

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        <FormLayout
          title={selectedPromotion?.title}
          show
          accordionTitles={["Información general"]}
          accordionStructure={accordionStructure}
          navigate={() => navigate(SETTING_NAVIGATION_ROUTES.Promotions.path)}
          isLoading={updatingPromotions}
          update
        />
      </form>
    </>
  )
}
