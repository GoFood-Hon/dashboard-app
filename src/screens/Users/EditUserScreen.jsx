import React, { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { useLocation, useNavigate } from "react-router-dom"
import toast from "react-hot-toast"
import { Accordion } from "@mantine/core"

import SucursalSettings from "./SucursalSettings"
import Button from "../../components/Button"
import EditGeneralInformationForm from "./EditGeneralInformation"
import { USER_ROLES } from "../../utils/constants"
import { NAVIGATION_ROUTES } from "../../routes"
import userApi from "../../api/userApi"

export const EditUserScreen = ({ itemDetails, close, userId }) => {
  const {
    register,
    handleSubmit,
    setValue,
    control,
    reset,
    formState: { errors }
  } = useForm({
    defaultValues: itemDetails
  })

  const navigate = useNavigate()

  const [isDataCleared, setIsDataCleared] = useState(false)

  const accordionStructure = [
    {
      title: "Información general",
      requirement: "Obligatorio",
      form: (
        <EditGeneralInformationForm
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

  const onSubmit = async (data) => {
    try {
      const formData = new FormData()
      formData.append("name", data.name)
      formData.append("email", data.email)
      formData.append("phoneNumber", data.phoneNumber)
      formData.append("role", data.role)
      // formData.append("note", data.note)

      formData.append("sucursalId", data.branchId)

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
        navigate(NAVIGATION_ROUTES.Users.path)
      }
    } catch (error) {
      toast.error(`Fallo al crear un nuevo usuario. Por favor intente de nuevo.`, {
        duration: 7000
      })
      throw error
    }
  }

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
    <form onSubmit={handleSubmit(onSubmit)}>
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
                toast.success("Información eliminada")
                navigate(NAVIGATION_ROUTES.Users.path)
              }}
            />
            <Button
              text={"Guardar usuario"}
              className="flex h-10 w-full items-center justify-center px-4 rounded-md shadow-sm transition-all duration-700 focus:outline-none text-xs bg-sky-950 text-slate-50"
            />
          </div>
        </div>
      </section>
    </form>
  )
}
