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
import { yupResolver } from "@hookform/resolvers/yup"
import * as yup from "yup"
import { restaurantValidation } from "../../utils/inputRules"

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
  } = useForm()

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
    formData.append("clinpaysCommerceToken", data.clinpaysCommerceToken ?? null)
    if (data.pricePerChair) {
      formData.append("pricePerChair", data.pricePerChair)
    }
    if (data.hoursBeforeCancellation) {
      formData.append("hoursBeforeCancellation", data.hoursBeforeCancellation)
    }
    if (data.hoursBeforeBooking) {
      formData.append("hoursBeforeBooking", data.hoursBeforeBooking)
    }
    if (data.shippingFree !== null) {
      formData.append("shippingPrice", convertToDecimal(data.shippingPrice))
    }

    const formDataObject = {}
    formData.forEach((value, key) => {
      formDataObject[key] = value
    })

    const formDataImage = new FormData()
    formDataImage.append("files", data.files[0])

    const formDataBanner = new FormData()
    formDataBanner.append("files", data.bannerDishes[0])

    dispatch(createRestaurant({ params: formData, imageParams: formDataImage, formDataBanner }))
      .unwrap()
      .then(() => {
        navigate(NAVIGATION_ROUTES_SUPER_ADMIN.Restaurants.path)
      })
      .catch((error) => {
        console.error("Error creating restaurant:", error)
      })
  }

  const accordionStructure = [
    {
      title: "Añadir banner",
      requirement: "Obligatorio",
      form: <RestaurantBanner register={register} errors={errors} setValue={setValue} control={control} watch={watch} />
    },
    {
      title: "Información general",
      requirement: "Obligatorio",
      form: <GeneralInformationForm register={register} errors={errors} setValue={setValue} control={control} watch={watch} />
    },
    {
      title: "Datos de reservación",
      requirement: "Opcional",
      form: <BookingInformation register={register} errors={errors} setValue={setValue} control={control} />
    }
  ]

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        <FormLayout
          title="Nuevo restaurante"
          show
          accordionStructure={accordionStructure}
          accordionTitles={["Añadir banner", "Información general", "Datos de reservación"]}
          navigate={() => navigate(NAVIGATION_ROUTES_SUPER_ADMIN.Restaurants.path)}
          isLoading={isLoading}
        />
      </form>
    </>
  )
}
