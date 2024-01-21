import React, { useEffect, useState } from "react"
import BaseLayout from "../../components/BaseLayout"
import Button from "../../components/Button"
import { Affix, Breadcrumbs, Grid, Pagination } from "@mantine/core"
import BreadCrumbNavigation from "../../components/BreadCrumbNavigation"
import { NAVIGATION_ROUTES } from "../../routes"
import LoadingCircle from "../../components/LoadingCircle"
import ItemCard from "../../components/ItemCard"
import { fetchRestaurants, setPage, setRestaurants } from "../../store/features/restaurantSlice"
import { useLocation, useNavigate } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import { Icon } from "../../components/Icon"
import { colors } from "../../theme/colors"

export default function RestaurantsScreen() {
  const navigate = useNavigate()
  const location = useLocation()
  const dispatch = useDispatch()

  const user = useSelector((state) => state.user.value)
  const limit = useSelector((state) => state.restaurants.itemsPerPage)
  const totalItems = useSelector((state) => state.restaurants.totalItems)
  const filters = useSelector((state) => state.restaurants.filters)
  const page = useSelector((state) => state.restaurants.currentPage)
  const restaurant = useSelector((state) => state?.restaurants?.value?.data)

  const totalControlBtn = Math.ceil(totalItems / limit)

  const [restaurantData, setRestaurantData] = useState({})
  const [cardsSelected, setCardsSelected] = useState([])
  const [activeTab, setActiveTab] = useState("all")
  const [category, setCategory] = useState("")

  const handleNewItem = () => {
    navigate(NAVIGATION_ROUTES.Menu.submenu.Dishes.submenu.NewDish.path)
    setCardsSelected([])
  }

  useEffect(() => {
    dispatch(
      fetchRestaurants({
        limit,
        page,
        order: "DESC"
      })
    )
    setCardsSelected([])
  }, [dispatch, activeTab, category, page])

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

  const handleEnableSelected = async () => {
    /*  await Promise.all(
      cardsSelected.map(async (id) => {
        await dispatch(updateDish({ data: { id, isActive: true }, propertyToUpdate: "isActive" }))
      })
    )

    refreshPage() */
  }

  const handleDisableSelected = async () => {
    /*  await Promise.all(
      cardsSelected.map(async (id) => {
        await dispatch(updateDish({ data: { id, isActive: false }, propertyToUpdate: "isActive" }))
      })
    )

    refreshPage() */
  }

  const handleClick = (id) => {
    /*   navigate(`${NAVIGATION_ROUTES.Menu.submenu.Dishes.path}/${id}`) */
  }

  return (
    <BaseLayout>
      <section>
        <div className="flex flex-row justify-between items-center pb-6">
          <div className="flex flex-row gap-x-3 items-center">
            <h1 className="text-white-200 text-2xl font-semibold">Restaurantes</h1>
          </div>
          <div>
            <Breadcrumbs>
              <BreadCrumbNavigation location={location} />
            </Breadcrumbs>
          </div>
        </div>
      </section>
      <section>
        <div className="flex flex-row justify-between">
          <div className="flex flex-row w-full justify-end items-center">
            <div className="flex flex-row mr-4">
              <span className="text-sky-950 text-base font-bold leading-normal">{page === 1 ? 1 : (page - 1) * limit + 1}</span>
              <span className="text-zinc-500 text-base font-bold leading-normal">-</span>
              <span className="text-sky-950 text-base font-bold leading-normal">
                {page === 1 ? limit : Math.min(page * limit, totalItems)}
              </span>
              <span className="text-zinc-500 text-base font-medium leading-normal px-1"> de </span>
              <span className="text-sky-950 text-base font-bold leading-normal">{totalItems} Restaurantes</span>
            </div>
            <div className="flex flex-row h-full items-center gap-3">
              <span className="cursor-pointer" onClick={refreshPage}>
                <Icon icon="reload" size={20} />
              </span>
            </div>
          </div>
        </div>
      </section>
      <section className="my-6 w-full">
        {restaurant && restaurant?.length > 0 ? (
          <Grid grow>
            {restaurant?.map((item, key) => (
              <Grid.Col span={{ base: 12, md: 6, lg: 3 }} key={key}>
                <ItemCard
                  item={item}
                  index={key}
                  navigation={true}
                  cardsSelected={cardsSelected}
                  handleChangeSelected={handleChangeSelected}
                  handleClick={handleClick}
                />
              </Grid.Col>
            ))}
          </Grid>
        ) : (
          <div className="text-center mt-4 text-gray-500">Sin restaurantes disponibles!</div>
        )}
      </section>
      <section className="flex flex-row justify-between pb-32">
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
