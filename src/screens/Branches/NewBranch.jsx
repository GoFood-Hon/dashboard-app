import React, { useEffect, useState } from "react"
import BaseLayout from "../../components/BaseLayout"
import { Accordion, Breadcrumbs } from "@mantine/core"
import BreadCrumbNavigation from "../../components/BreadCrumbNavigation"
import { useLocation, useNavigate } from "react-router-dom"
import { yupResolver } from "@hookform/resolvers/yup"
import { useForm } from "react-hook-form"
import { useSelector } from "react-redux"
import toast from "react-hot-toast"

import { newBranchValidation } from "../../utils/inputRules"
import { NAVIGATION_ROUTES } from "../../routes"
import Button from "../../components/Button"
import GeneralInformationForm from "./GeneralInformationForm"
import LocationForm from "./LocationForm"
import TimeForm from "./TimeForm"
import BackButton from "../Dishes/components/BackButton"
import branchesApi from "../../api/branchesApi"

import { getDepartmentNameById } from "../../utils"

export default function NewBranch() {
  const location = useLocation()
  const navigate = useNavigate()
  const restaurant = useSelector((state) => state.restaurants.restaurants)

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

  /*   const onSubmit = async (data) => {
    console.log(data, "dat")

    const formData = new FormData()

    formData.append("restaurantId", restaurant.id)
    formData.append("name", data.name)
    formData.append("phoneNumber", data.phoneNumber)

    formData.append("address", data.address)
    formData.append("city", data.city)
    formData.append("state", getDepartmentNameById(parseInt(data.state)))
    formData.append("geolocation[]", data.geolocation[0])
    formData.append("geolocation[]", data.geolocation[1])

    formData.append("delivery", data.delivery ?? false)
    formData.append("pickup", data.pickup ?? false)
    formData.append("onSite", data.onSite ?? false)

    formData.append("alwaysOpen", data.alwaysOpen ?? false)

    if (!data.alwaysOpen) {
      formData.append("schedule", data.schedule)
    }

    try {
      const response = await branchesApi.createBranch(formData)

      if (response.error) {
        toast.error(`Fallo al crear la sucursal. Por favor intente de nuevo. ${response.message}`, {
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
          toast.error(`Fallo al subir la imagen. Por favor intente de nuevo. ${addImageResponse.message}`, {
            duration: 7000
          })
        } else {
          toast.success("Sucursal creada exitosamente", {
            duration: 7000
          })
          navigate(NAVIGATION_ROUTES.Branches.path)
        }
      }
      return response.data
    } catch (e) {
      toast.error(`Error. Por favor intente de nuevo. ${e}`, {
        duration: 7000
      })
    }
  }
 */

  const onSubmit = async (data) => {
    const formData = JSON.stringify({
      restaurantId: restaurant.id,
      name: data.name,
      phoneNumber: data.phoneNumber,
      address: data.address,
      city: data.city,
      state: getDepartmentNameById(parseInt(data.state)),
      geolocation: data.geolocation,
      delivery: data.delivery ?? false,
      pickup: data.pickup ?? false,
      onSite: data.onSite ?? false,
      alwaysOpen: data.alwaysOpen ?? false,
      schedule: !data.alwaysOpen ? data.schedule : null
    })

    try {
      const response = await branchesApi.createBranch(formData)

      if (response.error) {
        toast.error(`Fallo al crear la sucursal. Por favor intente de nuevo. ${response.message}`, {
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
          toast.error(`Fallo al subir la imagen. Por favor intente de nuevo. ${addImageResponse.message}`, {
            duration: 7000
          })
        } else {
          toast.success("Sucursal creada exitosamente", {
            duration: 7000
          })
          navigate(NAVIGATION_ROUTES.Branches.path)
        }
      }
      return response.data
    } catch (e) {
      toast.error(`Error. Por favor intente de nuevo. ${e}`, {
        duration: 7000
      })
    }
  }
  return (
    <BaseLayout>
      <form onSubmit={handleSubmit(onSubmit)}>
        <section>
          <div className="flex flex-row justify-between items-center pb-6 flex-wrap xs:gap-3">
            <BackButton title="Nueva sucursal" />
            <div>
              <Breadcrumbs>
                <BreadCrumbNavigation location={location} />
              </Breadcrumbs>
            </div>
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
                  toast.success("Información eliminada")
                  navigate(NAVIGATION_ROUTES.Menu.submenu.Dishes.path)
                }}
              />
              <Button
                text={"Guardar sucursal"}
                className="flex h-10 w-full items-center justify-center px-4 rounded-md shadow-sm transition-all duration-700 focus:outline-none text-xs bg-sky-950 text-slate-50"
              />
            </div>
          </div>
        </section>
      </form>
    </BaseLayout>
  )
}
