import React, { useEffect, useState } from "react"
// import Button from "../../components/Button"
import {
  Grid,
  Pagination,
  createTheme,
  Card,
  Group,
  Text,
  Image,
  Button,
  MantineProvider,
  Switch,
  rem,
  Box,
  Tooltip,
  Input,
  CloseButton,
  Loader
} from "@mantine/core"
import { useLocation, useNavigate } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import {
  fetchBranches,
  selectAllBranches,
  selectBranchesError,
  selectBranchesStatus,
  setFilters,
  setPage,
  updateBranches
} from "../../store/features/branchesSlice"
import LoadingCircle from "../../components/LoadingCircle"
import { colors } from "../../theme/colors"
import { NAVIGATION_ROUTES_RES_ADMIN } from "../../routes"
import { IconX, IconCheck } from "@tabler/icons-react"
import { Icon } from "../../components/Icon"

export default function Branches() {
  const navigate = useNavigate()
  const location = useLocation()
  const dispatch = useDispatch()

  const branches = useSelector(selectAllBranches)
  const status = useSelector(selectBranchesStatus)
  const error = useSelector(selectBranchesError)
  const limit = useSelector((state) => state.branches.itemsPerPage)
  const totalItems = useSelector((state) => state.branches.totalItems)
  const filters = useSelector((state) => state.branches.filters)
  const page = useSelector((state) => state.branches.currentPage)
  const restaurant = useSelector((state) => state?.restaurant?.value)
  const user = useSelector((state) => state.user.value)
  const [checked, setChecked] = useState(false)

  const theme = createTheme({
    cursorType: "pointer"
  })

  const totalControlBtn = Math.ceil(totalItems / limit)
  const [searchDish, setSearchDish] = useState("")
  const [cardsSelected, setCardsSelected] = useState([])

  useEffect(() => {
    dispatch(
      fetchBranches({
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
    navigate(NAVIGATION_ROUTES_RES_ADMIN.Branches.NewBranch.path)
    setCardsSelected([])
  }

  const refreshPage = () => {
    dispatch(
      fetchBranches({
        limit,
        page,
        order: "DESC",
        restaurantId: user.restaurantId,
        filters
      })
    )
    setCardsSelected([])
  }

  const onFiltersChange = (data) => {
    const serializableFilters = {
      ...data,
      startDate: data.startDate?.toISOString().split("T")[0],
      endDate: data.endDate?.toISOString().split("T")[0]
    }

    dispatch(setFilters(serializableFilters))

    dispatch(
      fetchBranches({
        limit,
        page,
        order: "DESC",
        restaurantId: user.restaurantId,
        filters: data
      })
    )
    setCardsSelected([])
  }
  const handleChangeSelected = (index) => {
    if (cardsSelected.includes(index)) {
      setCardsSelected(cardsSelected.filter((i) => i !== index))
    } else {
      setCardsSelected([...cardsSelected, index])
    }
  }

  const onChangePagination = (newPage) => {
    dispatch(setPage(newPage))
    setCardsSelected([])
  }

  const handleEnableSelected = async (id) => {
    // await Promise.all(
    //   cardsSelected.map(async (id) => {
    //     await dispatch(updateBranches({ data: { id, isActive: true }, propertyToUpdate: "isActive" }))
    //   })
    // )
    await dispatch(updateBranches({ data: { id, isActive: true }, propertyToUpdate: "isActive" }))

    refreshPage()
  }

  const handleDisableSelected = async (id) => {
    // await Promise.all(
    //   cardsSelected.map(async (id) => {
    //     await dispatch(updateBranches({ data: { id, isActive: false }, propertyToUpdate: "isActive" }))
    //   })
    // )

    await dispatch(updateBranches({ data: { id, isActive: false }, propertyToUpdate: "isActive" }))
    refreshPage()
  }

  const handleDeselectAll = () => {
    setCardsSelected([])
  }

  const handleSelectAll = () => {
    const allSelected = branches.map((dish) => dish.id)
    setCardsSelected(allSelected)
  }

  const handleClick = (id) => {
    navigate(`${NAVIGATION_ROUTES_RES_ADMIN.Branches.path}/${id}`)
  }
  return (
    <>
      <section>
        <div className="flex flex-row justify-between items-center">
          <h1 className="text-white-200 text-2xl font-semibold">Sucursales</h1>
          <div className="flex flex-row w-full justify-end items-center">
            <div className="flex flex-row mr-4">
              <span className=" text-base font-bold leading-normal">{page === 1 ? 1 : (page - 1) * limit + 1}</span>
              <span className="text-base font-bold leading-normal">-</span>
              <span className="text-base font-bold leading-normal">
                {page === 1 ? limit : Math.min(page * limit, totalItems)}
              </span>
              <span className="text-base font-medium leading-normal px-1"> de </span>
              <span className="text-base font-bold leading-normal">{totalItems} sucursales</span>
            </div>
            <Button color={colors.main_app_color} onClick={handleNewItem}>
              Nueva
            </Button>
          </div>
        </div>
      </section>
      <section className="my-6 w-full">
        {status === "loading" ? (
          <div className="h-[calc(100vh-220px)] w-full flex justify-center items-center">
            <Loader color={colors.main_app_color} />
          </div>
        ) : branches && branches.length > 0 ? (
          <Grid flex>
            {branches?.map((item, key) => (
              <Grid.Col span={{ base: 12, md: 6, lg: 4, xl: 3 }} key={key}>
                <Card shadow="sm" padding="lg" radius="md" withBorder>
                  <Card.Section>
                    <Image src={item.images?.[0]?.location} h={200} alt={item.name} />
                  </Card.Section>

                  <Group justify="space-between" mt="md" mb="xs">
                    <Box w={160}>
                      <Tooltip
                        position="bottom-start"
                        label={item.name}
                        transitionProps={{ transition: "fade-down", duration: 300 }}>
                        <Text truncate="end" size="lg" fw={700}>
                          {item.name}
                        </Text>
                      </Tooltip>
                    </Box>
                    <MantineProvider theme={theme}>
                      <Switch
                        checked={item.isActive}
                        onChange={() => (item.isActive ? handleDisableSelected(item.id) : handleEnableSelected(item.id))}
                        color={colors.main_app_color}
                        size="md"
                        thumbIcon={
                          item.isActive ? (
                            <IconCheck style={{ width: rem(12), height: rem(12) }} stroke={3} color={colors.main_app_color} />
                          ) : (
                            <IconX style={{ width: rem(12), height: rem(12) }} stroke={3} color={colors.main_app_color} />
                          )
                        }
                      />
                    </MantineProvider>
                  </Group>

                  <Text size="sm" c="dimmed" h={50}>
                    {item.city + ", " + item.state}
                  </Text>

                  <Button color={colors.main_app_color} fullWidth mt="md" radius="md" onClick={() => handleClick(item.id)}>
                    Ver detalles
                  </Button>
                </Card>
              </Grid.Col>
            ))}
          </Grid>
        ) : (
          <div className="text-center mt-4 text-gray-500">No hay sucursales para mostrar</div>
        )}
        {status === "error" && <div>Error: {error}</div>}
      </section>
      <section className="flex flex-row justify-between pb-32">
        <div />
        <Pagination
          total={totalControlBtn}
          page={page}
          limit={limit}
          onChange={onChangePagination}
          color={colors.main_app_color}
        />
      </section>
      {/* <section>
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
      </section> */}
    </>
  )
}
