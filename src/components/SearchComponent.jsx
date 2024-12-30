import { CloseButton, TextInput } from "@mantine/core"
import { useDebouncedCallback } from "@mantine/hooks"
import { IconSearch } from "@tabler/icons-react"

export function SearchComponent({ elementName, onSearch, value, searchAction }) {
  const handleSearch = useDebouncedCallback(async (query) => {
    await searchAction(query)
  }, 500)

  const handleChange = (value) => {
    onSearch(value)
    handleSearch(value)
  }

  return (
    <TextInput
      radius="md"
      value={value}
      onChange={(event) => handleChange(event.currentTarget.value)}
      placeholder={"Buscar " + elementName}
      leftSection={<IconSearch size={20} stroke={1.5} />}
      rightSection={<CloseButton onClick={() => handleChange("")} style={{ display: value ? undefined : "none" }} />}
      classNames={{
        input: "focus:border-gray-600"
      }}
    />
  )
}
