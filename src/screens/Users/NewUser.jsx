import React, { useState } from "react"
import { Accordion } from "@mantine/core"
import { useNavigate } from "react-router-dom"
import { useForm } from "react-hook-form"
import GeneralInformationForm from "./GeneralInformationForm"
import SucursalSettings from "./SucursalSettings"
import Button from "../../components/Button"
import { NAVIGATION_ROUTES_RES_ADMIN } from "../../routes"
import userApi from "../../api/userApi"
import BackButton from "../Dishes/components/BackButton"
import { USER_ROLES } from "../../utils/constants"
import { showNotification } from "@mantine/notifications"
import { LoaderComponent } from "../../components/LoaderComponent"

export default function NewUser() {
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(false)

  const {
    register,
    handleSubmit,
    setValue,
    control,
    reset,
    formState: { errors }
  } = useForm()

  const [isDataCleared, setIsDataCleared] = useState(false)

  const onSubmit = async (data) => {
    setIsLoading(true)
    try {
      const formData = new FormData()
      formData.append("name", data.name)
      formData.append("email", data.email)
      formData.append("phoneNumber", `+504${data.phoneNumber}`)
      formData.append("role", data.role)
      formData.append("note", data.note)

      formData.append("sucursalId", data.branchId)
      formData.append("password", data.password)
      formData.append("confirmPassword", data.confirmPassword)

      if (data.role === USER_ROLES.driver) {
        formData.append("motorcycleId", data.motorcycleId)
        formData.append("nationalIdentityNumber", data.nationalIdentityNumber)
      }

      const response = await userApi.createUser(formData)

      if (response?.error) {
        showNotification({
          title: "Error",
          message: response.message,
          color: "red",
          duration: 7000
        })
      } else {
        showNotification({
          title: "Creación exitosa",
          message: `Se creó el usuario de ${response.data.name}`,
          color: "green",
          duration: 7000
        })
        reset()
        setIsDataCleared(true)
        navigate(NAVIGATION_ROUTES_RES_ADMIN.Users.path)
      }
    } catch (error) {
      showNotification({
        title: "Error",
        message: error,
        color: "red",
        duration: 7000
      })
      throw error
    }
    setIsLoading(false)
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
        />
      )
    },
    {
      title: "Sucursal",
      requirement: "Obligatorio",
      form: (
        <SucursalSettings
          register={register}
          errors={errors}
          setValue={setValue}
          control={control}
          isDataCleared={isDataCleared}
        />
      )
    }
  ]

  const items = accordionStructure.map((item, key) => (
    <Accordion.Item key={key} value={item.title}>
      <Accordion.Control>
        <div className="w-full rounded-lg flex-row flex items-center bg-white">
          <div className="text-slate-50 text-base font-bold bg-sky-950 rounded-full p-2 w-8 h-8 flex items-center justify-center">
            {key + 1}
          </div>
          <span className="text-sky-950 text-base font-bold  leading-normal ml-4">{item.title}</span>
          <span className="text-sky-950 text-base font-normal ml-1">({item?.requirement})</span>
        </div>
      </Accordion.Control>
      <Accordion.Panel>{item.form}</Accordion.Panel>
    </Accordion.Item>
  ))

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        <section>
          <div className="flex flex-row justify-between items-center pb-6 flex-wrap xs:gap-3">
            <BackButton title="Nuevo usuario" show />
          </div>
        </section>
        <section>
          <Accordion
            variant="separated"
            multiple
            defaultValue={["Información general", "Sucursal"]}
            classNames={{
              label: "bg-white fill-white"
            }}>
            {items}
          </Accordion>
        </section>
        <section>
          <div className="w-full flex md:justify-end mt-6 md:gap-3 rounded-md bg-white px-8 py-5 border border-gray-200">
            <div className="md:w-2/3 lg:1/3 sm:w-full flex flex-row justify-end gap-3 sm:flex-wrap md:flex-nowrap">
              <Button
                text={"Descartar"}
                className={"text-xs border border-red-400 text-red-400 bg-white"}
                onClick={() => {
                  navigate(NAVIGATION_ROUTES_RES_ADMIN.Users.path)
                }}
              />
              {isLoading ? (
                <LoaderComponent width={24} size={25} />
              ) : (
                <Button
                  text={"Guardar"}
                  className="w-24 flex h-10 items-center justify-center rounded-md shadow-sm transition-all duration-700 focus:outline-none text-xs bg-sky-950 text-slate-50"
                />
              )}
            </div>
          </div>
        </section>
      </form>
    </>
  )
}
