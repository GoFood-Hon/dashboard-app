import { useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import { fetchRestaurants, setPage, setSearchData, updateRestaurantStatus } from "../../store/features/restaurantSlice"
import { NAVIGATION_ROUTES_SUPER_ADMIN } from "../../routes"
import CardsViewLayout from "../CardsViewLayout"

export default function RestaurantsScreen() {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const user = useSelector((state) => state.user.value)
  const limit = useSelector((state) => state.restaurants.itemsPerPage)
  const page = useSelector((state) => state.restaurants.currentPage)
  const restaurantsPerPage = useSelector((state) => state.restaurants.restaurantsPerPage)
  const totalRestaurants = useSelector((state) => state.restaurants.totalRestaurants)
  const totalPageCount = useSelector((state) => state.restaurants.totalPagesCount)
  const restaurantsList = restaurantsPerPage[page] || []
  const loadingRestaurants = useSelector((state) => state.restaurants.loadingRestaurants)
  const searchData = useSelector((state) => state.restaurants.searchData)

  useEffect(() => {
    if (!restaurantsPerPage[page]) {
      dispatch(fetchRestaurants({ limit, page, order: "DESC" }))
    }
  }, [dispatch, limit, page, restaurantsPerPage, loadingRestaurants])
  
  const onChangePagination = (newPage) => {
    dispatch(setPage(newPage))
  }

  const handleEnableSelected = async (id) => {
    dispatch(updateRestaurantStatus({ params: { isActive: true }, restaurantId: id }))
  }

  const handleDisableSelected = async (id) => {
    dispatch(updateRestaurantStatus({ params: { isActive: false }, restaurantId: id }))
  }

  const handleClick = (id) => {
    navigate(`${NAVIGATION_ROUTES_SUPER_ADMIN.Restaurants.path}/${id}`)
  }

  const handleNewItem = () => {
    navigate(NAVIGATION_ROUTES_SUPER_ADMIN.Restaurants.NewRestaurant.path)
  }

  const handleSearch = (query) => {
    dispatch(setSearchData(query))
  }

  const executeSearch = async (query) => {
    dispatch(fetchRestaurants({ limit, page, order: "DESC", search_field: "name", search: query }))
  }

  return (
    <CardsViewLayout
      title="Restaurantes"
      page={page}
      limit={limit}
      totalPageCount={totalPageCount}
      totalElements={totalRestaurants}
      elementsName="restaurantes"
      loadingElements={loadingRestaurants}
      elementsList={restaurantsList}
      onNewItemClick={handleNewItem}
      onEnableItem={handleEnableSelected}
      onDisableItem={handleDisableSelected}
      onDetailsClick={handleClick}
      onPaginationChange={onChangePagination}
      user={user}
      onSearch={handleSearch}
      value={searchData}
      searchAction={executeSearch}
    />
  )
}
