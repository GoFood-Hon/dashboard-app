import { CloseButton, TextInput, Select, Flex, Box } from "@mantine/core"
import { useDebouncedCallback, useMediaQuery } from "@mantine/hooks"
import { IconSearch } from "@tabler/icons-react"

export function SearchComponent({
  elementName,
  onSearch,
  value,
  searchAction,
  searchOptions = [],
  selectedOption,
  setSelectedSearchOption,
  noSelect
}) {
  const isSmallScreen = useMediaQuery("(max-width: 480px)")
  const handleSearch = useDebouncedCallback(async (query) => {
    await searchAction(query)
  }, 500)

  const handleChange = (value) => {
    onSearch(value)
    handleSearch(value)
  }

  const showSelect = !noSelect && !isSmallScreen

  return (
    <Flex w="100%" gap="xs">
      {showSelect && (
        <Box w="12%">
          <Select
            radius="md"
            value={selectedOption}
            onChange={setSelectedSearchOption}
            data={searchOptions}
            allowDeselect={false}
          />
        </Box>
      )}

      <Box w={showSelect ? "88%" : "100%"}>
        <TextInput
          radius="md"
          value={value}
          onChange={(event) => handleChange(event.currentTarget.value)}
          placeholder={`Buscar ${elementName}`}
          leftSection={<IconSearch size={20} stroke={1.5} />}
          rightSection={<CloseButton onClick={() => handleChange("")} style={{ display: value ? undefined : "none" }} />}
          classNames={{ input: "focus:border-gray-600" }}
        />
      </Box>
    </Flex>
  )
}
