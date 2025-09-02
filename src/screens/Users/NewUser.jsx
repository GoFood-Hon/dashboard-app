import { useNavigate } from "react-router-dom"
import { useForm } from "react-hook-form"
import GeneralInformationForm from "./GeneralInformationForm"
import { NAVIGATION_ROUTES_RES_ADMIN } from "../../routes"
import { USER_ROLES } from "../../utils/constants"
import FormLayout from "../../components/Form/FormLayout"
import { useDispatch } from "react-redux"
import { createUser } from "../../store/features/userSlice"
import { useSelector } from "react-redux"
import { newUserSchema } from "../../utils/validationSchemas"
import { zodResolver } from "@hookform/resolvers/zod"

export default function NewUser() {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { creatingOtherUser } = useSelector((state) => state.user)
  const {
    register,
    handleSubmit,
    setValue,
    control,
    reset,
    watch,
    formState: { errors }
  } = useForm({ defaultValues: { role: '', sucursalIds: [] }, resolver: zodResolver(newUserSchema) })

  const onSubmit = async (data) => {
    const formData = {
      name: data.name,
      email: data.email,
      phoneNumber: data.phoneNumber.startsWith("+504") ? data.phoneNumber : `+504${data.phoneNumber}`,
      role: data.role,
      sucursalIds: data.sucursalIds,
      password: data.password,
      confirmPassword: data.confirmPassword
    }

    if (data.role === USER_ROLES.driver) {
      formData.motorcycleId = data.Driver.motorcycleId
      formData.nationalIdentityNumber = data.Driver.nationalIdentityNumber
    }

    let formDataImage = null
    if (data?.files?.[0]) {
      formDataImage = new FormData()
      formDataImage.append("files", data.files[0])
    }

    dispatch(createUser({ params: formData, imageParams: formDataImage }))
      .unwrap()
      .then(() => {
        navigate(NAVIGATION_ROUTES_RES_ADMIN.Users.path)
      })
  }

  const accordionStructure = [
    {
      title: "Información general",
      requirement: "Obligatorio",
      form: (
        <GeneralInformationForm register={register} errors={errors} setValue={setValue} control={control} watch={watch} newUser />
      )
    }
  ]

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        <FormLayout
          title="Nuevo usuario"
          show
          accordionTitles={["Información general", "Sucursal"]}
          accordionStructure={accordionStructure}
          navigate={() => navigate(NAVIGATION_ROUTES_RES_ADMIN.Users.path)}
          isLoading={creatingOtherUser}
        />
      </form>
    </>
  )
}
