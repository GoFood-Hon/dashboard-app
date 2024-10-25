import React, { useEffect } from "react"
import { useNavigate } from "react-router-dom"
// import Button from "../../components/Button"
import { NAVIGATION_ROUTES_SUPER_ADMIN } from "../../routes"
import MenuTable from "../Menu/MenuTable"
import toast from "react-hot-toast"
import userApi from "../../api/userApi"
import { useDispatch, useSelector } from "react-redux"
import { setCurrentPage, fetchAdminUsers } from "../../store/features/userSlice"
import { Paper, Button, Text, Title, Group, Flex } from "@mantine/core"
import { colors } from "../../theme/colors"

export const CollectionsList = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const handleNewItem = () => {
    navigate(NAVIGATION_ROUTES_SUPER_ADMIN.Collections.NewCollection.path)
  }

  const limit = useSelector((state) => state.user.itemsPerPage)
  const page = useSelector((state) => state.user.currentPage)
  const adminUsersByPage = useSelector((state) => state.user.adminUsersByPage)
  const totalAdminUsers = useSelector((state) => state.user.totalAdminUsers)
  const totalPageCount = useSelector((state) => state.user.totalPagesCount)
  const adminUsers = adminUsersByPage[page] || []
  const loadingUsers = useSelector((state) => state.user.loadingUsers)

  const collectionsData = [
    {
      id: "8dd4e41b-ab0c-4668-8314-796baf297ace",
      name: "Lealtad 2x1",
      content: "Diez restaurantes",
      clients: "7",
      createdAt: "hace 2 horas",
      isActive: true
    },
    {
      id: "fcc19bca-6b8f-46f8-88a5-3f6b22b65245",
      name: "Lealtad Fin de mes",
      content: "Cinco platillos",
      clients: "4",
      createdAt: "hace 3 horas",
      isActive: false
    },
    {
      id: "9fad22a9-5f78-4be2-a37a-e518a07f8c0b",
      name: "Lealtad navideña",
      content: "Diez restaurantes",
      clients: "2",
      createdAt: "hace 10 horas",
      isActive: true
    }
  ]

  // useEffect(() => {
  //   if (!adminUsersByPage[page]) {
  //     dispatch(fetchAdminUsers({ limit, page, order: "DESC" }))
  //   }
  // }, [dispatch, limit, page, adminUsersByPage])

  // const handleDisableSelected = async (id) => {
  //   try {
  //     const response = await userApi.deleteAdminUser(id)

  //     if (response.status === 204) {
  //       toast.success("Usuario eliminado!")
  //       refreshPage()
  //     } else {
  //       toast.error("Fallo al eliminar el administrador")
  //     }
  //   } catch (e) {
  //     toast.error("Fallo obtener los datos del usuario", e)
  //   }
  // }

  return (
    <>
      <Group grow className="mb-3">
        <Flex align="center" justify="space-between">
          <Title order={2} fw={700}>
            Colecciones
          </Title>
          <Flex align="center" gap="xs">
            <Flex align="center" gap={5}>
              <Text fw={700}>
                <Flex gap={5}>
                  {page === 1 ? 1 : (page - 1) * limit + 1}-{page === 1 ? limit : Math.min(page * limit, totalAdminUsers)}{" "}
                  <Text>de</Text>
                  3 colecciones
                </Flex>
              </Text>
            </Flex>
            <Button color={colors.main_app_color} onClick={handleNewItem}>
              Nuevo
            </Button>
          </Flex>
        </Flex>
      </Group>
      <section>
        <Paper withBorder p="md" radius="md">
          <MenuTable
            items={collectionsData}
            //handleDisableSelected={handleDisableSelected}
            screenType="collectionsScreen"
            totalItems={1}
            currentPage={1}
            loadingData={loadingUsers}
            setPage={(newPage) => dispatch(setCurrentPage(newPage))}
          />
        </Paper>
      </section>
    </>
  )
}
