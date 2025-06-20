import React, { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"
import { NAVIGATION_ROUTES_RES_ADMIN } from "../../routes"
import { fetchMenus, setPage, setSearchData, setSelectedSearchOption } from "../../store/features/menuSlice"
import TableViewLayout from "../../screens/TableViewLayout"
import { searchOptionsMenus } from "../../utils/constants"

export default function Menu() {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const user = useSelector((state) => state.user.value)
  const limit = useSelector((state) => state.menus.itemsPerPage)
  const page = useSelector((state) => state.menus.currentPage)
  const menusPerPage = useSelector((state) => state.menus.menusPerPage)
  const totalMenus = useSelector((state) => state.menus.totalMenus)
  const totalPageCount = useSelector((state) => state.menus.totalPagesCount)
  const menusList = menusPerPage[page] || []
  const loadingMenus = useSelector((state) => state.menus.loadingMenus)
  const searchData = useSelector((state) => state.menus.searchData)
  const searchField = useSelector((state) => state.menus.searchField)

  const handleNewMenu = () => {
    navigate(NAVIGATION_ROUTES_RES_ADMIN.Menu.NewMenu.path)
  }

  useEffect(() => {
    if (!menusPerPage[page]) {
      dispatch(fetchMenus({ restaurantId: user.restaurantId, limit, page, order: "DESC" }))
    }
  }, [dispatch, limit, page, menusPerPage])

  const handleSearch = (query) => {
    dispatch(setSearchData(query))
  }

  const executeSearch = async (query) => {
    dispatch(setPage(1))
    dispatch(fetchMenus({ restaurantId: user.restaurantId, limit, page: 1, order: "DESC", search_field: searchField, search: query }))
  }

  return (
    <>
      <TableViewLayout
        title="Menús"
        page={page}
        limit={limit}
        totalElements={totalMenus}
        onNewItemClick={handleNewMenu}
        items={menusList.map((menu) => {
          return { ...menu, dishesCount: menu?.Dishes?.length || menu?.Dishes }
        })}
        tableStructure="menuScreen"
        totalItems={totalPageCount}
        loading={loadingMenus}
        setPage={(newPage) => dispatch(setPage(newPage))}
        onSearch={handleSearch}
        value={searchData}
        searchAction={executeSearch}
        searchOptions={searchOptionsMenus}
        selectedOption={searchField}
        setSelectedSearchOption={(value) => dispatch(setSelectedSearchOption(value))}
      />
    </>
  )
}
