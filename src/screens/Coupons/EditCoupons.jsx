import { useForm } from "react-hook-form"
import { GeneralInformationForm } from "./GeneralInformationForm"
import FormLayout from "../../components/Form/FormLayout"
import { SETTING_NAVIGATION_ROUTES } from "../../routes"
import { useSelector } from "react-redux"
import { useDispatch } from "react-redux"
import { useNavigate } from "react-router-dom"
import { updateCoupon } from "../../store/features/couponsSlice"
import { editCouponSchema } from "../../utils/validationSchemas"
import { zodResolver } from "@hookform/resolvers/zod"

export const EditCoupon = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { selectedCoupon, updatingCoupons } = useSelector((state) => state.coupons)

  const {
    register,
    handleSubmit,
    setValue,
    control,
    watch,
    formState: { errors }
  } = useForm({
    resolver: zodResolver(editCouponSchema),
    defaultValues: {
      ...selectedCoupon,
      couponType: selectedCoupon?.couponType || "fecha",
      category: selectedCoupon?.category || "porcentual",
      percentage: selectedCoupon?.percentage?.toString() || "5"
    }
  })

  console.log(errors)

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
          offersData={selectedCoupon}
          update
        />
      )
    }
  ]

  const onSubmit = (data) => {
    const formData = new FormData()
    formData.append("title", data.title)
    data.category === "porcentual"
      ? formData.append("percentage", data.percentage)
      : formData.append("amount", data.amount.includes(".00") ? data.amount : data.amount.concat(".00"))
    if (data.couponType === "fecha") {
      formData.append("startDate", data.startDate)
      formData.append("endDate", data.endDate)
    } else {
      formData.append("timesToUse", data.timesToUse)
    }

    let formDataImage = null
    if (data?.files?.[0]) {
      formDataImage = new FormData()
      formDataImage.append("files", data.files[0])
    }

    dispatch(
      updateCoupon({
        couponId: selectedCoupon.id,
        params: formData,
        imageParams: formDataImage
      })
    )
      .unwrap()
      .then(() => {
        navigate(SETTING_NAVIGATION_ROUTES.Coupons.path)
      })
      .catch((error) => {
        console.error("Error updating promotion:", error)
      })
  }

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        <FormLayout
          title={selectedCoupon?.title}
          show
          accordionTitles={["Información general"]}
          accordionStructure={accordionStructure}
          navigate={() => navigate(SETTING_NAVIGATION_ROUTES.Coupons.path)}
          isLoading={updatingCoupons}
          update
        />
      </form>
    </>
  )
}
