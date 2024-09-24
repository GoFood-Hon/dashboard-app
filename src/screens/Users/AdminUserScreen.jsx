import React, { useEffect, useState } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import { Affix, Breadcrumbs, Grid, Pagination, Skeleton } from "@mantine/core"
import BaseLayout from "../../components/BaseLayout"
import Button from "../../components/Button"
import { NAVIGATION_ROUTES_SUPER_ADMIN } from "../../routes"
import MenuTable from "../Menu/MenuTable"
import toast from "react-hot-toast"
import userApi from "../../api/userApi"
import { useDispatch, useSelector } from "react-redux"
import { setTotalAdminUsers, setCurrentPage, fetchAdminUsers } from "../../store/features/userSlice"

export const AdminUserScreen = () => {
  const navigate = useNavigate()
  const handleNewItem = () => {
    navigate(NAVIGATION_ROUTES_SUPER_ADMIN.Users.NewUser.path)
  }
  const [loading, setLoading] = useState(false)
  const limit = useSelector((state) => state.restaurants.itemsPerPage)
  const page = useSelector((state) => state.user.currentPage)
  const dispatch = useDispatch()
  const [adminUsers, setAdminUsers] = useState([])
  const adminUsersTwo = useSelector((state) => state.user.adminUsers)
  const totalAdminUsers = useSelector((state) => state.user.totalAdminUsers)
  const totalPagesCount = useSelector((state) => state.user.totalPagesCount)

  useEffect(() => {
    dispatch(fetchAdminUsers({ limit, page, order: "DESC" }));
  }, [dispatch, limit, page]);

  useEffect(() => {
    fetchData()
  }, [page])

  const fetchData = async () => {
    setLoading(true)
    try {
      const response = await userApi.getAdminUsers({
        limit,
        page,
        order: "DESC"
      })
      dispatch(setTotalAdminUsers(response.results))

      if (response.error) {
        //toast.error("Error obteniendo la información de los usuarios")
      } else if (response.status === "success") {
        setAdminUsers(response.data)
        setTotalItems(response.results)
      }
      setLoading(false)
    } catch (e) {
      //toast.error("Fallo obtener los datos del usuario", e)
      setLoading(false)
    }
  }

  const refreshPage = () => {
    fetchData()
  }
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
        {adminUsers && adminUsers.length > 0 ? (
          <div className="w-full p-4 h-full bg-white rounded-2xl border border-blue-100">
            <MenuTable
              refreshPage={refreshPage}
              items={adminUsersTwo}
              handleDisableSelected={handleDisableSelected}
              screenType="adminUserScreen"
              totalItems={totalPagesCount}
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
