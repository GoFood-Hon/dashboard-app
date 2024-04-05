import React, { useEffect, useState } from "react"
import BaseLayout from "../../components/BaseLayout"
import Button from "../../components/Button"
import { Affix, Breadcrumbs, Grid, Pagination } from "@mantine/core"
import BreadCrumbNavigation from "../../components/BreadCrumbNavigation"
import { useLocation, useNavigate } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import { Icon } from "../../components/Icon"
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
import ItemCard from "../../components/ItemCard"
import { colors } from "../../theme/colors"
import { NAVIGATION_ROUTES_RES_ADMIN } from "../../routes"

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

  const handleEnableSelected = async () => {
    await Promise.all(
      cardsSelected.map(async (id) => {
        await dispatch(updateBranches({ data: { id, isActive: true }, propertyToUpdate: "isActive" }))
      })
    )

    refreshPage()
  }

  const handleDisableSelected = async () => {
    await Promise.all(
      cardsSelected.map(async (id) => {
        await dispatch(updateBranches({ data: { id, isActive: false }, propertyToUpdate: "isActive" }))
      })
    )

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
    <BaseLayout>
      <section>
        <div className="flex flex-row justify-between items-center pb-6">
          <div className="flex flex-row gap-x-3 items-center">
            <h1 className="text-white-200 text-2xl font-semibold">Sucursales</h1>
            <Button
              text={"Nueva sucursal"}
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
          {/*  <Input
            className="w-80"
            placeholder="Buscar sucursal"
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
          <div className="flex flex-row w-full justify-end items-center">
            <div className="flex flex-row mr-4">
              <span className="text-sky-950 text-base font-bold leading-normal">{page === 1 ? 1 : (page - 1) * limit + 1}</span>
              <span className="text-zinc-500 text-base font-bold leading-normal">-</span>
              <span className="text-sky-950 text-base font-bold leading-normal">
                {page === 1 ? limit : Math.min(page * limit, totalItems)}
              </span>
              <span className="text-zinc-500 text-base font-medium leading-normal px-1"> de </span>
              <span className="text-sky-950 text-base font-bold leading-normal">{totalItems} sucursales</span>
            </div>
            <div className="flex flex-row h-full items-center gap-3">
              <span className="cursor-pointer" onClick={refreshPage}>
                <Icon icon="reload" size={20} />
              </span>
              {/*      <FilterPopover onFiltersChange={onFiltersChange} refreshPage={refreshPage} /> */}
            </div>
          </div>
        </div>
      </section>
      <section className="my-6 w-full">
        {status === "loading" ? (
          <div className="h-[calc(100vh-350px)] w-full flex justify-center items-center">
            <LoadingCircle />
          </div>
        ) : branches && branches.length > 0 ? (
          <Grid>
            {branches?.map((item, key) => (
              <Grid.Col span={{ base: 12, md: 6, lg: 4 }} key={key}>
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
          <div className="text-center mt-4 text-gray-500">Sin sucursales disponibles</div>
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
