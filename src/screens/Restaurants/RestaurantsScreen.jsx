import React, { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import {
  Affix,
  Card,
  Grid,
  Group,
  Image,
  Pagination,
  Text,
  Button,
  MantineProvider,
  Switch,
  createTheme,
  rem
} from "@mantine/core"
import { useDispatch, useSelector } from "react-redux"
import ItemCard from "../../components/ItemCard"
import { fetchRestaurants, setPage, updateRestaurant } from "../../store/features/restaurantSlice"
import { colors } from "../../theme/colors"
import { NAVIGATION_ROUTES_SUPER_ADMIN } from "../../routes"
import BackButton from "../Dishes/components/BackButton"
import { IconCheck } from "@tabler/icons-react"
import { IconX } from "@tabler/icons-react"

export default function RestaurantsScreen() {
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const limit = useSelector((state) => state.restaurants.itemsPerPage)
  const totalItems = useSelector((state) => state.restaurants.totalItems)
  const page = useSelector((state) => state.restaurants.currentPage)
  const restaurant = useSelector((state) => state?.restaurants?.value?.data)

  const theme = createTheme({
    cursorType: "pointer"
  })
  const totalControlBtn = Math.ceil(totalItems / limit)

  const [cardsSelected, setCardsSelected] = useState([])

  useEffect(() => {
    dispatch(
      fetchRestaurants({
        limit,
        page,
        order: "DESC"
      })
    )
    console.log(restaurant)
    setCardsSelected([])
  }, [dispatch, page])

  const refreshPage = () => {
    dispatch(
      fetchRestaurants({
        limit,
        page,
        order: "DESC"
      })
    )
    setCardsSelected([])
  }

  const onChangePagination = (newPage) => {
    dispatch(setPage(newPage))
    setCardsSelected([])
  }

  const handleSelectAll = () => {
    const allSelected = restaurant.map((item) => item.id)
    setCardsSelected(allSelected)
  }

  const handleDeselectAll = () => {
    setCardsSelected([])
  }

  const handleChangeSelected = (index) => {
    if (cardsSelected.includes(index)) {
      setCardsSelected(cardsSelected.filter((i) => i !== index))
    } else {
      setCardsSelected([...cardsSelected, index])
    }
  }

  const handleEnableSelected = async (id) => {
    // await Promise.all(
    //   cardsSelected.map(async (id) => {
    //     await dispatch(updateRestaurant({ data: { id, isActive: true }, propertyToUpdate: "isActive" }))
    //   })
    // )
    dispatch(updateRestaurant({ data: { id, isActive: true }, propertyToUpdate: "isActive" }))
    refreshPage()
  }

  const handleDisableSelected = async (id) => {
    // await Promise.all(
    //   cardsSelected.map(async (id) => {
    //     await dispatch(updateRestaurant({ data: { id, isActive: false }, propertyToUpdate: "isActive" }))
    //   })
    // )
    dispatch(updateRestaurant({ data: { id, isActive: false }, propertyToUpdate: "isActive" }))
    refreshPage()
  }

  const handleClick = (id) => {
    navigate(`${NAVIGATION_ROUTES_SUPER_ADMIN.Restaurants.path}/${id}`)
  }

  const handleNewItem = () => {
    navigate(NAVIGATION_ROUTES_SUPER_ADMIN.Restaurants.NewRestaurant.path)
  }

  return (
    <>
      <section>
        <div className="flex flex-row justify-between items-center pb-4 w-full">
          <BackButton title="Restaurantes" />
          <div className="flex flex-row justify-between">
            <div className="flex flex-row w-full justify-end items-center">
              <div className="flex flex-row mr-4">
                <span className={`text-base font-bold leading-normal`}>{page === 1 ? 1 : (page - 1) * limit + 1}</span>
                <span className="text-base font-bold leading-normal space-x-2">-</span>
                <span className="text-base font-bold leading-normal">
                  {page === 1 ? limit : Math.min(page * limit, totalItems)}
                </span>
                <span className="text-base font-medium leading-normal px-1"> de </span>
                <span className="text-base font-bold leading-normal">{totalItems} restaurantes</span>
              </div>
              <Button color={colors.main_app_color} onClick={handleNewItem}>
                Nuevo
              </Button>
            </div>
          </div>
        </div>
      </section>
      <section className="w-full">
        {restaurant && restaurant.length > 0 ? (
          <Grid>
            {restaurant.map((item, key) => (
              <Grid.Col span={{ base: 12, md: 4 }} key={key}>
                <Card shadow="sm" padding="lg" radius="md" withBorder>
                  <Card.Section>
                    {/* Validación para asegurarse de que `item.images` exista y tenga al menos un elemento */}
                    {item?.images && item.images.length > 0 ? (
                      <Image src={item.images[0]?.location} h={200} fit="cover" alt={item?.name || "Imagen"} />
                    ) : (
                      <Image src="default-image-url.jpg" h={200} fit="cover" alt="Imagen no disponible" />
                    )}
                  </Card.Section>

                  <Group justify="space-between" mt="md" mb="xs">
                    <Text size="lg" fw={700}>
                      {item?.name}
                    </Text>
                    <MantineProvider theme={theme}>
                      <Switch
                        checked={item?.isActive}
                        onChange={() => (item?.isActive ? handleDisableSelected(item?.id) : handleEnableSelected(item?.id))}
                        color={colors.main_app_color}
                        size="md"
                        thumbIcon={
                          item?.isActive ? (
                            <IconCheck style={{ width: rem(12), height: rem(12) }} stroke={3} color={colors.main_app_color} />
                          ) : (
                            <IconX style={{ width: rem(12), height: rem(12) }} stroke={3} color={colors.main_app_color} />
                          )
                        }
                      />
                    </MantineProvider>
                  </Group>

                  <Text size="sm" c="dimmed" h={50}>
                    {item?.socialReason}
                  </Text>

                  <Button color={colors.main_app_color} fullWidth mt="md" radius="md" onClick={() => handleClick(item?.id)}>
                    Ver detalles
                  </Button>
                </Card>
              </Grid.Col>
            ))}
          </Grid>
        ) : (
          <div className="text-center mt-4 text-gray-500">No hay restaurantes para mostrar</div>
        )}
      </section>

      <section className="flex flex-row justify-between pt-8">
        <div />
        <Pagination
          total={totalControlBtn}
          page={page}
          limit={limit}
          defaultValue={page}
          onChange={onChangePagination}
          color={colors.main_app_color}
          size="md"
        />
      </section>
      <section>
        {cardsSelected.length >= 1 && (
          <Affix position={{ bottom: 20, left: "calc(50% - 270px)" }}>
            <div className="w-full flex flex-row justify-end mt-6 gap-3 rounded-lg bg-white px-8 py-5 border border-gray-100 shadow">
              <Button
                text={"Deshabilitar seleccionados"}
                className={"text-xs border border-red-400 text-red-400 bg-white"}
                onClick={handleDisableSelected}
              />
              <Button
                text={"Habilitar seleccionados"}
                className={"text-xs border border-emerald-400 text-emerald-400 bg-white"}
                onClick={handleEnableSelected}
              />
              <Button
                text={"Deseleccionar todos"}
                className={"text-xs border border-sky-950 text-sky-950 bg-white"}
                onClick={handleDeselectAll}
              />
              <Button
                text={"Seleccionar todos"}
                className={"text-xs border border-sky-950 text-white bg-sky-950"}
                onClick={handleSelectAll}
              />
            </div>
          </Affix>
        )}
      </section>
    </>
  )
}
