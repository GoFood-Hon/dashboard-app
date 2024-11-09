import React, { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate, useParams } from "react-router-dom"
import { Accordion, Paper, Button, Flex } from "@mantine/core"
import BackButton from "../Dishes/components/BackButton"
import GeneralInformationForm from "./GeneralInformationForm"
import ComplementsForm from "../Dishes/ComplementsForm"
import dishesApi from "../../api/dishesApi"
import { updateMenu } from "../../store/features/menuSlice"
import menuApi from "../../api/menuApi"
import { NAVIGATION_ROUTES_RES_ADMIN } from "../../routes"
import { showNotification } from "@mantine/notifications"
import { colors } from "../../theme/colors"

export default function EditMenuScreen() {
  const { menuId } = useParams()
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const user = useSelector((state) => state.user.value)
  const [menuDetails, setMenuDetails] = useState({})
  const restaurant = useSelector((state) => state?.restaurant?.value)
  const [isDataCleared, setIsDataCleared] = useState(false)
  const [dishes, setDishes] = useState([])
  const [isLoading, setIsLoading] = useState(false)

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    control,
    watch,
    formState: { errors }
  } = useForm({
    defaultValues: menuDetails || {}
  })

  const imageLocation = watch("images[0].location")

  useEffect(() => {
    async function getDishes() {
      try {
        const response = await dishesApi.getAllDishesByRestaurant({
          restaurantId: user.restaurantId
        })
        setDishes(response.data)

        return response
      } catch (error) {
        showNotification({
          title: "Error",
          message: error,
          color: "red",
          duration: 7000
        })
        throw error
      }
    }
    getDishes()
  }, [])

  useEffect(() => {
    const fetchMenu = async () => {
      try {
        const response = await menuApi.getMenuDetails({ menuId })
        const menuDetails = response?.data
        setMenuDetails(menuDetails)
      } catch (error) {
        showNotification({
          title: "Error",
          message: error,
          color: "red",
          duration: 7000
        })
        throw error
      }
    }
    fetchMenu()
  }, [menuId, reset])

  useEffect(() => {
    if (Object.keys(menuDetails).length > 0) {
      reset(menuDetails)
    }
  }, [menuDetails, reset])

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
      title: "Platillos",
      requirement: "Obligatorio",
      form: (
        <ComplementsForm
          setValue={setValue}
          isDataCleared={isDataCleared}
          selectedDishes={menuDetails?.Dishes}
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
        <div className="w-full rounded-lg flex-row flex items-center ">
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
    dispatch(updateMenu({ data })).then((response) => {
      if (!response.payload.status) {
        navigate(NAVIGATION_ROUTES_RES_ADMIN.Menu.path)
      }
    })
  }

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        <section>
          <div className="flex flex-row justify-between items-center pb-6 flex-wrap xs:gap-3">
            <BackButton title="Editar menú" show />
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
