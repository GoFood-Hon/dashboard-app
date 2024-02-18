import React, { useState } from "react"
import { Accordion } from "@mantine/core"
import { useForm } from "react-hook-form"
import { useDispatch } from "react-redux"
import toast from "react-hot-toast"

import Button from "../../components/Button"
import PaymentForm from "../Dishes/PaymentForm"
import GeneralInformationForm from "./GeneralInformationForm"
import ComplementSettings from "./ComplementSettings"
import { updateComplement } from "../../store/features/complementsSlice"

export default function EditComplementScreen({ close, complementDetails }) {
  const dispatch = useDispatch()

  const {
    register,
    handleSubmit,
    setValue,
    control,
    reset,
    formState: { errors }
  } = useForm({
    defaultValues: complementDetails
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
          preloadImage={complementDetails.images}
        />
      )
    },
    {
      title: "Configuración complemento",
      requirement: "Opcional",
      form: (
        <ComplementSettings
          register={register}
          errors={errors}
          setValue={setValue}
          control={control}
          isDataCleared={isDataCleared}
        />
      )
    },
    {
      title: "Pagos",
      requirement: "Obligatorio",
      form: <PaymentForm register={register} errors={errors} />
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

  const onSubmit = (data) => {
    dispatch(updateComplement({ data })).then((response) => {
      if (response.payload) {
        reset()
        close()
      }
    })
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <section>
        <div className="flex flex-row justify-between items-center pb-6 flex-wrap xs:gap-3">
          <div className="flex flex-row gap-x-3 items-center">
            <h1 className="text-white-200 md:text-2xl font-semibold">Editar Complemento</h1>
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
      <section>
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
              text={"Guardar cambios"}
              onClick={handleSubmit(onSubmit)}
              className="flex h-10 w-full items-center justify-center px-4 rounded-md shadow-sm transition-all duration-700 focus:outline-none text-xs bg-sky-950 text-slate-50"
            />
          </div>
        </div>
      </section>
    </form>
  )
}
