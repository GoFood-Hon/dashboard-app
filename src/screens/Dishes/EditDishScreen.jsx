import Button from "../../components/Button"
import { Accordion } from "@mantine/core"
import React, { useEffect, useRef, useState } from "react"
import { useForm } from "react-hook-form"
import GeneralInformationForm from "./GeneralInformationForm"
import PaymentForm from "./PaymentForm"
import { useDispatch } from "react-redux"
import PreparationForm from "./PreparationForm"
import { updateDish } from "../../store/features/dishesSlice"
import { EditAdditionalForm } from "./EditAdditionalForm"
import { convertToDecimal } from "../../utils"
import dishesApi from "../../api/dishesApi"
import { useNavigate, useParams } from "react-router-dom"
import BaseLayout from "../../components/BaseLayout"
import BackButton from "./components/BackButton"
import { NAVIGATION_ROUTES_RES_ADMIN } from "../../routes"
import { LoaderComponent } from "../../components/LoaderComponent"

export default function EditDishScreen() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { dishId } = useParams()
  const [isDataCleared, setIsDataCleared] = useState(false)
  const [dishDetails, setDishDetails] = useState({})
  const [additional, setAdditional] = useState([])
  const [isLoading, setIsLoading] = useState(false)

  const containerRef = useRef(null)
  const {
    register,
    handleSubmit,
    setValue,
    control,
    reset,
    watch,
    formState: { errors }
  } = useForm({
    defaultValues: dishDetails || {}
  })

  const imageLocation = watch("images[0].location")

  useEffect(() => {
    const fetchDish = async () => {
      try {
        const response = await dishesApi.getDish(dishId)
        const details = response?.data
        setDishDetails(details)
        if (details?.additionals) {
          setAdditional(details.additionals)
        }
      } catch (error) {
        dispatch(setError("Error fetching dishes"))
        throw error
      }
    }
    fetchDish()
  }, [])

  useEffect(() => {
    if (Object.keys(dishDetails).length > 0) {
      reset(dishDetails)
    }
  }, [dishDetails, reset])

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
          image={imageLocation}
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
    setIsLoading(true)
    const dishId = data.id
    const dishData = {
      ...data,
      price: convertToDecimal(data?.price),
      additionals: additional
    }

    dispatch(updateDish({ dishData, dishId })).then((response) => {
      if (!response.payload.status) {
        navigate(NAVIGATION_ROUTES_RES_ADMIN.Menu.submenu.Dishes.path)
      }
      setIsLoading(false)
    })
    close()
  }

  return (
    <BaseLayout>
      <form onSubmit={handleSubmit(onSubmit)}>
        <section>
          <div className="xs:gap-3 flex flex-row flex-wrap items-center justify-between pb-6">
            <BackButton title="Editar platillo" />
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
                  navigate(NAVIGATION_ROUTES_RES_ADMIN.Menu.submenu.Dishes.path)
                }}
              />
              {isLoading ? (
                <LoaderComponent width={24} size={25} />
              ) : (
                <Button
                  text={"Actualizar"}
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
