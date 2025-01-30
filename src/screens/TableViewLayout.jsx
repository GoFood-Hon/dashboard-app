import { Button, Flex, Group, Skeleton, Stack, Text, Title } from "@mantine/core"
import MenuTable from "./Menu/MenuTable"
import { colors } from "../theme/colors"
import BackButton from "../screens/Dishes/components/BackButton"
import { useMediaQuery } from "@mantine/hooks"
import { SearchComponent } from "../components/SearchComponent"
import { DatePickerInput } from "@mantine/dates"

const TableViewLayout = ({
  title,
  page,
  limit,
  totalElements,
  items,
  tableStructure,
  totalItems,
  loading,
  onNewItemClick,
  setPage,
  onSearch,
  value,
  searchAction,
  noSearch,
  deleteAction,
  dates,
  setRange,
  filterAction
}) => {
  const isSmallScreen = useMediaQuery("(max-width: 430px)")

  return (
    <Stack gap="xs">
      <Group grow>
        <Flex align="center" justify="space-between">
          <BackButton title={title} />
          {loading ? (
            <Skeleton height={15} mt={6} width="12%" radius="md" />
          ) : (
            <Flex align="center" gap="xs" style={{display: totalItems > 0 ? 'flex' : 'none'}}>
              <Flex style={{ display: `${isSmallScreen ? "none" : ""}` }} align="center" gap={5}>
                <Text fw={700}>
                  {page === 1 ? 1 : (page - 1) * limit + 1}-{page === 1 ? limit : Math.min(page * limit, totalElements)}
                </Text>
                <Text>de</Text>
                <Text fw={700}>
                  {totalElements} {title.split(" ") !== 1 ? title.split(" ")[0].toLowerCase() : title.toLowerCase()}
                </Text>
              </Flex>
              <Button style={{ display: onNewItemClick ?? "none" }} color={colors.main_app_color} onClick={onNewItemClick}>
                Nuevo
              </Button>
            </Flex>
          )}
        </Flex>
      </Group>
      {!noSearch && items && (
        <SearchComponent onSearch={onSearch} elementName={title.toLowerCase()} value={value} searchAction={searchAction} />
      )}
      {dates && items && (
        <Flex align="center" gap={5} style={{ width: "100%" }}>
          <DatePickerInput
            type="range"
            locale="es"
            placeholder="Seleccione el rango de fechas del historial"
            value={value}
            onChange={setRange}
            style={{ flexGrow: 1 }}
          />
          <Button color={colors.main_app_color} style={{ flexShrink: 0 }} onClick={filterAction}>
            Buscar
          </Button>
        </Flex>
      )}
      <MenuTable
        items={items}
        screenType={tableStructure}
        totalItems={totalItems}
        currentPage={page}
        loadingData={loading}
        setPage={setPage}
        deleteAction={deleteAction}
      />
    </Stack>
  )
}

export default TableViewLayout
