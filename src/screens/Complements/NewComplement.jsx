import React, { useEffect, useRef, useState } from "react"
import BaseLayout from "../../components/BaseLayout"
import { useLocation, useNavigate } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import { useForm } from "react-hook-form"
import { newComplementValidation } from "../../utils/inputRules"

import PaymentForm from "../Dishes/PaymentForm"
import { Accordion, Breadcrumbs } from "@mantine/core"
import BreadCrumbNavigation from "../../components/BreadCrumbNavigation"
import Button from "../../components/Button"
import GeneralInformationForm from "./GeneralInformationForm"
import ComplementSettings from "./ComplementSettings"
import toast from "react-hot-toast"
import { yupResolver } from "@hookform/resolvers/yup"
import { createComplement } from "../../store/features/complementsSlice"
import BackButton from "../Dishes/components/BackButton"
import { NAVIGATION_ROUTES_RES_ADMIN } from "../../routes"

export default function NewComplement() {
  const location = useLocation()
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const user = useSelector((state) => state.user.value)

  const [isDataCleared, setIsDataCleared] = useState(false)
  const containerRef = useRef(null)

  const {
    register,
    handleSubmit,
    setValue,
    control,
    reset,
    formState: { errors }
  } = useForm({ resolver: yupResolver(newComplementValidation) })

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
    const restaurantId = user.restaurantId
    dispatch(createComplement({ data, restaurantId })).then((response) => {
      if (response.payload) {
        reset()
        // navigate(NAVIGATION_ROUTES_RES_ADMIN.Menu.submenu.Complements.path)
        setIsDataCleared(true)
      }
    })
  }

  return (
    <BaseLayout>
      <form onSubmit={handleSubmit(onSubmit)}>
        <section>
          <div className="flex flex-row justify-between items-center pb-6 flex-wrap xs:gap-3">
            <BackButton title="Nuevo complemento" />
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
                  localStorage.removeItem("component-draft")
                }}
              />
              <Button
                text={"Guardar complemento"}
                className="flex h-10 w-full items-center justify-center px-4 rounded-md shadow-sm transition-all duration-700 focus:outline-none text-xs bg-sky-950 text-slate-50"
              />
            </div>
          </div>
        </section>
      </form>
    </BaseLayout>
  )
}
