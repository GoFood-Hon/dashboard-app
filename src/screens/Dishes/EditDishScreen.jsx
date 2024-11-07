import { Accordion, Flex, Paper, Button } from "@mantine/core"
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
import BackButton from "./components/BackButton"
import { NAVIGATION_ROUTES_RES_ADMIN } from "../../routes"
import { colors } from "../../theme/colors"
import { AdditionalForm } from "./AdditionalForm"

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
          data={dishDetails}
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
      requirement: "Opcional",
      form: <PreparationForm setValue={setValue} errors={errors} isDataCleared={isDataCleared} register={register} />
    }
  ]
  const items = accordionStructure.map((item, key) => (
    <Accordion.Item key={key} value={item.title}>
      <Accordion.Control>
        <div className="w-full rounded-lg flex-row flex items-center">
          <div className="text-base font-bold bg-[#EE364C] rounded-full p-2 w-8 h-8 flex items-center justify-center text-slate-50">
            {key + 1}
          </div>
          <span className="text-base font-bold  leading-normal ml-4">{item.title}</span>
          <span className="text-base font-normal ml-1">({item?.requirement})</span>
        </div>
      </Accordion.Control>
      <Accordion.Panel>{item.form}</Accordion.Panel>
    </Accordion.Item>
  ))

  const onSubmit = async (data) => {
    setIsLoading(true)
    const dishId = data.id
    const { additionals: _, tags, ...restOfData } = data

    const formatTags = (tags) => {
      if (tags?.length > 0 && typeof tags[0] === "object") {
        return tags.map((tag) => tag.id) 
      }
      return tags
    }

    const dishData = {
      ...restOfData,
      price: convertToDecimal(data?.price),
      additionals: additional,
      tags: formatTags(tags)
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
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        <section>
          <div className="xs:gap-3 flex flex-row flex-wrap items-center justify-between pb-6">
            <BackButton title="Editar platillo" show />
          </div>
        </section>
        <section>
          <Accordion variant="separated" multiple defaultValue={["Información general", "Pagos", "Preparación", "Adicionales"]}>
            {items}
          </Accordion>
        </section>
        <section className="mt-2">
          <Paper withBorder radius="md" className="w-full flex md:justify-end md:gap-3 rounded-md px-8 py-5">
            <Flex justify="end" gap="xs">
              <Button
                color={colors.main_app_color}
                variant="outline"
                onClick={() => {
                  navigate(NAVIGATION_ROUTES_RES_ADMIN.Menu.submenu.Dishes.path)
                }}>
                Descartar
              </Button>
              <Button loading={isLoading} color={colors.main_app_color} type="submit">
                Actualizar
              </Button>
            </Flex>
          </Paper>
        </section>
      </form>
    </>
  )
}
