import React, { useEffect, useState } from "react"
import { Accordion } from "@mantine/core"
import { useForm } from "react-hook-form"
import { useNavigate, useParams } from "react-router-dom"
import { GeneralInformationForm } from "./GeneralInformationForm"
import Button from "../../components/Button"
import restaurantsApi from "../../api/restaurantApi"
import { NAVIGATION_ROUTES_SUPER_ADMIN } from "../../routes"
import { convertToDecimal } from "../../utils"
import { LoaderComponent } from "../../components/LoaderComponent"
import BaseLayout from "../../components/BaseLayout"
import BackButton from "../Dishes/components/BackButton"
import { showNotification } from "@mantine/notifications"

export const EditRestaurant = () => {
  const { restaurantId } = useParams()
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(false)
  const [restaurantDetails, setRestaurantDetails] = useState({})

  useEffect(() => {
    ;(async () => {
      const response = await restaurantsApi.getRestaurant(restaurantId)
      const details = response?.data
      if (details?.phoneNumber?.startsWith("+504")) {
        details.phoneNumber = details.phoneNumber.replace("+504", "")
      }
      setRestaurantDetails(details)
    })()
  }, [])

  const {
    register,
    handleSubmit,
    setValue,
    control,
    reset,
    watch,
    formState: { errors }
  } = useForm({ defaultValues: restaurantDetails || {} })

  const imageLocation = watch("images[0].location")
  const [isDataCleared, setIsDataCleared] = useState(false)

  const onSubmit = async (data) => {
    setIsLoading(true)
    try {
      const formData = new FormData()
      formData.append("name", data.name)
      formData.append("email", data.email)
      formData.append("phoneNumber", `+504${data.phoneNumber}`)
      formData.append("socialReason", data.socialReason)
      formData.append("rtn", data.rtn)
      formData.append("billingAddress", data.billingAddress)
      formData.append("cai", data.cai)
      formData.append("maxDistanceShipping", data.maxDistanceShipping)
      formData.append("shippingFree", data.shippingFree ?? false)
      if (!data.shippingFree) {
        formData.append("shippingPrice", convertToDecimal(data.shippingPrice))
      }
      const response = await restaurantsApi.updateRestaurant(formData, restaurantId)

      if (response.error) {
        showNotification({
          title: "Error",
          message: response.message,
          color: "red",
          duration: 7000
        })
      } else {
        const updatedRestaurantId = response?.data?.id

        const uploadImage = async (restaurantId, file) => {
          const formDataImage = new FormData()
          formDataImage.append("files", file)

          return await restaurantsApi.addImage(restaurantId, formDataImage)
        }

        if (data?.files?.[0]) {
          const addImageResponse = await uploadImage(updatedRestaurantId, data.files[0])

          if (addImageResponse.error) {
            showNotification({
              title: "Error",
              message: addImageResponse.message,
              color: "red",
              duration: 7000
            })
          }
        } else {
          showNotification({
            title: "Actualización exitosa",
            message: `Se actualizó la información de ${response.data.name}`,
            color: "green",
            duration: 7000
          })
        }
        navigate(NAVIGATION_ROUTES_SUPER_ADMIN.Restaurants.path)
      }
      setIsLoading(false)
    } catch (error) {
      showNotification({
        title: "Error",
        message: error,
        color: "red",
        duration: 7000
      })
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (Object.keys(restaurantDetails).length > 0) {
      reset(restaurantDetails)
    }
    window.scrollTo(0, 0)
  }, [restaurantDetails, reset])

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
          image={imageLocation}
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
      <section>
        <div className="flex flex-row justify-between items-center pb-6">
          <BackButton title={restaurantDetails?.name} />
        </div>
      </section>
      <form onSubmit={handleSubmit(onSubmit)}>
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
                  navigate(NAVIGATION_ROUTES_SUPER_ADMIN.Restaurants.path)
                }}
              />
              {isLoading ? (
                <LoaderComponent width={24} size={25} />
              ) : (
                <Button
                  text={"Actualizar"}
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
