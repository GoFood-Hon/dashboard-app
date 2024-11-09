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
  rem,
  Box,
  Tooltip,
  Loader,
  Flex
} from "@mantine/core"
import { useDispatch, useSelector } from "react-redux"
import { fetchRestaurants, setPage, updateRestaurantStatus } from "../../store/features/restaurantSlice"
import { colors } from "../../theme/colors"
import { NAVIGATION_ROUTES_SUPER_ADMIN } from "../../routes"
import BackButton from "../Dishes/components/BackButton"
import { IconCheck } from "@tabler/icons-react"
import { IconX } from "@tabler/icons-react"
import { useWindowScroll } from "@mantine/hooks"

export default function RestaurantsScreen() {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const limit = useSelector((state) => state.restaurants.itemsPerPage)
  const page = useSelector((state) => state.restaurants.currentPage)
  const restaurantsPerPage = useSelector((state) => state.restaurants.restaurantsPerPage)
  const totalRestaurants = useSelector((state) => state.restaurants.totalRestaurants)
  const totalPageCount = useSelector((state) => state.restaurants.totalPagesCount)
  const restaurantsList = restaurantsPerPage[page] || []
  const loadingRestaurants = useSelector((state) => state.restaurants.loadingRestaurants)

  const theme = createTheme({
    cursorType: "pointer"
  })

  const [cardsSelected, setCardsSelected] = useState([])

  useEffect(() => {
    if (!restaurantsPerPage[page]) {
      dispatch(fetchRestaurants({ limit, page, order: "DESC" }))
    }
  }, [dispatch, limit, page, restaurantsPerPage, loadingRestaurants])

  const onChangePagination = (newPage) => {
    dispatch(setPage(newPage))
    setCardsSelected([])
  }

  const handleSelectAll = () => {
    const allSelected = restaurantsList.map((item) => item.id)
    setCardsSelected(allSelected)
  }

  const handleDeselectAll = () => {
    setCardsSelected([])
  }

  const handleEnableSelected = async (id) => {
    dispatch(updateRestaurantStatus({ data: { id, isActive: true }, propertyToUpdate: "isActive" }))
  }

  const handleDisableSelected = async (id) => {
    dispatch(updateRestaurantStatus({ data: { id, isActive: false }, propertyToUpdate: "isActive" }))
  }

  const handleClick = (id) => {
    navigate(`${NAVIGATION_ROUTES_SUPER_ADMIN.Restaurants.path}/${id}`)
  }

  const handleNewItem = () => {
    navigate(NAVIGATION_ROUTES_SUPER_ADMIN.Restaurants.NewRestaurant.path)
  }

  return (
    <>
      <Group grow className="mb-3">
        <Flex align="center" justify="space-between">
          <BackButton title="Restaurantes" />
          <Flex align="center" gap="xs">
            <Flex align="center" gap={5}>
              <Text fw={700}>
                {page === 1 ? 1 : (page - 1) * limit + 1}-{page === 1 ? limit : Math.min(page * limit, totalRestaurants)}
              </Text>
              <Text>de</Text>
              <Text fw={700}>{totalRestaurants} restaurantes</Text>
            </Flex>
            <Button color={colors.main_app_color} onClick={handleNewItem}>
              Nuevo
            </Button>
          </Flex>
        </Flex>
      </Group>
      <section className="w-full">
        {loadingRestaurants ? (
          <div className="h-[calc(100vh-220px)] w-full flex justify-center items-center">
            <Loader color={colors.main_app_color} />
          </div>
        ) : restaurantsList && restaurantsList?.length > 0 ? (
          <Grid>
            {restaurantsList?.map((item, key) => (
              <Grid.Col span={{ base: 12, md: 6, lg: 4, xl: 3 }} key={key}>
                <Card shadow="sm" padding="lg" radius="md" withBorder>
                  <Card.Section>
                    {/* <Checkbox
                      color={colors.main_app_color}
                      size="md"
                      radius="sm"
                      style={{ position: "absolute", left: 20, top: 10 }}
                      onChange={() => setCardsSelected(...cardsSelected, item.id)}
                    /> */}
                    {item?.images && item.images.length > 0 ? (
                      <Image src={item.images[0]?.location} h={200} fit="cover" alt={item?.name || "Imagen"} />
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
          total={totalPageCount}
          page={page}
          limit={limit}
          defaultValue={page}
          onChange={onChangePagination}
          color={colors.main_app_color}
          size="md"
          withEdges
        />
      </section>
      {/* <section>
        {cardsSelected.length >= 1 && (
          <Affix position={{ bottom: 20, left: "calc(50% - 270px)" }}>
            <Card radius="md">
              <Flex gap="sm">
                <Button onClick={handleDisableSelected} color={colors.main_app_color}>
                  Deshabilitar seleccionados
                </Button>
                <Button onClick={handleEnableSelected} color={colors.main_app_color}>
                  Habilitar seleccionados
                </Button>
                <Button onClick={handleDeselectAll} color={colors.main_app_color}>
                  Deseleccionar todos
                </Button>
                <Button onClick={handleSelectAll} color={colors.main_app_color}>
                  Seleccionar todos
                </Button>
              </Flex>
            </Card>
          </Affix>
        )}
      </section> */}
    </>
  )
}
