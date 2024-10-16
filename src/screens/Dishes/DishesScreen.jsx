import React, { useEffect, useState } from "react"
import {
  Affix,
  Grid,
  Pagination,
  MantineProvider,
  createTheme,
  Switch,
  rem,
  Text,
  Button,
  Card,
  Group,
  Box,
  Image,
  Tooltip,
  Flex,
  Loader,
  TextInput
} from "@mantine/core"
import { useNavigate } from "react-router-dom"
import { colors } from "../../theme/colors"
import { NAVIGATION_ROUTES_RES_ADMIN } from "../../routes"
import { useDispatch, useSelector } from "react-redux"
import { IconX, IconCheck } from "@tabler/icons-react"
import {
  fetchDishes,
  selectAllDishes,
  selectDishesError,
  selectDishesStatus,
  setPage,
  updateDishStatus
} from "../../store/features/dishesSlice"
import BackButton from "./components/BackButton"
import { APP_ROLES } from "../../utils/constants"
import { getFormattedHNL } from "../../utils"

export default function Dishes() {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const user = useSelector((state) => state.user.value)

  const dishes = useSelector(selectAllDishes)
  const status = useSelector(selectDishesStatus)
  const error = useSelector(selectDishesError)
  const totalItems = useSelector((state) => state.dishes.totalItems)
  const filters = useSelector((state) => state.dishes.filters)
  const limit = useSelector((state) => state.dishes.itemsPerPage)
  const page = useSelector((state) => state.dishes.currentPage)
  const restaurant = useSelector((state) => state?.restaurant?.value)

  const totalControlBtn = Math.ceil(totalItems / limit)
  const [searchDish, setSearchDish] = useState("")
  const [cardsSelected, setCardsSelected] = useState([])

  const theme = createTheme({
    cursorType: "pointer"
  })

  useEffect(() => {
    dispatch(
      fetchDishes({
        limit,
        page,
        order: "DESC",
        restaurantId: user.restaurantId,
        filters
      })
    )
    setCardsSelected([])
  }, [page, dispatch, restaurant])

  const handleNewItem = () => {
    navigate(NAVIGATION_ROUTES_RES_ADMIN.Menu.submenu.Dishes.NewDish.path)
    setCardsSelected([])
  }

  const refreshPage = () => {
    dispatch(
      fetchDishes({
        limit,
        page,
        order: "DESC",
        restaurantId: user.restaurantId,
        filters
      })
    )
    setCardsSelected([])
  }

  const onChangePagination = (newPage) => {
    dispatch(setPage(newPage))
    setCardsSelected([])
  }

  const handleSelectAll = () => {
    const allSelected = dishes.map((dish) => dish.id)
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
    await dispatch(updateDishStatus({ dishData: { isActive: true }, propertyToUpdate: "isActive", dishId: id }))
    refreshPage()
  }

  const handleDisableSelected = async (id) => {
    await dispatch(updateDishStatus({ dishData: { isActive: false }, propertyToUpdate: "isActive", dishId: id }))
    refreshPage()
  }

  const handleClick = (id) => {
    let route = ""

    switch (user.role) {
      case APP_ROLES.branchAdmin:
        route = `${NAVIGATION_ROUTES_RES_ADMIN.Menu.submenu.Dishes.path}/${id}`
        break
      case APP_ROLES.cashierUser:
        route = `${NAVIGATION_ROUTES_RES_ADMIN.Menu.submenu.Dishes.path}/${id}`
        break
      case APP_ROLES.restaurantAdmin:
        route = `${NAVIGATION_ROUTES_RES_ADMIN.Menu.submenu.Dishes.path}/${id}`
        break
      default:
        break
    }

    navigate(route)
  }

  return (
    <>
      <Group grow mb="sm">
        <Flex align="center" justify="space-between">
          <BackButton title="Platillos" />
          <Flex align="center" gap="xs">
            <Flex align="center" gap={5}>
              <Text fw={700}>
                {page === 1 ? 1 : (page - 1) * limit + 1}-{page === 1 ? limit : Math.min(page * limit, totalItems)}
              </Text>
              <Text>de</Text>
              <Text fw={700}>{totalItems} platillos</Text>
            </Flex>
            <Button
              color={colors.main_app_color}
              className={`text-white text-md px-3 py-2 bg-primary_button mb-0 ${user.role !== APP_ROLES.branchAdmin && user.role !== APP_ROLES.cashierUser ? "" : "hidden"}`}
              onClick={handleNewItem}>
              Nuevo
            </Button>
          </Flex>
        </Flex>
      </Group>
      <Grid mb={5}>
        <Grid.Col span={{ base: 12 }}>
          <TextInput
            radius="md"
            placeholder="Buscar"
            value={""}
            onChange={""}
            rightSection={status === "loading" && <Loader color={colors.main_app_color} size={20} />}
          />
        </Grid.Col>
      </Grid>
      <section className="w-full">
        {status === "loading" ? (
          <div className="h-[calc(100vh-220px)] w-full flex justify-center items-center">
            <Loader color={colors.main_app_color} />
          </div>
        ) : dishes && dishes.length > 0 ? (
          <Grid>
            {dishes.map((item, key) => (
              <Grid.Col span={{ base: 12, md: 6, lg: 4, xl: 3 }} key={key}>
                <Card shadow="sm" padding="lg" radius="md" withBorder>
                  <Card.Section>
                    {/* Validación para asegurarse de que `item.images` exista y tenga al menos un elemento */}
                    {item?.images && item.images.length > 0 ? (
                      <Image src={item.images[0]?.location} h={200} fit="contain" alt={item?.name || "Imagen"} />
                    ) : (
                      <Image src="default-image-url.jpg" h={200} fit="cover" alt="Imagen no disponible" />
                    )}
                  </Card.Section>

                  <Group justify="space-between" mt="md" mb="xs">
                    <Box w={160}>
                      <Tooltip
                        label={item?.name}
                        position="bottom-start"
                        transitionProps={{ transition: "fade-down", duration: 300 }}>
                        <Text truncate="end" size="lg" fw={700}>
                          {item?.name}
                        </Text>
                      </Tooltip>
                    </Box>
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
                    {getFormattedHNL(item?.price)}
                  </Text>

                  <Button color={colors.main_app_color} fullWidth mt="md" radius="md" onClick={() => handleClick(item?.id)}>
                    Ver detalles
                  </Button>
                </Card>
              </Grid.Col>
            ))}
          </Grid>
        ) : (
          <div className="text-center mt-4 text-gray-500">Sin platillos disponibles!</div>
        )}
        {status === "error" && <div>Error: {error}</div>}
      </section>
      <section className="flex flex-row justify-between mt-5">
        <div />
        <Pagination
          total={totalControlBtn}
          page={page}
          limit={limit}
          onChange={onChangePagination}
          color={colors.main_app_color}
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
