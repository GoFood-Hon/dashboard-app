import React, { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { useNavigate, useParams } from "react-router-dom"
import toast from "react-hot-toast"
import { Accordion, Flex, Paper, Button } from "@mantine/core"
import SucursalSettings from "./SucursalSettings"
import { USER_ROLES } from "../../utils/constants"
import { NAVIGATION_ROUTES_RES_ADMIN } from "../../routes"
import userApi from "../../api/userApi"
import BackButton from "../Dishes/components/BackButton"
import { colors } from "../../theme/colors"
import GeneralInformationForm from "./GeneralInformationForm"
import authApi from "../../api/authApi"
import FormLayout from "../../components/Form/FormLayout"

export const EditUserScreen = () => {
  const { userId } = useParams()
  const [userDetails, setUserDetails] = useState({})
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const response = await authApi.getUserDetails(userId)
        console.log(response)
        const userDetailsData = response?.data
        setUserDetails(userDetailsData)
      } catch (error) {
        toast.error("Hubo un error obteniendo los detalles del usuario")
        throw error
      }
    }
    fetchDetails()
  }, [])

  const {
    register,
    handleSubmit,
    setValue,
    control,
    reset,
    watch,
    formState: { errors }
  } = useForm({
    defaultValues:
      {
        ...userDetails,
        motorcycleId: userDetails?.Driver?.motorcycleId,
        nationalIdentityNumber: userDetails?.Driver?.nationalIdentityNumber
      } || []
  })
  const imageUrl = watch("images[0].location")

  const navigate = useNavigate()

  const [isDataCleared, setIsDataCleared] = useState(false)

  const accordionStructure = [
    {
      title: "Información general",
      requirement: "Obligatorio",
      form: (
        <GeneralInformationForm
          watch={watch}
          register={register}
          errors={errors}
          setValue={setValue}
          control={control}
          isDataCleared={isDataCleared}
          image={imageUrl}
        />
      )
    }
  ]

  const onSubmit = async (data) => {
    setIsLoading(true)
    try {
      const formData = new FormData()
      formData.append("name", data.name)
      formData.append("email", data.email)
      formData.append("phoneNumber", data.phoneNumber)
      formData.append("role", data.role)
      formData.append("note", data.note)

      formData.append("sucursalId", data.sucursalId)

      if (data.role === USER_ROLES.driver) {
        formData.append("motorcycleId", data.motorcycleId)
        formData.append("nationalIdentityNumber", data.nationalIdentityNumber)
      }

      const response = await userApi.updateUserRestaurant(formData, userId)

      if (response?.error) {
        toast.error(`Fallo al crear un nuevo usuario. Por favor intente de nuevo. ${response.message}`, {
          duration: 7000
        })
      } else {
        toast.success(`Usuario creado exitosamente`, {
          duration: 7000
        })
        reset()
        setIsDataCleared(true)
        navigate(NAVIGATION_ROUTES_RES_ADMIN.Users.path)
      }
    } catch (error) {
      toast.error(`Fallo al crear un nuevo usuario. Por favor intente de nuevo.`, {
        duration: 7000
      })
      throw error
    }
    setIsLoading(false)
  }

  useEffect(() => {
    if (Object.keys(userDetails).length > 0) {
      reset(userDetails)
    }
    window.scrollTo(0, 0)
  }, [userDetails, reset])

  const items = accordionStructure.map((item, key) => (
    <Accordion.Item key={key} value={item.title}>
      <Accordion.Control>
        <div className="w-full rounded-lg flex-row flex items-center">
          <div className="text-slate-50 text-base font-bold bg-[#EE364C] rounded-full p-2 w-8 h-8 flex items-center justify-center">
            {key + 1}
          </div>
          <span className="text-base font-bold  leading-normal ml-4">{item.title}</span>
          <span className="text-base font-normal ml-1">({item?.requirement})</span>
        </div>
      </Accordion.Control>
      <Accordion.Panel>{item.form}</Accordion.Panel>
    </Accordion.Item>
  ))

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        <FormLayout
          title={userDetails?.name}
          show
          accordionTitles={["Información general", "Sucursal"]}
          accordionItems={items}
          navigate={() => navigate(NAVIGATION_ROUTES_RES_ADMIN.Users.path)}
          isLoading={isLoading}
          update
        />
      </form>
    </>
  )
}
