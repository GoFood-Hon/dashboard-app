import React, { useEffect, useRef, useState } from "react"
import { useNavigate } from "react-router-dom"
import { Accordion, Button, Flex, Paper } from "@mantine/core"
import { useForm } from "react-hook-form"
import { useDispatch, useSelector } from "react-redux"
import { yupResolver } from "@hookform/resolvers/yup"
import toast from "react-hot-toast"
import GeneralInformationForm from "./GeneralInformationForm"
import ComplementsForm from "../Dishes/ComplementsForm"
import dishesApi from "../../api/dishesApi"
import { newMenuValidation } from "../../utils/inputRules"
import { createMenu } from "../../store/features/menuSlice"
import BackButton from "../Dishes/components/BackButton"
import { NAVIGATION_ROUTES_RES_ADMIN } from "../../routes"
import { colors } from "../../theme/colors"

export default function NewMenu() {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const restaurant = useSelector((state) => state.restaurants.restaurants)
  const user = useSelector((state) => state.user.value)
  const [isLoading, setIsLoading] = useState(false)

  const {
    register,
    handleSubmit,
    setValue,
    control,
    reset,
    formState: { errors }
  } = useForm({
    resolver: yupResolver(newMenuValidation)
  })

  const [isDataCleared, setIsDataCleared] = useState(false)
  const [dishes, setDishes] = useState([])

  useEffect(() => {
    async function getDishes() {
      try {
        const response = await dishesApi.getAllDishesByRestaurant({
          restaurantId: user.restaurantId
        })

        const activeDishes = response.data.filter((dish) => dish.isActive)
        setDishes(activeDishes)
        return response
      } catch (error) {
        toast.error(`Hubo un error obteniendo los platos, ${error}`)
        throw error
      }
    }

    getDishes()
  }, [restaurant])

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
      title: "Platillos",
      requirement: "Obligatorio",
      form: (
        <ComplementsForm
          setValue={setValue}
          isDataCleared={isDataCleared}
          defaultMessage="Por favor seleccione platillos para este menú"
          itemsAvailableLabel="Platillos disponibles"
          data={dishes}
          name={"dishes"}
        />
      )
    }
  ]

  const items = accordionStructure.map((item, key) => (
    <Accordion.Item key={key} value={item.title}>
      <Accordion.Control>
        <div className="w-full rounded-lg flex-row flex items-center">
          <div
            className={`text-slate-50 text-base font-bold bg-[${colors.main_app_color}] rounded-full p-2 w-8 h-8 flex items-center justify-center`}>
            {key + 1}
          </div>
          <span className="text-base font-bold  leading-normal ml-4">{item.title}</span>
          <span className="text-base font-normal ml-1">({item?.requirement})</span>
        </div>
      </Accordion.Control>
      <Accordion.Panel>{item.form}</Accordion.Panel>
    </Accordion.Item>
  ))

  const onSubmit = (data) => {
    setIsLoading(true)
    const restaurantId = user.restaurantId
    dispatch(createMenu({ data, restaurantId })).then((response) => {
      if (response.payload) {
        reset()
        // localStorage.removeItem("draft")
        navigate(NAVIGATION_ROUTES_RES_ADMIN.Menu.path)
        setIsDataCleared(true)
      }
      setIsLoading(false)
    })
  }

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        <section>
          <div className="flex flex-row justify-between items-center pb-4 flex-wrap xs:gap-3">
            <BackButton title="Nuevo menú" show />
          </div>
        </section>
        <section>
          <Accordion variant="separated" multiple defaultValue={["Información general", "Platillos"]}>
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
                  navigate(NAVIGATION_ROUTES_RES_ADMIN.Menu.path)
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
