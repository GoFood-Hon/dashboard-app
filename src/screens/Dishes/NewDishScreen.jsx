import React, { useEffect, useRef, useState } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import { Breadcrumbs, Accordion } from "@mantine/core"
import { useForm } from "react-hook-form"
import { useDispatch, useSelector } from "react-redux"
import { yupResolver } from "@hookform/resolvers/yup"
import toast from "react-hot-toast"

import BaseLayout from "../../components/BaseLayout"
import Button from "../../components/Button"
import GeneralInformationForm from "./GeneralInformationForm"
import PaymentForm from "./PaymentForm"
import BreadCrumbNavigation from "../../components/BreadCrumbNavigation"
import { createDish } from "../../store/features/dishesSlice"
import { newItemValidationSchema } from "../../utils/inputRules"
import PreparationForm from "./PreparationForm"
import ComplementsForm from "./ComplementsForm"
import { NAVIGATION_ROUTES } from "../../routes"
import complementsApi from "../../api/complementsApi"
import BackButton from "./components/BackButton"
import { CategoriesForm } from "./CategoriesForm"

export default function NewDish() {
  const location = useLocation()
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const user = useSelector((state) => state.user.value)

  const [isDataCleared, setIsDataCleared] = useState(false)
  const [extras, setExtras] = useState([])

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

  useEffect(() => {
    async function getExtras() {
      try {
        const response = await complementsApi.getAddOnByRestaurant({
          restaurantId: user.restaurantId,
          category: "extra"
        })
        setExtras(response.data.data)

        return response
      } catch (error) {
        toast.error(`Hubo error obteniendo los extras, ${error}`)
        throw error
      }
    }
    getExtras()
  }, [])

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
      form: (
        <ComplementsForm
          setValue={setValue}
          isDataCleared={isDataCleared}
          defaultMessage="Por favor seleccione complementos extras para este platillo"
          itemsAvailableLabel="Extras disponibles"
          data={extras}
          name={"extras"}
        />
      )
    },
    {
      title: "Categorías",
      requirement: "Opcional",
      form: (
        <CategoriesForm
          register={register}
          errors={errors}
          setValue={setValue}
          control={control}
          isDataCleared={isDataCleared}
          defaultMessage="Por favor seleccione complementos extras para este platillo"
          itemsAvailableLabel="Extras disponibles"
          data={extras}
          name={"extras"}
        />
      )
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
      requirement: "Obligatorio",
      form: <PreparationForm setValue={setValue} errors={errors} />
    }
  ]

  const items = accordionStructure.map((item, key) => (
    <Accordion.Item key={key} value={item.title}>
      <Accordion.Control>
        <div className="flex w-full flex-row items-center rounded-lg bg-white">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-sky-950 p-2 text-base font-bold text-slate-50">
            {key + 1}
          </div>
          <span className="ml-4 text-base font-bold  leading-normal text-sky-950">{item.title}</span>
          <span className="ml-1 text-base font-normal text-sky-950">({item?.requirement})</span>
        </div>
      </Accordion.Control>
      <Accordion.Panel>{item.form}</Accordion.Panel>
    </Accordion.Item>
  ))

  const onSubmit = (data) => {
    const restaurantId = user.restaurantId
    dispatch(createDish({ data, restaurantId })).then((response) => {
      if (response.payload) {
        reset()
        setIsDataCleared(true)
        navigate(NAVIGATION_ROUTES.Menu.submenu.Dishes.path)
      }
    })
  }

  return (
    <BaseLayout>
      <form onSubmit={handleSubmit(onSubmit)}>
        <section>
          <div className="xs:gap-3 flex flex-row flex-wrap items-center justify-between pb-6">
            <BackButton title="Nuevo platillo" />
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
            defaultValue={["Información general", "Pagos", "Preparación"]}
            classNames={{
              label: "bg-white fill-white"
            }}>
            {items}
          </Accordion>
        </section>
        <section ref={containerRef}>
          <div className="mt-6 flex w-full rounded-md border border-gray-200 bg-white px-8 py-5 md:justify-end md:gap-3">
            <div className="lg:1/3 flex flex-row justify-end gap-3 sm:w-full sm:flex-wrap md:w-2/3 md:flex-nowrap">
              <Button
                text={"Descartar"}
                className={"border border-red-400 bg-white text-xs text-red-400"}
                onClick={() => {
                  reset()
                  localStorage.removeItem("draft")
                  toast.success("Información eliminada")
                  navigate(NAVIGATION_ROUTES.Menu.submenu.Dishes.path)
                }}
              />
              <Button
                text={"Guardar platillo"}
                className="flex h-10 w-full items-center justify-center rounded-md bg-sky-950 px-4 text-xs text-slate-50 shadow-sm transition-all duration-700 focus:outline-none"
              />
            </div>
          </div>
        </section>
      </form>
    </BaseLayout>
  )
}
