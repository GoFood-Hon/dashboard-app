import React, { useEffect, useState } from "react"
import BaseLayout from "../../components/BaseLayout"
import { Accordion, Breadcrumbs } from "@mantine/core"
import BreadCrumbNavigation from "../../components/BreadCrumbNavigation"
import { useLocation, useNavigate } from "react-router-dom"
import { yupResolver } from "@hookform/resolvers/yup"
import { useForm } from "react-hook-form"
import { useSelector } from "react-redux"
import toast from "react-hot-toast"
import { LoaderComponent } from "../../components/LoaderComponent"
import { newBranchValidation } from "../../utils/inputRules"
import { NAVIGATION_ROUTES_RES_ADMIN } from "../../routes"
import Button from "../../components/Button"
import GeneralInformationForm from "./GeneralInformationForm"
import LocationForm from "./LocationForm"
import TimeForm from "./TimeForm"
import BackButton from "../Dishes/components/BackButton"
import branchesApi from "../../api/branchesApi"

import { getDepartmentNameById } from "../../utils"
import { showNotification } from "@mantine/notifications"

export default function NewBranch() {
  const location = useLocation()
  const navigate = useNavigate()
  const restaurant = useSelector((state) => state.restaurants.restaurants)
  const [isLoading, setIsLoading] = useState(false)

  const {
    register,
    handleSubmit,
    setValue,
    control,
    reset,
    formState: { errors }
  } = useForm({
    resolver: yupResolver(newBranchValidation)
  })

  const [isDataCleared, setIsDataCleared] = useState(false)

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
      title: "Ubicación",
      requirement: "Obligatorio",
      form: (
        <LocationForm register={register} errors={errors} setValue={setValue} control={control} isDataCleared={isDataCleared} />
      )
    },
    {
      title: "Horario",
      requirement: "Obligatorio",
      form: <TimeForm setValue={setValue} />
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

  const onSubmit = async (data) => {
    //setIsLoading(true)
    const formData = {
      name: data.name,
      email: data.email,
      phoneNumber: data.phoneNumber,
      address: data.address,
      city: data.city,
      state: getDepartmentNameById(parseInt(data.state)),
      geolocation: data.geolocation,
      delivery: data.delivery ?? false,
      pickup: data.pickup ?? false,
      onSite: data.onSite ?? false,
      alwaysOpen: data.alwaysOpen ?? false,
      schedules: !data.alwaysOpen ? data.schedule : null
    }

    try {
      const response = await branchesApi.createBranch(formData)

      if (response.error) {
        showNotification({
          title: "Error",
          message: response.message,
          color: "red",
          duration: 7000
        })
      } else {
        const branchId = response.data.id

        const uploadBranchImage = async (branchId, file) => {
          const formDataImage = new FormData()
          formDataImage.append("files", file)

          return await branchesApi.addImage(branchId, formDataImage)
        }

        const addImageResponse = await uploadBranchImage(branchId, data?.files?.[0])

        if (addImageResponse.error) {
          showNotification({
            title: "Error",
            message: addImageResponse.message,
            color: "red",
            duration: 7000
          })
        } else {
          showNotification({
            title: "Creación exitosa",
            message: "La sucursal fue creada correctamente",
            color: "green",
            duration: 7000
          })
          navigate(NAVIGATION_ROUTES_RES_ADMIN.Branches.path)
        }
      }
      setIsLoading(false)
      return response.data
    } catch (e) {
      showNotification({
        title: "Error",
        message: e,
        color: "red",
        duration: 7000
      })
      setIsLoading(false)
    }
  }

  return (
    <BaseLayout>
      <form onSubmit={handleSubmit(onSubmit)}>
        <section>
          <div className="flex flex-row justify-between items-center pb-6 flex-wrap xs:gap-3">
            <BackButton title="Nueva sucursal" />
          </div>
        </section>
        <section>
          <Accordion
            variant="separated"
            multiple
            defaultValue={["Información general", "Ubicación", "Horario"]}
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
                  reset()
                  localStorage.removeItem("draft")
                  navigate(NAVIGATION_ROUTES_RES_ADMIN.Branches.path)
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
    </BaseLayout>
  )
}
