import React, { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Accordion } from "@mantine/core"
import { useForm } from "react-hook-form"
import toast from "react-hot-toast"
import { yupResolver } from "@hookform/resolvers/yup"
import { AdminInformationForm } from "./AdminInformationForm"
import BaseLayout from "../../components/BaseLayout"
import BackButton from "../Dishes/components/BackButton"
import Button from "../../components/Button"
import { NAVIGATION_ROUTES_SUPER_ADMIN } from "../../routes"
import authApi from "../../api/authApi"
import { newAdminValidationSchema } from "../../utils/inputRules"
import userApi from "../../api/userApi"
import { LoaderComponent } from "../../components/LoaderComponent"
import { useDispatch } from "react-redux"
import { addNewUser } from "../../store/features/userSlice"
import { showNotification } from "@mantine/notifications"

export const NewAdminUser = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [isLoading, setIsLoading] = useState(false)

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
        <div className="flex w-full flex-row items-center rounded-lg bg-white">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-sky-950 p-2 text-base font-bold text-slate-50">
            {key + 1}
          </div>
          <span className="ml-4 text-base font-bold  leading-normal text-sky-950">{item.title}</span>
          <span className="ml-1 text-base font-normal text-sky-950">({item?.requirement})</span>
        </div>
      </Accordion.Control>
      <Accordion.Panel>{item.form}</Accordion.Panel>
    </Accordion.Item>
  ))

  const onSubmit = async (data) => {
    setIsLoading(true)
    const formData = new FormData()
    formData.append("name", data.name)
    formData.append("email", data.email)
    formData.append("phoneNumber", `+504${data.phoneNumber}`)
    formData.append("password", data.password)
    formData.append("restaurantId", data.restaurantId)

    const response = await authApi.createNewAdmin(formData)

    if (response.error) {
      showNotification({
        title: "Error",
        message: response.message,
        color: "red",
        duration: 7000
      })
    } else if (response.status === "success") {
      dispatch(addNewUser(response.data.data))

      addImage(response.data.data.id, data)
      navigate(NAVIGATION_ROUTES_SUPER_ADMIN.Users.path)
      showNotification({
        title: "Creación exitosa",
        message: `Se creó el usuario de ${response.data.name}`,
        color: "green",
        duration: 7000
      })
    }
    setIsLoading(false)
  }

  const addImage = async (id, data) => {
    try {
      const formDataImage = new FormData()
      formDataImage.append("files", data.files[0])
      const addImageResponse = await userApi.addImage(id, formDataImage)

      if (addImageResponse.error) {
        throw new Error(`Fallo al subir la imagen. Por favor intente de nuevo. ${addImageResponse.message}`)
      }
    } catch (error) {
      handleError(error)
    }
  }

  const handleError = (error) => {
    toast.error(`Error. Por favor intente de nuevo. ${error}`, {
      duration: 7000
    })
  }

  return (
    <BaseLayout>
      <form onSubmit={handleSubmit(onSubmit)}>
        <section>
          <div className="xs:gap-3 flex flex-row flex-wrap items-center justify-between pb-4">
            <BackButton title="Nuevo administrador" />
          </div>
        </section>
        <section>
          <Accordion
            variant="separated"
            multiple
            defaultValue={["Información general"]}
            classNames={{
              label: "bg-white fill-white"
            }}>
            {items}
          </Accordion>
        </section>
        <section>
          <div className="mt-6 flex w-full rounded-md border border-gray-200 bg-white px-8 py-5 md:justify-end md:gap-3">
            <div className="lg:1/3 flex flex-row justify-end gap-3 sm:w-full sm:flex-wrap md:w-2/3 md:flex-nowrap">
              <Button
                text={"Descartar"}
                className={"border border-red-400 bg-white text-xs text-red-400"}
                onClick={() => {
                  navigate(NAVIGATION_ROUTES_SUPER_ADMIN.Restaurants.path)
                }}
              />
              {isLoading ? (
                <LoaderComponent width={24} size={25} />
              ) : (
                <Button
                  text={"Guardar"}
                  className="w-24 flex h-10 items-center justify-center rounded-md bg-sky-950 text-xs text-slate-50 shadow-sm transition-all duration-700 focus:outline-none"
                />
              )}
            </div>
          </div>
        </section>
      </form>
    </BaseLayout>
  )
}
