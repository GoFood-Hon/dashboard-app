import React, { useState } from "react"
import { Accordion, Breadcrumbs } from "@mantine/core"
import { useLocation, useNavigate } from "react-router-dom"
import { useForm } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
import toast from "react-hot-toast"
import { GeneralInformationForm } from "./GeneralInformationForm"
import BreadCrumbNavigation from "../../components/BreadCrumbNavigation"
import BackButton from "../Dishes/components/BackButton"
import BaseLayout from "../../components/BaseLayout"
import Button from "../../components/Button"
import { NAVIGATION_ROUTES_SUPER_ADMIN } from "../../routes"
import { restaurantValidation } from "../../utils/inputRules"
import restaurantsApi from "../../api/restaurantApi"

export const NewRestaurant = () => {
  const location = useLocation()
  const navigate = useNavigate()

  const {
    register,
    handleSubmit,
    setValue,
    control,
    reset,
    formState: { errors }
  } = useForm({ resolver: yupResolver(restaurantValidation) })

  const [isDataCleared, setIsDataCleared] = useState(false)

  const onSubmit = async (data) => {
    try {
      const formData = new FormData()

      formData.append("name", data.name)
      formData.append("email", data.email)
      formData.append("phoneNumber", data.phoneNumber)
      formData.append("socialReason", data.socialReason)
      formData.append("rtn", data.rtn)
      formData.append("billingAddress", data.billingAddress)
      formData.append("cai", data.cai)
      formData.append("maxDistanceShipping", data.maxDistanceShipping)
      formData.append("shippingFree", data.shippingFree ?? false)

      const response = await restaurantsApi.createRestaurant(formData)

      if (response.error) {
        toast.error(`Fallo al crear el restaurante. Por favor intente de nuevo. ${response.message}`, {
          duration: 7000
        })
      } else {
        const restaurantId = response.data.id

        const uploadImage = async (restaurantId, file) => {
          const formDataImage = new FormData()
          formDataImage.append("files", file)

          return await restaurantsApi.addImage(restaurantId, formDataImage)
        }

        const addImageResponse = await uploadImage(restaurantId, data?.files?.[0])

        if (addImageResponse.error) {
          toast.error(`Fallo al subir la imagen. Por favor intente de nuevo. ${addImageResponse.message}`, {
            duration: 7000
          })
        } else {
          toast.success("Restaurante creado exitosamente", {
            duration: 7000
          })
          navigate(NAVIGATION_ROUTES_SUPER_ADMIN.Restaurants.path)
        }
      }
    } catch (e) {
      toast.error(`Error. Por favor intente de nuevo. ${e}`, {
        duration: 7000
      })
    }
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
    <BaseLayout>
      <form onSubmit={handleSubmit(onSubmit)}>
        <section>
          <div className="flex flex-row justify-between items-center pb-6 flex-wrap xs:gap-3">
            <BackButton title="Nuevo Restaurante" />
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
            defaultValue={["Información general"]}
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
                  navigate(NAVIGATION_ROUTES_SUPER_ADMIN.Restaurants.path)
                }}
              />
              <Button
                text={"Guardar restaurante"}
                className="flex h-10 w-full items-center justify-center px-4 rounded-md shadow-sm transition-all duration-700 focus:outline-none text-xs bg-sky-950 text-slate-50"
              />
            </div>
          </div>
        </section>
      </form>
    </BaseLayout>
  )
}
