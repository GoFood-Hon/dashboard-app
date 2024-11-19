import React, { useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { NAVIGATION_ROUTES_SUPER_ADMIN } from "../../routes"
import MenuTable from "../Menu/MenuTable"
import { useDispatch, useSelector } from "react-redux"
import { setCurrentPage } from "../../store/features/userSlice"
import { Paper, Button, Text, Title, Group, Flex } from "@mantine/core"
import { colors } from "../../theme/colors"
import { fetchCollections } from "../../store/features/collectionsSlice"

export const CollectionsList = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const handleNewItem = () => {
    navigate(NAVIGATION_ROUTES_SUPER_ADMIN.Collections.NewCollection.path)
  }

  const limit = useSelector((state) => state.collections.itemsPerPage)
  const page = useSelector((state) => state.collections.currentPage)
  const collectionsPerPage = useSelector((state) => state.collections.collectionsPerPage)
  const totalCollections = useSelector((state) => state.collections.totalCollections)
  const totalPageCount = useSelector((state) => state.collections.totalPagesCount)
  const collectionsList = collectionsPerPage[page] || []
  const loadingCollections = useSelector((state) => state.collections.loadingCollections)

  useEffect(() => {
    if (!collectionsPerPage[page]) {
      dispatch(fetchCollections({ limit, page, order: "DESC" }))
    }
  }, [dispatch, limit, page, collectionsPerPage, loadingCollections])

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
                  {page === 1 ? 1 : (page - 1) * limit + 1}-{page === 1 ? limit : Math.min(page * limit, totalCollections)}{" "}
                  <Text>de</Text>
                  {totalCollections} colecciones
                </Flex>
              </Text>
            </Flex>
            <Button color={colors.main_app_color} onClick={handleNewItem}>
              Nuevo
            </Button>
          </Flex>
        </Flex>
      </Group>
      <MenuTable
        items={collectionsList}
        screenType="collectionsScreen"
        totalItems={totalPageCount}
        currentPage={page}
        loadingData={loadingCollections}
        setPage={(newPage) => dispatch(setCurrentPage(newPage))}
      />
    </>
  )
}
