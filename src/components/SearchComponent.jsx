import { CloseButton, TextInput, Select } from "@mantine/core"
import { useDebouncedCallback } from "@mantine/hooks"
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
  const handleSearch = useDebouncedCallback(async (query) => {
    await searchAction(query)
  }, 500)

  const handleChange = (value) => {
    onSearch(value)
    handleSearch(value)
  }

  return (
    <div className="flex w-full gap-2">
      <Select
        radius="md"
        value={selectedOption}
        onChange={setSelectedSearchOption}
        data={searchOptions}
        className={`w-[180px] ${noSelect ? "hidden" : "block"}`}
        allowDeselect={false}
      />
      <TextInput
        radius="md"
        value={value}
        onChange={(event) => handleChange(event.currentTarget.value)}
        placeholder={`Buscar ${elementName}`}
        leftSection={<IconSearch size={20} stroke={1.5} />}
        rightSection={<CloseButton onClick={() => handleChange("")} style={{ display: value ? undefined : "none" }} />}
        classNames={{ input: "focus:border-gray-600" }}
        className="flex-1"
      />
    </div>
  )
}
