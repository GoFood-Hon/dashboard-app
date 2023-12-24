import React, { useEffect, useState } from "react"
import BaseLayout from "../../components/BaseLayout"
import { Accordion, Breadcrumbs } from "@mantine/core"
import BreadCrumbNavigation from "../../components/BreadCrumbNavigation"
import { useLocation, useNavigate } from "react-router-dom"
import { yupResolver } from "@hookform/resolvers/yup"
import { newBranchValidation } from "../../utils/inputRules"
import { useForm } from "react-hook-form"
import Button from "../../components/Button"
import GeneralInformationForm from "./GeneralInformationForm"
import ComplementsForm from "../Dishes/ComplementsForm"
import LocationForm from "./LocationForm"
import TimeForm from "./TimeForm"

export default function NewBranch() {
  const location = useLocation()
  const navigate = useNavigate()

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
  const [personal, setPersonal] = useState([])

  const onSubmit = (data) => {}

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
      title: "Personal",
      requirement: "Obligatorio",
      form: (
        <ComplementsForm
          setValue={setValue}
          isDataCleared={isDataCleared}
          defaultMessage="Por favor seleccione personal para esta sucursal"
          itemsAvailableLabel="Personal disponible"
          data={personal}
          name={"personal"}
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
      form: <TimeForm />
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

  const onSaveDraft = (data) => {}
  return (
    <BaseLayout>
      <form onSubmit={handleSubmit(onSubmit)}>
        <section>
          <div className="flex flex-row justify-between items-center pb-6 flex-wrap xs:gap-3">
            <div className="flex flex-row gap-x-3 items-center">
              <h1 className="text-white-200 md:text-2xl font-semibold">Nueva sucursal</h1>
            </div>
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
                  localStorage.removeItem("draft")
                  toast.success("Información eliminada")
                  navigate(NAVIGATION_ROUTES.Menu.submenu.Dishes.path)
                }}
              />
              {/*  <Button
                text={"Guardar como borrador"}
                className={"text-xs border bg-white border-sky-950 text-sky-950"}
                onClick={handleSubmit(onSaveDraft)}
              /> */}
              <Button
                text={"Guardar platillo"}
                className="flex h-10 w-full items-center justify-center px-4 rounded-md shadow-sm transition-all duration-700 focus:outline-none text-xs bg-sky-950 text-slate-50"
              />
            </div>
          </div>
        </section>
      </form>
    </BaseLayout>
  )
}
