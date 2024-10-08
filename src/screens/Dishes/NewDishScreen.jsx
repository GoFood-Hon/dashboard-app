import React, { useRef, useState } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import { Accordion, Flex, Paper, Button } from "@mantine/core"
import { useForm } from "react-hook-form"
import { useDispatch, useSelector } from "react-redux"
import { yupResolver } from "@hookform/resolvers/yup"
import GeneralInformationForm from "./GeneralInformationForm"
import PaymentForm from "./PaymentForm"
import { createDish } from "../../store/features/dishesSlice"
import { newItemValidationSchema } from "../../utils/inputRules"
import PreparationForm from "./PreparationForm"
import { NAVIGATION_ROUTES_RES_ADMIN } from "../../routes"
import BackButton from "./components/BackButton"
import { AdditionalForm } from "./AdditionalForm"
import { colors } from "../../theme/colors"

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
        <div className="flex w-full flex-row items-center rounded-lg">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#EE364C] p-2 text-base font-bold text-slate-50">
            {key + 1}
          </div>
          <span className="ml-4 text-base font-bold  leading-normal">{item.title}</span>
          <span className="ml-1 text-base font-normal">({item?.requirement})</span>
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
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        <section>
          <div className="xs:gap-3 flex flex-row flex-wrap items-center justify-between pb-6">
            <BackButton title="Nuevo platillo" show />
          </div>
        </section>
        <section>
          <Accordion variant="separated" multiple defaultValue={["Información general", "Pagos", "Preparación", "Adicionales"]}>
            {items}
          </Accordion>
        </section>
        <section>
          <Paper withBorder radius="md" className="w-full flex md:justify-end mt-3 md:gap-3 rounded-md px-8 py-5">
            <Flex justify="end" gap="xs">
              <Button
                color={colors.main_app_color}
                variant="outline"
                onClick={() => {
                  reset()
                  localStorage.removeItem("draft")
                  navigate(NAVIGATION_ROUTES_RES_ADMIN.Menu.submenu.Dishes.path)
                }}>
                Descartar
              </Button>
              <Button
                loading={isLoading}
                color={colors.main_app_color}
                type="submit"
                className="w-24 text-center flex h-10 items-center justify-center rounded-md shadow-sm transition-all duration-700 focus:outline-none text-xs bg-sky-950 text-slate-50">
                Guardar
              </Button>
            </Flex>
          </Paper>
        </section>
      </form>
    </>
  )
}
