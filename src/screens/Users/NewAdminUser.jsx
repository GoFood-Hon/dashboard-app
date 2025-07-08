import React from "react"
import { useNavigate } from "react-router-dom"
import { useForm } from "react-hook-form"
import { AdminInformationForm } from "./AdminInformationForm"
import { NAVIGATION_ROUTES_SUPER_ADMIN } from "../../routes"
import { useDispatch } from "react-redux"
import { createAdminUser } from "../../store/features/userSlice"
import { useSelector } from "react-redux"
import FormLayout from "../../components/Form/FormLayout"
import { zodResolver } from "@hookform/resolvers/zod"
import { newAdminUserSchema } from "../../utils/validationSchemas"

export const NewAdminUser = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const isLoading = useSelector((state) => state.user.creatingUser)

  const {
    register,
    handleSubmit,
    setValue,
    control,
    watch,
    formState: { errors }
  } = useForm({ resolver: zodResolver(newAdminUserSchema) })

  const accordionStructure = [
    {
      title: "Información general",
      requirement: "Obligatorio",
      form: <AdminInformationForm register={register} errors={errors} setValue={setValue} control={control} watch={watch} />
    }
  ]

  const onSubmit = async (data) => {
    const formData = new FormData()
    formData.append("name", data.name)
    formData.append("email", data.email)
    formData.append("phoneNumber", data.phoneNumber.startsWith("+504") ? data.phoneNumber : `+504${data.phoneNumber}`)
    formData.append("password", data.password)
    formData.append("restaurantId", data.restaurantId || "")

    let formDataImage = null
    if (data?.files?.[0]) {
      formDataImage = new FormData()
      formDataImage.append("files", data.files[0])
    }

    dispatch(createAdminUser({ params: formData, formDataImage }))
      .unwrap()
      .then(() => {
        navigate(NAVIGATION_ROUTES_SUPER_ADMIN.Users.path)
      })
      .catch((error) => {
        console.error("Error creating user:", error)
      })
  }

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        <FormLayout
          title={"Nuevo administrador"}
          show
          accordionStructure={accordionStructure}
          accordionTitles={["Información general"]}
          navigate={() => navigate(NAVIGATION_ROUTES_SUPER_ADMIN.Users.path)}
          isLoading={isLoading}
        />
      </form>
    </>
  )
}
