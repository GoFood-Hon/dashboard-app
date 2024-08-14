import React, { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { useDispatch, useSelector } from "react-redux"
import { useLocation, useNavigate } from "react-router-dom"
import { Accordion } from "@mantine/core"
import toast from "react-hot-toast"
import GeneralInformationForm from "./GeneralInformationForm"
import LocationForm from "./LocationForm"
import TimeForm from "./TimeForm"
import Button from "../../components/Button"
import { getDepartmentNameById } from "../../utils"
import branchesApi from "../../api/branchesApi"
import { NAVIGATION_ROUTES_RES_ADMIN } from "../../routes"

export const EditBranch = ({ itemDetails, close }) => {
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

  const restaurant = useSelector((state) => state?.restaurant?.value)
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
          itemDetails={itemDetails}
        />
      )
    },
    {
      title: "Ubicación",
      requirement: "Obligatorio",
      form: (
        <LocationForm
          register={register}
          errors={errors}
          setValue={setValue}
          control={control}
          isDataCleared={isDataCleared}
          itemDetails={itemDetails}
        />
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
    const formData = JSON.stringify({
      restaurantId: itemDetails.restaurantId,
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
      schedule: !data.alwaysOpen ? data.schedule : null
    })

    try {
      const response = await branchesApi.updateBranches(formData, itemDetails.id)

      if (response.error) {
        toast.error(`Fallo al actualizar la sucursal. Por favor intente de nuevo. ${response.message}`, {
          duration: 7000
        })
      } else {
        const branchId = itemDetails.id

        if (data?.files) {
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
            toast.success("Sucursal actualizada exitosamente", {
              duration: 7000
            })
            reset()
            close()
            navigate(NAVIGATION_ROUTES_RES_ADMIN.Branches.path)
          }
        } else {
          toast.success("Sucursal actualizada exitosamente", {
            duration: 7000
          })
          reset()
          close()
          navigate(NAVIGATION_ROUTES_RES_ADMIN.Branches.path)
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
    <form onSubmit={handleSubmit(onSubmit)}>
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
                toast.success("")
                navigate(NAVIGATION_ROUTES_RES_ADMIN.Menu.submenu.Dishes.path)
              }}
            />
            <Button
              text={"Actualizar"}
              className="flex h-10 items-center justify-center px-4 rounded-md shadow-sm transition-all duration-700 focus:outline-none text-xs bg-sky-950 text-slate-50"
            />
          </div>
        </div>
      </section>
    </form>
  )
}
