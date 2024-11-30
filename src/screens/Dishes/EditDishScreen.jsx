import { Accordion } from "@mantine/core"
import React, { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import GeneralInformationForm from "./GeneralInformationForm"
import PaymentForm from "./PaymentForm"
import { useDispatch } from "react-redux"
import PreparationForm from "./PreparationForm"
import { updateDish } from "../../store/features/dishesSlice"
import { convertToDecimal } from "../../utils"
import dishesApi from "../../api/dishesApi"
import { useNavigate, useParams } from "react-router-dom"
import { NAVIGATION_ROUTES_RES_ADMIN } from "../../routes"
import { AdditionalForm } from "./AdditionalForm"
import FormLayout from "../../components/Form/FormLayout"
import { useSelector } from "react-redux"

export default function EditDishScreen() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { dishId } = useParams()
  const [isDataCleared, setIsDataCleared] = useState(false)
  const [dishDetails, setDishDetails] = useState({})
  const [additional, setAdditional] = useState([])
  const isLoading = useSelector((state) => state.dishes.updatingDish)

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
    })
  }

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        <FormLayout
          title={dishDetails?.name}
          show
          accordionTitles={["Información general", "Pagos", "Preparación", "Adicionales"]}
          accordionItems={items}
          navigate={() => navigate(NAVIGATION_ROUTES_RES_ADMIN.Menu.submenu.Dishes.path)}
          isLoading={isLoading}
          update
        />
      </form>
    </>
  )
}
