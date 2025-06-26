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
import { restaurantSchema } from "../../utils/validationSchemas"
import { showNotification } from "@mantine/notifications"
import { zodResolver } from "@hookform/resolvers/zod"
import { SocialMediaInformation } from "./SocialMediaInformation"

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
    resolver: zodResolver(restaurantSchema),
    defaultValues: {
      bannerDishes: [],
      files: [],
      cuisineTypeId: ""
    }
  })

  const onSubmit = async (data) => {
    const validatedData = data

    try {
      const formData = new FormData()
      formData.append("name", validatedData.name)
      formData.append("email", validatedData.email)
      formData.append(
        "phoneNumber",
        validatedData.phoneNumber.startsWith("+504") ? validatedData.phoneNumber : `+504${validatedData.phoneNumber}`
      )
      formData.append("socialReason", validatedData.socialReason)
      formData.append("rtn", validatedData.rtn)
      formData.append("billingAddress", validatedData.billingAddress)
      formData.append("cai", validatedData.cai)
      formData.append("shippingFree", validatedData.shippingFree ?? true)
      formData.append("cuisineTypeId", validatedData.cuisineTypeId ?? "")
      formData.append("clinpaysCommerceToken", validatedData.clinpaysCommerceToken ?? "")

      if (validatedData.pricePerChair) {
        formData.append("pricePerChair", validatedData.pricePerChair)
      }
      if (validatedData.hoursBeforeCancellation) {
        formData.append("hoursBeforeCancellation", validatedData.hoursBeforeCancellation)
      }
      if (validatedData.hoursBeforeBooking) {
        formData.append("hoursBeforeBooking", validatedData.hoursBeforeBooking)
      }

      if (validatedData.shippingFree !== true && validatedData.shippingPrice) {
        formData.append("shippingPrice", convertToDecimal(validatedData.shippingPrice))
      }

      formData.append("whatsapp", data.whatsapp ?? null)
      formData.append("facebook", data.facebook ?? null)
      formData.append("instagram", data.instagram ?? null)
      formData.append("website", data.website ?? null)

      const formDataImage = new FormData()
      formDataImage.append("files", validatedData.files[0] || [])

      const formDataBanner = new FormData()
      formDataBanner.append("files", validatedData.bannerDishes[0] || [])

      dispatch(
        createRestaurant({
          params: formData,
          imageParams: formDataImage,
          formDataBanner
        })
      )
        .unwrap()
        .then(() => {
          navigate(NAVIGATION_ROUTES_SUPER_ADMIN.Restaurants.path)
        })
        .catch((error) => {
          console.error("Error creando restaurante:", error)
          showNotification({
            title: "Error",
            message: "Hubo un problema al crear el restaurante",
            color: "red"
          })
        })
    } catch (err) {
      console.error("Error inesperado:", err)
      showNotification({
        title: "Error",
        message: "Ocurrió un error inesperado",
        color: "red"
      })
    }
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
