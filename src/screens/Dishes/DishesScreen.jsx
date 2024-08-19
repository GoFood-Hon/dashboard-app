import React, { useEffect, useState } from "react"
import BaseLayout from "../../components/BaseLayout"
import {
  Affix,
  Breadcrumbs,
  CloseButton,
  Grid,
  Input,
  Pagination,
  MantineProvider,
  createTheme,
  Switch,
  rem
} from "@mantine/core"
import Button from "../../components/Button"
import { useNavigate, useLocation } from "react-router-dom"
import { colors } from "../../theme/colors"
import { NAVIGATION_ROUTES_RES_ADMIN, NAVIGATION_ROUTES_BRANCH_ADMIN } from "../../routes"
import BreadCrumbNavigation from "../../components/BreadCrumbNavigation"
import { useDispatch, useSelector } from "react-redux"
import { IconX, IconCheck } from "@tabler/icons-react"
import {
  fetchDishes,
  selectAllDishes,
  selectDishesError,
  selectDishesStatus,
  setFilters,
  setPage,
  updateDish
} from "../../store/features/dishesSlice"
import LoadingCircle from "../../components/LoadingCircle"
import ItemCard from "../../components/ItemCard"
import { Icon } from "../../components/Icon"
import FilterPopover from "../../components/FilterPopover"
import BackButton from "./components/BackButton"
import { APP_ROLES } from "../../utils/constants"
import { getFormattedHNL } from "../../utils"

export default function Dishes() {
  const navigate = useNavigate()
  const location = useLocation()
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
    await dispatch(updateDish({ dishData: { isActive: true }, propertyToUpdate: "isActive", dishId: id }))
    refreshPage()
  }

  const handleDisableSelected = async (id) => {
    await dispatch(updateDish({ dishData: { isActive: false }, propertyToUpdate: "isActive", dishId: id }))
    refreshPage()
  }

  const onFiltersChange = (data) => {
    const serializableFilters = {
      ...data,
      startDate: data.startDate?.toISOString().split("T")[0],
      endDate: data.endDate?.toISOString().split("T")[0]
    }

    dispatch(setFilters(serializableFilters))

    dispatch(
      fetchDishes({
        limit,
        page,
        order: "DESC",
        restaurantId: user.restaurantId,
        filters: data
      })
    )

    setCardsSelected([])
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
    <BaseLayout>
      <section>
        <div className="flex flex-row justify-between items-center pb-6">
          <BackButton title="Platillos" />
          <div className="flex flex-row w-full justify-end items-center">
            <div className="flex flex-row mr-4">
              <span className="text-sky-950 text-base font-bold leading-normal">{page === 1 ? 1 : (page - 1) * limit + 1}</span>
              <span className="text-zinc-500 text-base font-bold leading-normal">-</span>
              <span className="text-sky-950 text-base font-bold leading-normal">
                {page === 1 ? limit : Math.min(page * limit, totalItems)}
              </span>
              <span className="text-zinc-500 text-base font-medium leading-normal px-1"> de </span>
              <span className="text-sky-950 text-base font-bold leading-normal">{totalItems} platillos</span>
            </div>
            <Button
              text={"Nuevo"}
              className={`text-white text-md px-3 py-2 bg-primary_button mb-0 ${user.role !== APP_ROLES.branchAdmin && user.role !== APP_ROLES.cashierUser ? "" : "hidden"}`}
              onClick={handleNewItem}
            />
          </div>
        </div>
      </section>
      <section>
        <div className="flex flex-row justify-between">
          {/*  <Input
            className="w-80"
            placeholder="Buscar platillo"
            value={searchDish}
            onChange={(event) => setSearchDish(event.currentTarget.value)}
            rightSectionPointerEvents="all"
            leftSection={<Icon icon="search" size={16} color="#6d7177" />}
            rightSection={
              <CloseButton
                aria-label="Clear input"
                onClick={() => setSearchDish("")}
                style={{ display: searchDish ? undefined : "none" }}
              />
            }
          /> */}
        </div>
      </section>
      <section className="w-full">
        {status === "loading" ? (
          <div className="h-[calc(100vh-350px)] w-full flex justify-center items-center">
            <LoadingCircle />
          </div>
        ) : dishes && dishes.length > 0 ? (
          <Grid>
            {dishes.map((item, key) => (
              <Grid.Col span={{ base: 12, md: 6, lg: 4, xl: 3}} key={key}>
                <div className="bg-white border border-gray-100 transition transform duration-700 shadow-lg p-4 rounded-lg relative">
                  <img className="w-48 h-48 mx-auto object-contain" src={item.images?.[0]?.location} alt="" />
                  <div className="flex flex-col my-3 space-y-2">
                    <h1 className="text-gray-900 poppins text-lg">{item.name}</h1>
                    <h2 className="text-gray-900 poppins text-lg font-bold">{getFormattedHNL(item.price)}</h2>
                    <div className="flex items-center justify-between">
                      <Button
                        text={"Editar"}
                        className={"text-white text-md px-3 py-2 bg-primary_button mb-0"}
                        onClick={() => handleClick(item.id)}
                      />
                      <MantineProvider theme={theme}>
                        <Switch
                          checked={item.isActive}
                          onChange={() => (item.isActive ? handleDisableSelected(item.id) : handleEnableSelected(item.id))}
                          color="teal"
                          size="md"
                          thumbIcon={
                            item.isActive ? (
                              <IconCheck style={{ width: rem(12), height: rem(12) }} stroke={3} color="teal" />
                            ) : (
                              <IconX style={{ width: rem(12), height: rem(12) }} stroke={3} color="red" />
                            )
                          }
                        />
                      </MantineProvider>
                    </div>
                  </div>
                </div>
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
          color={colors.primary_button}
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
    </BaseLayout>
  )
}
