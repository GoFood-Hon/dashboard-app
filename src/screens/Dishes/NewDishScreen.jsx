import React, { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Accordion } from "@mantine/core"
import { useForm } from "react-hook-form"
import { useDispatch, useSelector } from "react-redux"
import { yupResolver } from "@hookform/resolvers/yup"
import GeneralInformationForm from "./GeneralInformationForm"
import PaymentForm from "./PaymentForm"
import { createDish } from "../../store/features/dishesSlice"
import { newItemValidationSchema } from "../../utils/inputRules"
import PreparationForm from "./PreparationForm"
import { NAVIGATION_ROUTES_RES_ADMIN } from "../../routes"
import { AdditionalForm } from "./AdditionalForm"
import FormLayout from "../../components/Form/FormLayout"

export default function NewDish() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const user = useSelector((state) => state.user.value)
  const [isDataCleared, setIsDataCleared] = useState(false)
  const [additional, setAdditional] = useState([])
  const [isLoading, setIsLoading] = useState(false)

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
        <FormLayout
          title="Nuevo platillo"
          show
          accordionTitles={["Información general", "Pagos", "Preparación", "Adicionales"]}
          accordionItems={items}
          navigate={() => navigate(NAVIGATION_ROUTES_RES_ADMIN.Menu.submenu.Dishes.path)}
          isLoading={isLoading}
        />
      </form>
    </>
  )
}
