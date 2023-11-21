import React, { useEffect, useRef, useState } from "react"
import { useLocation } from "react-router-dom"
import { Breadcrumbs, Accordion, Affix, Transition } from "@mantine/core"
import { useForm } from "react-hook-form"
import BaseLayout from "../../components/BaseLayout"
import Button from "../../components/Button"
import ExtrasForm from "./ExtrasForm"
import GeneralInformationForm from "./GeneralInformationForm"
import PaymentForm from "./PaymentForm"
import BreadCrumbNavigation from "../../components/BreadCrumbNavigation"
import { useDispatch, useSelector } from "react-redux"
import { createDish } from "../../store/features/DishesSlice"
import { newItemValidationSchema } from "../../utils/inputRules"
import { yupResolver } from "@hookform/resolvers/yup"
import toast from "react-hot-toast"
import PreparationForm from "./PreparationForm"
import ComplementsForm from "./ComplementsForm"

export default function NewDish() {
  const location = useLocation()
  const dispatch = useDispatch()
  const restaurant = useSelector((state) => state.restaurant.value)

  const [isDataCleared, setIsDataCleared] = useState(false)
  const [isAffixMounted, setAffixMounted] = useState(false)
  const containerRef = useRef(null)

  const {
    register,
    handleSubmit,
    setValue,
    control,
    reset,
    formState: { errors }
  } = useForm({
    resolver: yupResolver(newItemValidationSchema)
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
      title: "Extras",
      requirement: "Opcional",
      form: <ComplementsForm />
    },
    /*  {
      title: "Bebidas",
      requirement: "Opcional",
      form: <DrinksForms />
    }, */
    /*  {
      title: "Extras",
      requirement: "Opcional",
      form: <ExtrasForm />
    }, */
    {
      title: "Pagos",
      requirement: "Obligatorio",
      form: <PaymentForm register={register} errors={errors} />
    },
    {
      title: "Preparación",
      requirement: "Opcional",
      form: <PreparationForm setValue={setValue} errors={errors} />
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

  /*   useEffect(() => {
    const container = containerRef.current

    if (container) {
      const observer = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
          setAffixMounted(false)
        } else {
          setAffixMounted(true)
        }
      })

      observer.observe(container)
      return () => {
        observer.disconnect()
      }
    }
  }, []) */

  const onSubmit = (data) => {
    dispatch(createDish({ data, restaurant })).then((response) => {
      if (response.payload) {
        reset()
        localStorage.removeItem("draft")
        setIsDataCleared(true)
      }
    })
  }

  const onSaveDraft = (data) => {
    const formData = JSON.stringify({
      name: data.name,
      files: data.files[0],
      price: data.price,
      description: data.description,
      includesDrink: data.includeDrink,
      endPrice: data.endPrice,
      categoryId: data.categoryId,
      restaurantId: restaurant.id
    })

    localStorage.setItem("draft", formData)

    toast.success("Platillo guardado como borrador")

    reset()
  }

  const onDiscard = () => {
    localStorage.removeItem("draft")
    reset()
  }

  useEffect(() => {
    const draftData = localStorage.getItem("draft")

    if (draftData) {
      const parsedData = JSON.parse(draftData)

      Object.keys(parsedData).forEach((field) => {
        setValue(field, parsedData[field])
      })
      toast.success("Platillo cargado desde borrador")
    }
  }, [setValue])

  return (
    <BaseLayout>
      <form onSubmit={handleSubmit(onSubmit)}>
        <section>
          <div className="flex flex-row justify-between items-center pb-6 flex-wrap xs:gap-3">
            <div className="flex flex-row gap-x-3 items-center">
              <h1 className="text-white-200 md:text-2xl font-semibold">Nuevo Platillo</h1>
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
        <section ref={containerRef}>
          {/*  <Affix position={{ bottom: 20, left: "calc(50% - 200px)" }}>
            <Transition transition="slide-down" mounted={isAffixMounted} duration={400} timingFunction="ease">
              {(transitionStyles) => (
                <div
                  className="w-full flex flex-row justify-end mt-6 gap-3 rounded-lg bg-white px-8 py-5 border border-gray-100 shadow"
                  style={transitionStyles}>
                  <Button
                    text={"Descartar"}
                    className={"text-xs border border-red-400 text-red-400 bg-white"}
                    onClick={() => {
                      reset()
                      localStorage.removeItem("draft")
                      toast.success("Información eliminada")
                    }}
                  />
                  <Button
                    text={"Guardar como borrador"}
                    className={"text-xs border bg-white border-sky-950 text-sky-950"}
                    onClick={handleSubmit(onSaveDraft)}
                  />
                  <Button
                    text={"Guardar platillo"}
                    onClick={() => handleSubmit(onSubmit)}
                    className="flex h-10 w-full items-center justify-center px-4 rounded-md shadow-sm transition-all duration-700 focus:outline-none text-xs bg-sky-950 text-slate-50"
                  />
                </div>
              )}
            </Transition>
          </Affix> */}
          {!isAffixMounted && (
            <div className="w-full flex md:justify-end mt-6 md:gap-3 rounded-md bg-white px-8 py-5 border border-gray-200">
              <div className="md:w-2/3 lg:1/3 sm:w-full flex flex-row justify-end gap-3 sm:flex-wrap md:flex-nowrap">
                <Button
                  text={"Descartar"}
                  className={"text-xs border border-red-400 text-red-400 bg-white"}
                  onClick={() => {
                    reset()
                    localStorage.removeItem("draft")
                    toast.success("Información eliminada")
                  }}
                />
                <Button
                  text={"Guardar como borrador"}
                  className={"text-xs border bg-white border-sky-950 text-sky-950"}
                  onClick={handleSubmit(onSaveDraft)}
                />
                <Button
                  text={"Guardar platillo"}
                  className="flex h-10 w-full items-center justify-center px-4 rounded-md shadow-sm transition-all duration-700 focus:outline-none text-xs bg-sky-950 text-slate-50"
                />
              </div>
            </div>
          )}
        </section>
      </form>
    </BaseLayout>
  )
}
