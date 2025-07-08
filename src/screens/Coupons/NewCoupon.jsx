import { useForm } from "react-hook-form"
import { GeneralInformationForm } from "./GeneralInformationForm"
import FormLayout from "../../components/Form/FormLayout"
import { SETTING_NAVIGATION_ROUTES } from "../../routes"
import { useSelector } from "react-redux"
import { useDispatch } from "react-redux"
import { useNavigate } from "react-router-dom"
import { createCoupon } from "../../store/features/couponsSlice"

export const NewCoupon = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { creatingCoupons } = useSelector((state) => state.coupons)

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
    control,
    watch
  } = useForm({
    defaultValues: {
      couponType: "fecha",
      category: "porcentual",
      percentage: "5",
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
    formData.append("category", data.category)
    formData.append("couponType", data.couponType)
    data.category === "porcentual"
      ? formData.append("percentage", data.percentage)
      : formData.append("amount", data.amount.includes(".00") ? data.amount : data.amount.concat(".00"))
    if (data.couponType === "fecha") {
      formData.append("startDate", data.startDate)
      formData.append("endDate", data.endDate)
    } else {
      formData.append("timesToUse", data.timesToUse)
    }

    const formDataImage = new FormData()
    formDataImage.append("files", data.files[0])

    dispatch(createCoupon({ params: formData, imageParams: formDataImage }))
      .unwrap()
      .then(() => {
        navigate(SETTING_NAVIGATION_ROUTES.Coupons.path)
      })
      .catch((error) => {
        console.error("Error creating coupon:", error)
      })
  }

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        <FormLayout
          title="Nuevo cupón"
          show
          accordionTitles={["Información general"]}
          accordionStructure={accordionStructure}
          navigate={() => navigate(SETTING_NAVIGATION_ROUTES.Coupons.path)}
          isLoading={creatingCoupons}
        />
      </form>
    </>
  )
}
