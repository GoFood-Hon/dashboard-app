import React, { useEffect } from "react"
import {
  Grid,
  Pagination,
  createTheme,
  Card,
  Group,
  Text,
  Image,
  Button,
  MantineProvider,
  Switch,
  rem,
  Box,
  Tooltip,
  Loader,
  Flex
} from "@mantine/core"
import { useNavigate } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import { fetchBranches, setPage, updateBranchStatus } from "../../store/features/branchesSlice"
import { colors } from "../../theme/colors"
import { NAVIGATION_ROUTES_RES_ADMIN } from "../../routes"
import { IconX, IconCheck } from "@tabler/icons-react"
import BackButton from "../Dishes/components/BackButton"

export default function Branches() {
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const limit = useSelector((state) => state.branches.itemsPerPage)
  const page = useSelector((state) => state.branches.currentPage)
  const branchesPerPage = useSelector((state) => state.branches.branchesPerPage)
  const totalBranches = useSelector((state) => state.branches.totalBranches)
  const totalPageCount = useSelector((state) => state.branches.totalPagesCount)
  const branchesList = branchesPerPage[page] || []
  const loadingBranches = useSelector((state) => state.branches.loadingBranches)

  const theme = createTheme({
    cursorType: "pointer"
  })

  useEffect(() => {
    if (!branchesPerPage[page]) {
      dispatch(fetchBranches({ limit, page, order: "DESC" }))
    }
  }, [dispatch, limit, page, branchesPerPage])

  const handleNewItem = () => {
    navigate(NAVIGATION_ROUTES_RES_ADMIN.Branches.NewBranch.path)
  }

  const onChangePagination = (newPage) => {
    dispatch(setPage(newPage))
  }

  const handleEnableSelected = async (id) => {
    dispatch(updateBranchStatus({ data: { id, isActive: true }, propertyToUpdate: "isActive" }))
  }

  const handleDisableSelected = async (id) => {
    dispatch(updateBranchStatus({ data: { id, isActive: false }, propertyToUpdate: "isActive" }))
  }

  const handleClick = (id) => {
    navigate(`${NAVIGATION_ROUTES_RES_ADMIN.Branches.path}/${id}`)
  }

  return (
    <>
      <Group grow mb="sm">
        <Flex align="center" justify="space-between">
          <BackButton title="Sucursales" />
          <Flex align="center" gap="xs">
            <Flex align="center" gap={5}>
              <Text fw={700}>
                {page === 1 ? 1 : (page - 1) * limit + 1}-{page === 1 ? limit : Math.min(page * limit, totalBranches)}
              </Text>
              <Text>de</Text>
              <Text fw={700}>{totalBranches} sucursales</Text>
            </Flex>
            <Button color={colors.main_app_color} onClick={handleNewItem}>
              Nuevo
            </Button>
          </Flex>
        </Flex>
      </Group>
      <section className="w-full">
        {loadingBranches ? (
          <div className="h-[calc(100vh-220px)] w-full flex justify-center items-center">
            <Loader color={colors.main_app_color} />
          </div>
        ) : branchesList && branchesList.length > 0 ? (
          <Grid flex>
            {branchesList?.map((item, key) => (
              <Grid.Col span={{ base: 12, md: 6, lg: 4, xl: 3 }} key={key}>
                <Card shadow="sm" padding="lg" radius="md" withBorder>
                  <Card.Section>
                    <Image src={item.images?.[0]?.location} h={200} alt={item.name} />
                  </Card.Section>

                  <Group justify="space-between" mt="md" mb="xs">
                    <Box w={160}>
                      <Tooltip
                        position="bottom-start"
                        label={item.name}
                        transitionProps={{ transition: "fade-down", duration: 300 }}>
                        <Text truncate="end" size="lg" fw={700}>
                          {item.name}
                        </Text>
                      </Tooltip>
                    </Box>
                    <MantineProvider theme={theme}>
                      <Switch
                        checked={item.isActive}
                        onChange={() => (item.isActive ? handleDisableSelected(item.id) : handleEnableSelected(item.id))}
                        color={colors.main_app_color}
                        size="md"
                        thumbIcon={
                          item.isActive ? (
                            <IconCheck style={{ width: rem(12), height: rem(12) }} stroke={3} color={colors.main_app_color} />
                          ) : (
                            <IconX style={{ width: rem(12), height: rem(12) }} stroke={3} color={colors.main_app_color} />
                          )
                        }
                      />
                    </MantineProvider>
                  </Group>

                  <Text size="sm" c="dimmed" h={50}>
                    {item.city + ", " + item.state}
                  </Text>

                  <Button color={colors.main_app_color} fullWidth mt="md" radius="md" onClick={() => handleClick(item.id)}>
                    Ver detalles
                  </Button>
                </Card>
              </Grid.Col>
            ))}
          </Grid>
        ) : (
          <div className="text-center mt-4 text-gray-500">No hay sucursales para mostrar</div>
        )}
      </section>
      <section className="flex flex-row justify-between pb-32">
        <div />
        <Pagination
          total={totalPageCount}
          page={page}
          limit={limit}
          defaultValue={page}
          onChange={onChangePagination}
          color={colors.main_app_color}
          size='md'
          withEdges
        />
      </section>
      {/* <section>
        {cardsSelected.length >= 1 && (
          <Affix position={{ bottom: 20, left: "calc(50% - 270px)" }}>
            <div className="w-full flex flex-row justify-end mt-6 gap-3 rounded-lg bg-white px-8 py-5 border border-gray-100 shadow">
              <Button
                text={"Deshabilitar seleccionados"}
                className={"text-xs border border-red-400 text-red-400 bg-white"}
                onClick={handleDisableSelected}
              />
              <Button
                text={"Habilitar seleccionados"}
                className={"text-xs border border-emerald-400 text-emerald-400 bg-white"}
                onClick={handleEnableSelected}
              />
              <Button
                text={"Deseleccionar todos"}
                className={"text-xs border border-sky-950 text-sky-950 bg-white"}
                onClick={handleDeselectAll}
              />
              <Button
                text={"Seleccionar todos"}
                className={"text-xs border border-sky-950 text-white bg-sky-950"}
                onClick={handleSelectAll}
              />
            </div>
          </Affix>
        )}
      </section> */}
    </>
  )
}
