import React, { useState } from "react"
import { Accordion, Button, Flex, Paper } from "@mantine/core"
import { useNavigate } from "react-router-dom"
import { useForm } from "react-hook-form"
import GeneralInformationForm from "./GeneralInformationForm"
import SucursalSettings from "./SucursalSettings"
import { NAVIGATION_ROUTES_RES_ADMIN } from "../../routes"
import userApi from "../../api/userApi"
import BackButton from "../Dishes/components/BackButton"
import { USER_ROLES } from "../../utils/constants"
import { showNotification } from "@mantine/notifications"
import { colors } from "../../theme/colors"
import FormLayout from "../../components/Form/FormLayout"
import { useDispatch } from "react-redux"
import { createUser } from "../../store/features/userSlice"
import { useSelector } from "react-redux"

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
  } = useForm()

  const [isDataCleared, setIsDataCleared] = useState(false)

  const onSubmit = async (data) => {
    const formData = new FormData()
    formData.append("name", data.name)
    formData.append("email", data.email)
    formData.append("phoneNumber", data.phoneNumber.startsWith("+504") ? data.phoneNumber : `+504${data.phoneNumber}`)
    formData.append("role", data.role)
    formData.append("note", data.note)

    formData.append("sucursalIds", data.sucursalId)
    formData.append("password", data.password)
    formData.append("confirmPassword", data.confirmPassword)

    if (data.role === USER_ROLES.driver) {
      formData.append("motorcycleId", data.Driver.motorcycleId)
      formData.append("nationalIdentityNumber", data.Driver.nationalIdentityNumber)
    }

    const formDataImage = new FormData()
    formDataImage.append("files", data.files[0])

    dispatch(createUser({ params: formData, imageParams: formDataImage }))
      .unwrap()
      .then(() => {
        navigate(NAVIGATION_ROUTES_RES_ADMIN.Users.path)
      })
      .catch((error) => {
        console.error("Error creating user:", error)
      })
  }

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
          isDataCleared={isDataCleared}
          watch={watch}
          newUser
        />
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
