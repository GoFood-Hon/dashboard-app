import Button from "../../components/Button"
import { Accordion } from "@mantine/core"
import React, { useRef, useState } from "react"
import { useForm } from "react-hook-form"

import GeneralInformationForm from "./GeneralInformationForm"
import PaymentForm from "./PaymentForm"
import { useDispatch } from "react-redux"
import toast from "react-hot-toast"
import PreparationForm from "./PreparationForm"
import { updateDish } from "../../store/features/dishesSlice"
import { EditAdditionalForm } from "./EditAdditionalForm"
import { convertToDecimal } from "../../utils"

export default function EditDishScreen({ close, dishDetails }) {
  const dispatch = useDispatch()

  const [isDataCleared, setIsDataCleared] = useState(false)
  const [additional, setAdditional] = useState(dishDetails.additionals)

  const containerRef = useRef(null)
  const {
    register,
    handleSubmit,
    setValue,
    control,
    reset,
    formState: { errors }
  } = useForm({
    defaultValues: dishDetails
  })

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
      title: "Adicionales",
      requirement: "Opcional",
      form: <EditAdditionalForm additional={additional} setAdditional={setAdditional} dishDetails={dishDetails} />
    },
    {
      title: "Pagos",
      requirement: "Obligatorio",
      form: <PaymentForm register={register} errors={errors} />
    },
    {
      title: "Preparación",
      requirement: "Opcional",
      form: <PreparationForm setValue={setValue} errors={errors} isDataCleared={isDataCleared} register={register} />
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
    console.log(data)
    const dishId = data.id
    const dishData = {
      ...data,
      price: convertToDecimal(data?.price),
      additionals: additional
    }

    dispatch(updateDish({ dishData, dishId })).then((response) => {
      if (response.payload) {
        reset()
        close()
      }
    })
    close()
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="w-full h-full ">
      <section>
        <div className="flex flex-row justify-between items-center pb-6 flex-wrap xs:gap-3">
          <div className="flex flex-row gap-x-3 items-center">
            <h1 className="text-white-200 md:text-2xl font-semibold">Editar Platillo</h1>
          </div>
        </div>
      </section>
      <section>
        <Accordion
          variant="separated"
          multiple
          defaultValue={["Información general", "Pagos"]}
          classNames={{
            label: "bg-white fill-white"
          }}>
          {items}
        </Accordion>
      </section>
      <section ref={containerRef}>
        <div className="w-full flex md:justify-end mt-6 md:gap-3 rounded-md bg-white px-8 py-5 border border-gray-200">
          <div className="md:w-2/3 lg:1/3 sm:w-full flex flex-row justify-end gap-3 sm:flex-wrap md:flex-nowrap">
            <Button
              text={"Descartar"}
              className={"text-xs border border-red-400 text-red-400 bg-white"}
              onClick={() => {
                reset()
                close()
                toast.success("Cambios descartados")
              }}
            />
            <Button
              text={"Actualizar"}
              onClick={handleSubmit(onSubmit)}
              className="flex h-10 items-center justify-center px-4 rounded-md shadow-sm transition-all duration-700 focus:outline-none text-xs bg-sky-950 text-slate-50"
            />
          </div>
        </div>
      </section>
    </form>
  )
}
