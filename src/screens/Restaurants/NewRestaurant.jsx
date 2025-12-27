import { useNavigate } from "react-router-dom"
import { useForm } from "react-hook-form"
import { GeneralInformationForm } from "./GeneralInformationForm"
import { NAVIGATION_ROUTES_SUPER_ADMIN } from "../../routes"
import { convertToDecimal } from "../../utils"
import BookingInformation from "./BookingInformation"
import { createRestaurant } from "../../store/features/restaurantSlice"
import { useDispatch } from "react-redux"
import { useSelector } from "react-redux"
import { RestaurantBanner } from "./RestaurantBanner"
import FormLayout from "../../components/Form/FormLayout"
import { showNotification } from "@mantine/notifications"
import { zodResolver } from "@hookform/resolvers/zod"
import { SocialMediaInformation } from "./SocialMediaInformation"
import { newRestaurantSchema } from "../../utils/validationSchemas"

export const NewRestaurant = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const isLoading = useSelector((state) => state.restaurants.creatingRestaurant)

  const {
    register,
    handleSubmit,
    setValue,
    control,
    watch,
    formState: { errors }
  } = useForm({
    resolver: zodResolver(newRestaurantSchema),
    defaultValues: {
      bannerDishes: [],
      files: [],
      cuisineTypeId: ""
    }
  })

  const onSubmit = async (data) => {
    const formData = new FormData()
    formData.append("name", data.name)
    formData.append("email", data.email)
    formData.append("phoneNumber", data.phoneNumber.startsWith("+504") ? data.phoneNumber : `+504${data.phoneNumber}`)
    formData.append("socialReason", data.socialReason)
    formData.append("rtn", data.rtn)
    formData.append("billingAddress", data.billingAddress)
    formData.append("cai", data.cai)
    formData.append("shippingFree", data.shippingFree ?? true)
    formData.append("cuisineTypeId", data.cuisineTypeId ?? "")
    formData.append("clinpaysCommerceToken", data.clinpaysCommerceToken ?? "")

    if (data.pricePerChair) {
      formData.append("pricePerChair", data.pricePerChair)
    }
    if (data.hoursBeforeCancellation) {
      formData.append("hoursBeforeCancellation", data.hoursBeforeCancellation)
    }
    if (data.hoursBeforeBooking) {
      formData.append("hoursBeforeBooking", data.hoursBeforeBooking)
    }

    if (data.shippingFree !== true && data.shippingPrice) {
      formData.append("shippingPrice", convertToDecimal(data.shippingPrice))
    }
    if (data.whatsapp) {
      formData.append("whatsapp", data.whatsapp.startsWith("+504") ? data.whatsapp : `+504${data.whatsapp}`)
    }
    if (data.facebook) {
      formData.append("facebook", data.facebook)
    }
    if (data.instagram) {
      formData.append("instagram", data.instagram)
    }
    if (data.website) {
      formData.append("website", data.website)
    }

    const formDataImage = new FormData()
    formDataImage.append("files", data.files[0] || [])

    const formDataBanner = new FormData()
    formDataBanner.append("files", data.bannerDishes[0] || [])

    dispatch(
      createRestaurant({
        params: formData,
        imageParams: formDataImage,
        formDataBanner
      })
    ).then((response) => {
      if (!response?.payload?.error) {
        navigate(NAVIGATION_ROUTES_SUPER_ADMIN.Restaurants.path)
      }
    })
  }

  const accordionStructure = [
    {
      title: "Añadir banner",
      form: <RestaurantBanner register={register} errors={errors} setValue={setValue} control={control} watch={watch} />
    },
    {
      title: "Información general",
      form: <GeneralInformationForm register={register} errors={errors} setValue={setValue} control={control} watch={watch} />
    },
    {
      title: "Datos de reservación",
      form: <BookingInformation register={register} errors={errors} setValue={setValue} control={control} />
    },
    {
      title: "Redes sociales",
      form: <SocialMediaInformation register={register} errors={errors} setValue={setValue} control={control} />
    }
  ]

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        <FormLayout
          title="Nuevo comercio"
          show
          accordionStructure={accordionStructure}
          accordionTitles={["Añadir banner", "Información general", "Datos de reservación", "Redes sociales"]}
          navigate={() => navigate(NAVIGATION_ROUTES_SUPER_ADMIN.Restaurants.path)}
          isLoading={isLoading}
        />
      </form>
    </>
  )
}
