import React from "react"
import { Checkbox, Group, Pagination, TextInput } from "@mantine/core"

import { useCustom } from "@table-library/react-table-library/table"
import { CompactTable } from "@table-library/react-table-library/compact"
import { useRowSelect } from "@table-library/react-table-library/select"
import { useSort } from "@table-library/react-table-library/sort"
import { usePagination } from "@table-library/react-table-library/pagination"
import { IconChevronDown, IconChevronUp, IconSearch } from "@tabler/icons-react"
import { useTheme } from "@table-library/react-table-library/theme"
import { DEFAULT_OPTIONS, getTheme } from "@table-library/react-table-library/mantine"
import { Icon } from "../../components/Icon"

const nodes = [
  {
    id: 1,
    menu: "tarea",
    coupons: "XSDA",
    type: "Normal",
    date: new Date(2020, 1, 15),
    dishes: 12,
    status: "Habilitado"
  },
  {
    id: 2,
    menu: "marea",
    coupons: "XSDA",
    type: "Normal",
    date: new Date(2020, 1, 15),
    dishes: 12,
    status: "Habilitado"
  }
]

export default function MenuTable() {
  const [data, setData] = React.useState({ nodes })

  //* Pagination *//

  const pagination = usePagination(data, {
    state: {
      page: 0,
      size: 4
    },
    onChange: onPaginationChange
  })

  function onPaginationChange(action, state) {
    console.log(action, state)
  }

  //* Theme *//

  const mantineTheme = getTheme({
    ...DEFAULT_OPTIONS,
    striped: false,
    highlightOnHover: true
  })
  const customTheme = {
    Table: `
      --data-table-library_grid-template-columns:  44px repeat(5, minmax(0, 1fr));

      margin: 16px 0px;
    `
  }
  const theme = useTheme([mantineTheme, customTheme])

  //* Search *//

  const [search, setSearch] = React.useState("")

  useCustom("search", data, {
    state: { search },
    onChange: onSearchChange
  })

  function onSearchChange(action, state) {
    console.log(action, state)
    pagination.fns.onSetPage(0)
  }

  //* Filter *//

  const [isHide, setHide] = React.useState(false)

  useCustom("filter", data, {
    state: { isHide },
    onChange: onFilterChange
  })

  function onFilterChange(action, state) {
    console.log(action, state)
    pagination.fns.onSetPage(0)
  }

  //* Select *//

  const select = useRowSelect(data, {
    onChange: onSelectChange
  })

  function onSelectChange(action, state) {
    console.log(action, state)
  }

  //* Sort *//

  const sort = useSort(
    data,
    {
      onChange: onSortChange
    },
    {
      sortIcon: {
        iconDefault: null,
        iconUp: <IconChevronUp />,
        iconDown: <IconChevronDown />
      },
      sortFns: {
        MENU: (array) => array.sort((a, b) => a.menu.localeCompare(b.menu)),
        COUPONS: (array) => array.sort((a, b) => a.coupons.localeCompare(b.coupons)),
        TYPE: (array) => array.sort((a, b) => a.type.localeCompare(b.type)),
        DATE: (array) => array.sort((a, b) => a.date - b.date),
        STATE: (array) => array.sort((a, b) => a.state.localeCompare(b.state))
      }
    }
  )

  function onSortChange(action, state) {
    console.log(action, state)
  }

  //* Custom Modifiers *//

  let modifiedNodes = data.nodes

  // search
  modifiedNodes = modifiedNodes.filter((node) => node.menu.toLowerCase().includes(search.toLowerCase()))

  // filter
  // modifiedNodes = isHide ? modifiedNodes.filter((node) => !node.isComplete) : modifiedNodes

  //* Columns *//

  const COLUMNS = [
    {
      label: "ID",
      renderCell: (item) => item.id,

      select: {
        renderHeaderCellSelect: () => (
          <Checkbox
            checked={select.state.all}
            indeterminate={!select.state.all && !select.state.none}
            onChange={select.fns.onToggleAll}
          />
        ),
        renderCellSelect: (item) => (
          <Checkbox checked={select.state.ids.includes(item.id)} onChange={() => select.fns.onToggleById(item.id)} />
        )
      },
      tree: true
    },

    {
      label: "MENU",
      renderCell: (item) => item.menu,
      sort: { sortKey: "MENU" }
    },
    {
      label: "CUPONES",
      renderCell: (item) => item.coupons,
      sort: { sortKey: "COUPONS" }
    },
    {
      label: "TIPO",
      renderCell: (item) => item.type,
      sort: { sortKey: "TYPE" }
    },
    {
      label: "FECHA",
      renderCell: (item) =>
        item.date.toLocaleDateString("en-US", {
          year: "numeric",
          month: "2-digit",
          day: "2-digit"
        }),

      sort: { sortKey: "DATE" }
    },
    {
      label: "PLATILLOS",
      renderCell: (item) => item.dishes,
      sort: { sortKey: "DISHES" }
    },
    {
      label: "STATUS",
      renderCell: (item) => item.status,
      sort: { sortKey: "STATUS" }
    },
    {
      label: "Acciones",
      renderCell: () => <Icon icon="eye" size={19} />
    }
  ]
  return (
    <>
      {/* Form */}
      <div className="flex flex-row w-full justify-between items-center">
        <Group mx={10}>
          <TextInput
            placeholder="Buscar aquí"
            value={search}
            icon={<IconSearch />}
            onChange={(event) => setSearch(event.target.value)}
          />
        </Group>

        <div className="flex flex-row h-full items-center gap-3">
          <span className="cursor-pointer">
            <Icon icon="reload" size={20} />
          </span>
          <span className="cursor-pointer">
            <Icon icon="setting" size={20} />
          </span>
          <span className="cursor-pointer">
            <Icon icon="trash" size={20} />
          </span>
          <span className="cursor-pointer">
            <Icon icon="dots" size={20} width={20} />
          </span>
        </div>
      </div>

      {/* Table */}

      <CompactTable
        columns={COLUMNS}
        data={{ ...data, nodes: modifiedNodes }}
        select={select}
        theme={theme}
        sort={sort}
        pagination={pagination}
      />

      <Group position="right" mx={10}>
        <Pagination
          total={pagination.state.getTotalPages(modifiedNodes)}
          page={pagination.state.page + 1}
          onChange={(page) => pagination.fns.onSetPage(page - 1)}
        />
      </Group>
    </>
  )
}
