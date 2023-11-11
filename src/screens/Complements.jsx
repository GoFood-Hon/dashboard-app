import React, { useEffect, useState } from "react"
import BaseLayout from "../components/BaseLayout"
import { Affix, Breadcrumbs, CloseButton, Grid, Input, Pagination } from "@mantine/core"
import { useLocation, useNavigate } from "react-router-dom"
import BreadCrumbNavigation from "../components/BreadCrumbNavigation"
import { useDispatch, useSelector } from "react-redux"
import {
  fetchComplements,
  selectAllComplements,
  selectComplementsError,
  selectComplementsStatus,
  updateComplement
} from "../store/features/complementsSlice"
import LoadingCircle from "../components/LoadingCircle"
import ItemCard from "../components/ItemCard"
import { Icon } from "../components/Icon"
import FilterDishesPopover from "./Dishes/components/FilterDishesPopover"
import SortDishesPopover from "./Dishes/components/SortDishesPopover"
import { NAVIGATION_ROUTES } from "../routes"
import Button from "../components/Button"
import { colors } from "../theme/colors"

export default function Complements() {
  const location = useLocation()
  const navigate = useNavigate()

  const dispatch = useDispatch()
  const complements = useSelector(selectAllComplements)
  const status = useSelector(selectComplementsStatus)
  const error = useSelector(selectComplementsError)
  const limit = useSelector((state) => state.complements.itemsPerPage)
  const totalItems = useSelector((state) => state.complements.totalItems)
  const page = useSelector((state) => state.complements.currentPage)
  const restaurant = useSelector((state) => state.restaurant.value)
  const totalControlBtn = Math.ceil(totalItems / limit)

  const [searchDish, setSearchDish] = useState("")
  const [cardsSelected, setCardsSelected] = useState([])

  useEffect(() => {
    dispatch(fetchComplements({ restaurantId: restaurant.id }))

    setCardsSelected([])
  }, [page, dispatch])

  const handleNewItem = () => {
    navigate(NAVIGATION_ROUTES.Menu.submenu.Complements.submenu.NewComplement.path)
    setCardsSelected([])
  }

  const refreshPage = () => {
    dispatch(fetchComplements({ restaurantId: restaurant.id }))

    setCardsSelected([])
  }

  const onChangePagination = (newPage) => {
    dispatch(setPage(newPage))
    setCardsSelected([])
  }

  const handleSelectAll = () => {
    const allSelected = complements.map((complement) => complement.id)
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
    const formData = new FormData()
    formData.append("isActive", true)

    await Promise.all(
      cardsSelected.map(async (dishId) => {
        await dispatch(updateComplement({ formData, dishId }))
      })
    )

    refreshPage()
  }

  const handleDisableSelected = async () => {
    const formData = new FormData()
    formData.append("isActive", false)

    await Promise.all(
      cardsSelected.map(async (dishId) => {
        await dispatch(updateDish({ formData, dishId }))
      })
    )

    refreshPage()
  }

  return (
    <BaseLayout>
      <section>
        <div className="flex flex-row justify-between items-center pb-6">
          <div className="flex flex-row gap-x-3 items-center">
            <h1 className="text-white-200 text-2xl font-semibold">Complementos</h1>
            <Button
              text={"Nuevo Complemento"}
              className={"text-white text-md px-3 py-2 bg-primary_button mb-0"}
              onClick={handleNewItem}
            />
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
          <Input
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
          />
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
            <div className="flex flex-row h-full items-center gap-3">
              <span className="cursor-pointer" onClick={refreshPage}>
                <Icon icon="reload" size={20} />
              </span>
              <FilterDishesPopover />
              <SortDishesPopover />
            </div>
          </div>
        </div>
      </section>
      <section className="my-6 w-full">
        {status === "loading" ? (
          <div className="h-[calc(100vh-350px)] w-full flex justify-center items-center">
            <LoadingCircle />
          </div>
        ) : complements && complements.length > 0 ? (
          <Grid grow>
            {complements.map((item, key) => (
              <Grid.Col span={{ base: 12, md: 6, lg: 3 }} key={key}>
                <ItemCard
                  item={item}
                  index={key}
                  navigation={true}
                  cardsSelected={cardsSelected}
                  handleChangeSelected={handleChangeSelected}
                />
              </Grid.Col>
            ))}
          </Grid>
        ) : (
          <div className="text-center mt-4 text-gray-500">Sin complementos disponibles!</div>
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
