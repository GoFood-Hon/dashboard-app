import React, { useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { NAVIGATION_ROUTES_RES_ADMIN } from "../../routes"
import { useSelector } from "react-redux"
import { fetchUsers, setCurrentUserPage, setSearchUsersData } from "../../store/features/userSlice"
import { useDispatch } from "react-redux"
import TableViewLayout from "../TableViewLayout"

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
    dispatch(fetchUsers({ restaurantId: user.restaurantId, limit, page, order: "DESC", search_field: "name", search: query }))
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
      />
    </>
  )
}
