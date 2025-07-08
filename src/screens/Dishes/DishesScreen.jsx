import React, { useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { NAVIGATION_ROUTES_RES_ADMIN } from "../../routes"
import { useDispatch, useSelector } from "react-redux"
import { getAllDishes, setPage, setSearchData, updateDishStatus, setSelectedSearchOption } from "../../store/features/dishesSlice"
import { APP_ROLES, searchOptionsDishes } from "../../utils/constants"
import CardsViewLayout from "../../screens/CardsViewLayout"

export default function Dishes() {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const user = useSelector((state) => state.user.value)
  const limit = useSelector((state) => state.dishes.itemsPerPage)
  const page = useSelector((state) => state.dishes.currentPage)
  const dishesPerPage = useSelector((state) => state.dishes.dishesPerPage)
  const totalDishes = useSelector((state) => state.dishes.totalDishes)
  const totalPageCount = useSelector((state) => state.dishes.totalPagesCount)
  const dishesList = dishesPerPage[page] || []
  const loadingDishes = useSelector((state) => state.dishes.loadingDishes)
  const searchData = useSelector((state) => state.dishes.searchData)
  const searchField = useSelector((state) => state.dishes.searchField)

  useEffect(() => {
    if (!dishesPerPage[page]) {
      dispatch(getAllDishes({ limit, restaurantId: user.restaurantId, page, order: "DESC" }))
    }
  }, [dispatch, limit, page, dishesPerPage, loadingDishes, user.restaurantId])

  const handleNewItem = () => {
    navigate(NAVIGATION_ROUTES_RES_ADMIN.Menu.submenu.Dishes.NewDish.path)
  }

  const onChangePagination = (newPage) => {
    dispatch(setPage(newPage))
  }

  const handleEnableSelected = async (id) => {
    dispatch(updateDishStatus({ dishData: { isActive: true }, propertyToUpdate: "isActive", dishId: id }))
  }

  const handleDisableSelected = async (id) => {
    dispatch(updateDishStatus({ dishData: { isActive: false }, propertyToUpdate: "isActive", dishId: id }))
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

  const handleSearch = (query) => {
    dispatch(setSearchData(query))
  }

  const executeSearch = async (query) => {
    dispatch(setPage(1))
    dispatch(getAllDishes({ limit, restaurantId: user.restaurantId, page: 1, order: "DESC", search_field: searchField, search: query }))
  }

  return (
    <CardsViewLayout
      title="Productos"
      page={page}
      limit={limit}
      totalPageCount={totalPageCount}
      totalElements={totalDishes}
      elementsName="productos"
      loadingElements={loadingDishes}
      elementsList={dishesList}
      onNewItemClick={handleNewItem}
      onEnableItem={handleEnableSelected}
      onDisableItem={handleDisableSelected}
      onDetailsClick={handleClick}
      onPaginationChange={onChangePagination}
      user={user}
      onSearch={handleSearch}
      value={searchData}
      searchAction={executeSearch}
      searchOptions={searchOptionsDishes}
      selectedOption={searchField}
      setSelectedSearchOption={(value) => dispatch(setSelectedSearchOption(value))}
    />
  )
}