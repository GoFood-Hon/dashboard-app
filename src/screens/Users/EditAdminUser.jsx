import React, { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { useNavigate, useParams } from "react-router-dom"
import { AdminGeneralInformationForm } from "./AdminGeneralInformationForm"
import { NAVIGATION_ROUTES_SUPER_ADMIN } from "../../routes"
import authApi from "../../api/authApi"
import { updateUserData } from "../../store/features/userSlice"
import { useSelector, useDispatch } from "react-redux"
import FormLayout from "../../components/Form/FormLayout"
import { zodResolver } from "@hookform/resolvers/zod"
import { editAdminUserSchema } from "../../utils/validationSchemas"

export const EditAdminUser = () => {
  const { adminId } = useParams()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [details, setDetails] = useState({})
  const loading = useSelector((state) => state.user.updatingUser)

  useEffect(() => {
    ;(async () => {
      const response = await authApi.getUserDetails(adminId)

      if (response?.data) {
        const details = response.data
        setDetails(details)
      }
    })()
  }, [])

  const {
    register,
    handleSubmit,
    setValue,
    control,
    reset,
    watch,
    formState: { errors }
  } = useForm({ resolver: zodResolver(editAdminUserSchema), defaultValues: details })

  const imageLocation = watch("images[0].location")

  useEffect(() => {
    if (Object.keys(details).length > 0) {
      reset(details)
    }
    window.scrollTo(0, 0)
  }, [details, reset])

  const onSubmit = async (data) => {
    const formData = new FormData()
    formData.append("name", data.name)
    formData.append("email", data.email)
    formData.append("phoneNumber", data.phoneNumber.startsWith("+504") ? data.phoneNumber : `+504${data.phoneNumber}`)

    formData.append("restaurantId", data.restaurantId ?? "")

    let formDataImage = null
    if (data?.files?.[0]) {
      formDataImage = new FormData()
      formDataImage.append("files", data?.files?.[0])
    }

    dispatch(updateUserData({ id: adminId, params: formData, formDataImage }))
      .unwrap()
      .then(() => {
        navigate(NAVIGATION_ROUTES_SUPER_ADMIN.Users.path)
      })
      .catch((error) => {
        console.error("Error updating user:", error)
      })
  }
  const accordionStructure = [
    {
      title: "Información general",
      requirement: "Obligatorio",
      form: (
        <AdminGeneralInformationForm
          register={register}
          errors={errors}
          setValue={setValue}
          control={control}
          image={imageLocation}
          watch={watch}
        />
      )
    }
  ]

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        <FormLayout
          title={details.name}
          show
          accordionTitles={["Información general"]}
          accordionStructure={accordionStructure}
          navigate={() => navigate(NAVIGATION_ROUTES_SUPER_ADMIN.Users.path)}
          isLoading={loading}
          update
        />
      </form>
    </>
  )
}
