import React, { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { useNavigate, useParams } from "react-router-dom"
import toast from "react-hot-toast"
import { USER_ROLES } from "../../utils/constants"
import { NAVIGATION_ROUTES_RES_ADMIN } from "../../routes"
import GeneralInformationForm from "./GeneralInformationForm"
import authApi from "../../api/authApi"
import FormLayout from "../../components/Form/FormLayout"
import { updateUser } from "../../store/features/userSlice"
import { useSelector } from "react-redux"
import { useDispatch } from "react-redux"

export const EditUserScreen = () => {
  const { userId } = useParams()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [userDetails, setUserDetails] = useState({})
  const isLoading = useSelector((state) => state.user.updatingOtherUser)

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const response = await authApi.getUserDetails(userId)
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
          data={userDetails}
          image={imageUrl}
          edit
        />
      )
    }
  ]

  const onSubmit = async (data) => {
    const formData = new FormData()
    formData.append("name", data.name)
    formData.append("email", data.email)
    formData.append("phoneNumber", data.phoneNumber)
    formData.append("role", data.role)
    if (data.role === USER_ROLES.driver) {
      formData.append("motorcycleId", data.Driver.motorcycleId)
      formData.append("nationalIdentityNumber", data.Driver.nationalIdentityNumber)
    } else {
      formData.append("sucursalId", data.sucursalId)
    }

    let formDataImage = null
    if (data?.files?.[0]) {
      formDataImage = new FormData()
      formDataImage.append("files", data.files[0])
    }

    dispatch(
      updateUser({
        formData,
        userId,
        formDataImage,
        newSucursals: data.newSucursals,
        deletedSucursals: data.deletedSucursals,
        driverId: userDetails?.Driver?.driverId
      })
    )
      .unwrap()
      .then(() => {
        navigate(NAVIGATION_ROUTES_RES_ADMIN.Users.path)
      })
      .catch((error) => {
        console.error("Error updating user:", error)
      })
  }

  useEffect(() => {
    if (Object.keys(userDetails).length > 0) {
      reset(userDetails)
    }
    window.scrollTo(0, 0)
  }, [userDetails, reset])

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        <FormLayout
          title={userDetails?.name}
          show
          accordionTitles={["Información general", "Sucursal"]}
          accordionStructure={accordionStructure}
          navigate={() => navigate(NAVIGATION_ROUTES_RES_ADMIN.Users.path)}
          isLoading={isLoading}
          update
        />
      </form>
    </>
  )
}
