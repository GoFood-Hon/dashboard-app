import { Button, Flex, Group, Stack, Text, Title } from "@mantine/core"
import MenuTable from "./Menu/MenuTable"
import { colors } from "../theme/colors"
import BackButton from "../screens/Dishes/components/BackButton"
import { useMediaQuery } from "@mantine/hooks"

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
  setPage
}) => {
  const isSmallScreen = useMediaQuery("(max-width: 430px)")

  return (
    <Stack>
      <Group grow>
        <Flex align="center" justify="space-between">
          <BackButton title={title} />
          <Flex align="center" gap="xs">
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
        </Flex>
      </Group>
      <MenuTable
        items={items}
        screenType={tableStructure}
        totalItems={totalItems}
        currentPage={page}
        loadingData={loading}
        setPage={setPage}
      />
    </Stack>
  )
}

export default TableViewLayout
