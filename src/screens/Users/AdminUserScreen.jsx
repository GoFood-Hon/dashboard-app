import React, { useEffect } from "react"
import { useNavigate } from "react-router-dom"
// import Button from "../../components/Button"
import { NAVIGATION_ROUTES_SUPER_ADMIN } from "../../routes"
import MenuTable from "../Menu/MenuTable"
import toast from "react-hot-toast"
import userApi from "../../api/userApi"
import { useDispatch, useSelector } from "react-redux"
import { setCurrentPage, fetchAdminUsers } from "../../store/features/userSlice"
import { Paper, Button } from "@mantine/core"
import { colors } from "../../theme/colors"

export const AdminUserScreen = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const handleNewItem = () => {
    navigate(NAVIGATION_ROUTES_SUPER_ADMIN.Users.NewUser.path)
  }

  const limit = useSelector((state) => state.user.itemsPerPage)
  const page = useSelector((state) => state.user.currentPage)
  const adminUsersByPage = useSelector((state) => state.user.adminUsersByPage)
  const totalPageCount = useSelector((state) => state.user.totalPagesCount)
  const adminUsers = adminUsersByPage[page] || []
  const loadingUsers = useSelector((state) => state.user.loadingUsers)

  useEffect(() => {
    if (!adminUsersByPage[page]) {
      dispatch(fetchAdminUsers({ limit, page, order: "DESC" }))
    }
  }, [dispatch, limit, page, adminUsersByPage])

  const handleDisableSelected = async (id) => {
    try {
      const response = await userApi.deleteAdminUser(id)

      if (response.status === 204) {
        toast.success("Usuario eliminado!")
        refreshPage()
      } else {
        toast.error("Fallo al eliminar el administrador")
      }
    } catch (e) {
      toast.error("Fallo obtener los datos del usuario", e)
    }
  }

  return (
    <>
      <section className="mb-3">
        <div className="flex flex-row justify-between items-center">
          <h1 className="text-white-200 text-2xl font-semibold">Administradores</h1>
          <Button color={colors.main_app_color} onClick={handleNewItem}>
            Nuevo
          </Button>
        </div>
      </section>
      <section>
        <Paper withBorder p="md" radius="md">
          <MenuTable
            items={adminUsers}
            handleDisableSelected={handleDisableSelected}
            screenType="adminUserScreen"
            totalItems={totalPageCount}
            currentPage={page}
            loadingData={loadingUsers}
            setPage={(newPage) => dispatch(setCurrentPage(newPage))}
          />
        </Paper>
      </section>
    </>
  )
}
