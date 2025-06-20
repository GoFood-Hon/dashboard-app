import React, { useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { NAVIGATION_ROUTES_RES_ADMIN } from "../../routes"
import { useSelector } from "react-redux"
import {
  fetchUsers,
  setCurrentUserPage,
  setSearchUsersData,
  setSelectedSearchOptionForUsers
} from "../../store/features/userSlice"
import { useDispatch } from "react-redux"
import TableViewLayout from "../TableViewLayout"
import { searchOptionsUsers } from "../../utils/constants"

export default function Users() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const user = useSelector((state) => state.user.value)
  const limit = useSelector((state) => state.user.itemsPerPage)
  const page = useSelector((state) => state.user.currentUserPage)
  const usersByPage = useSelector((state) => state.user.usersByPage)
  const totalUsers = useSelector((state) => state.user.totalUsers)
  const totalPageCount = useSelector((state) => state.user.totalUserPagesCount)
  const users = usersByPage[page] || []
  const loadingUsers = useSelector((state) => state.user.loadingOtherUsers)
  const searchData = useSelector((state) => state.user.searchUsersData)
  const searchFieldUsers = useSelector((state) => state.user.searchFieldUsers)

  useEffect(() => {
    if (!usersByPage[page]) {
      dispatch(fetchUsers({ restaurantId: user.restaurantId, limit, page, order: "DESC" }))
    }
  }, [dispatch, limit, page, usersByPage])

  const handleNavigateNewUser = () => {
    navigate(NAVIGATION_ROUTES_RES_ADMIN.Users.NewUser.path)
  }

  const handleSearch = (query) => {
    dispatch(setSearchUsersData(query))
  }

  const executeSearch = async (query) => {
    dispatch(setCurrentUserPage(1))
    dispatch(
      fetchUsers({
        restaurantId: user.restaurantId,
        limit,
        page: 1,
        order: "DESC",
        search_field: searchFieldUsers,
        search: query
      })
    )
  }

  return (
    <>
      <TableViewLayout
        title="Usuarios"
        page={page}
        limit={limit}
        totalElements={totalUsers}
        onNewItemClick={handleNavigateNewUser}
        items={users}
        tableStructure="usersScreen"
        totalItems={totalPageCount}
        loading={loadingUsers}
        setPage={(newPage) => dispatch(setCurrentUserPage(newPage))}
        onSearch={handleSearch}
        value={searchData}
        searchAction={executeSearch}
        searchOptions={searchOptionsUsers}
        selectedOption={searchFieldUsers}
        setSelectedSearchOption={(value) => dispatch(setSelectedSearchOptionForUsers(value))}
      />
    </>
  )
}
