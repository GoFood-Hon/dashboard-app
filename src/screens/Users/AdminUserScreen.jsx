import React, { useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { NAVIGATION_ROUTES_SUPER_ADMIN } from "../../routes"
import { useDispatch, useSelector } from "react-redux"
import { setCurrentPage, fetchAdminUsers, setSearchAdminUsersData } from "../../store/features/userSlice"
import TableViewLayout from "../TableViewLayout"

export const AdminUserScreen = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const limit = useSelector((state) => state.user.itemsPerPage)
  const page = useSelector((state) => state.user.currentPage)
  const adminUsersByPage = useSelector((state) => state.user.adminUsersByPage)
  const totalAdminUsers = useSelector((state) => state.user.totalAdminUsers)
  const totalPageCount = useSelector((state) => state.user.totalPagesCount)
  const adminUsers = adminUsersByPage[page] || []
  const loadingUsers = useSelector((state) => state.user.loadingUsers)
  const searchData = useSelector((state) => state.user.searchAdminUsersData)

  const handleNewItem = () => {
    navigate(NAVIGATION_ROUTES_SUPER_ADMIN.Users.NewUser.path)
  }

  useEffect(() => {
    if (!adminUsersByPage[page]) {
      dispatch(fetchAdminUsers({ limit, page, order: "DESC" }))
    }
  }, [dispatch, limit, page, adminUsersByPage])

  const handleSearch = (query) => {
    dispatch(setSearchAdminUsersData(query))
  }

  const executeSearch = async (query) => {
    dispatch(fetchAdminUsers({ limit, page, order: "DESC", search_field: "name", search: query }))
  }

  return (
    <>
      <TableViewLayout
        title="Administradores"
        page={page}
        limit={limit}
        totalElements={totalAdminUsers}
        onNewItemClick={handleNewItem}
        items={adminUsers}
        tableStructure="adminUserScreen"
        totalItems={totalPageCount}
        loading={loadingUsers}
        setPage={(newPage) => dispatch(setCurrentPage(newPage))}
        onSearch={handleSearch}
        value={searchData}
        searchAction={executeSearch}
      />
    </>
  )
}
