import React, { useEffect } from "react"
import { useNavigate } from "react-router-dom"
import BaseLayout from "../../components/BaseLayout"
import Button from "../../components/Button"
import { NAVIGATION_ROUTES_SUPER_ADMIN } from "../../routes"
import MenuTable from "../Menu/MenuTable"
import toast from "react-hot-toast"
import userApi from "../../api/userApi"
import { useDispatch, useSelector } from "react-redux"
import { setCurrentPage, fetchAdminUsers } from "../../store/features/userSlice"
import { Skeleton } from "@mantine/core"
import { TableSkeleton } from "../../components/Skeletons/TableSkeleton"

export const AdminUserScreen = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const handleNewItem = () => {
    navigate(NAVIGATION_ROUTES_SUPER_ADMIN.Users.NewUser.path)
  }

  const limit = useSelector((state) => state.restaurants.itemsPerPage)
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
    <BaseLayout>
      <section>
        <div className="flex flex-row justify-between items-center pb-4">
          <h1 className="text-white-200 text-2xl font-semibold">Administradores</h1>
          <Button text={"Nuevo"} className={"text-white text-md px-3 py-2 bg-primary_button mb-0"} onClick={handleNewItem} />
        </div>
      </section>
      <section>
        {loadingUsers ? (
          <TableSkeleton />
        ) : adminUsers && adminUsers.length > 0 ? (
          <div className="w-full p-4 h-full bg-white rounded-2xl border border-blue-100">
            <MenuTable
              items={adminUsers}
              handleDisableSelected={handleDisableSelected}
              screenType="adminUserScreen"
              totalItems={totalPageCount}
              currentPage={page}
              setPage={(newPage) => dispatch(setCurrentPage(newPage))}
            />
          </div>
        ) : (
          <div className="text-center mt-4 text-gray-500">No hay administradores para mostrar</div>
        )}
      </section>
    </BaseLayout>
  )
}
