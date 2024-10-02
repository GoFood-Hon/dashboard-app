import React, { useRef, useState } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import { Accordion } from "@mantine/core"
import { useForm } from "react-hook-form"
import { useDispatch, useSelector } from "react-redux"
import { yupResolver } from "@hookform/resolvers/yup"
import BaseLayout from "../../components/BaseLayout"
import Button from "../../components/Button"
import GeneralInformationForm from "./GeneralInformationForm"
import PaymentForm from "./PaymentForm"
import { createDish } from "../../store/features/dishesSlice"
import { newItemValidationSchema } from "../../utils/inputRules"
import PreparationForm from "./PreparationForm"
import { NAVIGATION_ROUTES_RES_ADMIN } from "../../routes"
import BackButton from "./components/BackButton"
import { AdditionalForm } from "./AdditionalForm"
import { LoaderComponent } from "../../components/LoaderComponent"

export default function NewDish() {
  const location = useLocation()
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const user = useSelector((state) => state.user.value)
  const [isDataCleared, setIsDataCleared] = useState(false)
  const [additional, setAdditional] = useState([])
  const [isLoading, setIsLoading] = useState(false)

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
      title: "Adicionales",
      requirement: "Opcional",
      form: <AdditionalForm additional={additional} setAdditional={setAdditional} />
    },
    {
      title: "Pagos",
      requirement: "Obligatorio",
      form: <PaymentForm register={register} errors={errors} />
    },
    {
      title: "Preparación",
      requirement: "Obligatorio",
      form: <PreparationForm setValue={setValue} errors={errors} register={register} />
    }
    /*
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
    }, */

    /*  {
      title: "Bebidas",
      requirement: "Opcional",
      form: <DrinksForms />
    }, */
    /*  {
      title: "Extras",
      requirement: "Opcional",
      form: <ExtrasForm />
    },
  */
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
    setIsLoading(true)
    const restaurantId = user.restaurantId

    dispatch(createDish({ data, restaurantId, additionals: additional })).then((response) => {
      if (response.payload) {
        reset()
        setIsDataCleared(true)
        navigate(NAVIGATION_ROUTES_RES_ADMIN.Menu.submenu.Dishes.path)
      }
      setIsLoading(false)
    })
  }

  return (
    <BaseLayout>
      <form onSubmit={handleSubmit(onSubmit)}>
        <section>
          <div className="xs:gap-3 flex flex-row flex-wrap items-center justify-between pb-6">
            <BackButton title="Nuevo platillo" show />
          </div>
        </section>
        <section>
          <Accordion
            variant="separated"
            multiple
            defaultValue={["Información general", "Pagos", "Preparación", "Adicionales"]}
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
                  navigate(NAVIGATION_ROUTES_RES_ADMIN.Menu.submenu.Dishes.path)
                }}
              />
              {isLoading ? (
                <LoaderComponent width={24} size={25} />
              ) : (
                <Button
                  text={"Guardar"}
                  className="w-24 flex h-10 items-center justify-center rounded-md bg-sky-950 text-xs text-slate-50 shadow-sm transition-all duration-700 focus:outline-none"
                />
              )}
            </div>
          </div>
        </section>
      </form>
    </BaseLayout>
  )
}
