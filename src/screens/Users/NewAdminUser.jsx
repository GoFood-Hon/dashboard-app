import React from "react"
import { useNavigate } from "react-router-dom"
import { Accordion } from "@mantine/core"
import { useForm } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
import { AdminInformationForm } from "./AdminInformationForm"
import { NAVIGATION_ROUTES_SUPER_ADMIN } from "../../routes"
import { newAdminValidationSchema } from "../../utils/inputRules"
import { useDispatch } from "react-redux"
import { createAdminUser } from "../../store/features/userSlice"
import { useSelector } from "react-redux"
import FormLayout from "../../components/Form/FormLayout"

export const NewAdminUser = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const isLoading = useSelector((state) => state.user.creatingUser)

  const {
    register,
    handleSubmit,
    setValue,
    control,
    formState: { errors }
  } = useForm({ resolver: yupResolver(newAdminValidationSchema) })

  const accordionStructure = [
    {
      title: "Información general",
      requirement: "Obligatorio",
      form: <AdminInformationForm register={register} errors={errors} setValue={setValue} control={control} />
    }
  ]

  const items = accordionStructure.map((item, key) => (
    <Accordion.Item key={key} value={item.title}>
      <Accordion.Control>
        <div className="flex w-full flex-row items-center rounded-lg">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#EE364C] p-2 text-base font-bold text-slate-50">
            {key + 1}
          </div>
          <span className="ml-4 text-base font-bold  leading-normal">{item.title}</span>
          <span className="ml-1 text-base font-normal">({item?.requirement})</span>
        </div>
      </Accordion.Control>
      <Accordion.Panel>{item.form}</Accordion.Panel>
    </Accordion.Item>
  ))

  const onSubmit = async (data) => {
    const formData = new FormData()
    formData.append("name", data.name)
    formData.append("email", data.email)
    formData.append("phoneNumber", data.phoneNumber.startsWith("+504") ? data.phoneNumber : `+504${data.phoneNumber}`)
    formData.append("password", data.password)
    formData.append("restaurantId", data.restaurantId)

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
          accordionTitles={["Información general"]}
          accordionItems={items}
          navigate={() => navigate(NAVIGATION_ROUTES_SUPER_ADMIN.Users.path)}
          isLoading={isLoading}
        />
      </form>
    </>
  )
}
