import React, { useEffect, useState } from "react"
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
import { fetchMenus } from "../../store/features/menuSlice"
import { useSelector } from "react-redux"
import { ITEMS_PER_PAGE } from "../../utils/paginationConfig"
import { formatDistanceToNow } from "date-fns"
import { colors } from "../../theme/colors"

const nodes = [
  {
    id: "3f24d92a-23bc-49a7-8b94-f17f0f3e78a4",
    name: "Hamburguesas",
    restaurantId: "13dadca7-2d49-48c1-bac5-fd342999ba14",
    createdAt: new Date("2023-11-15T19:28:41.812Z"),
    typeMenu: "normal",
    description: null,
    images: null
  },
  {
    id: "3f24d92a-23bc-49a7-8b94-f17f0f3e78a2",
    name: "Hamburguesas",
    restaurantId: "13dadca7-2d49-48c1-bac5-fd342999ba14",
    createdAt: new Date("2023-11-15T19:28:41.812Z"),
    typeMenu: "normal",
    description: null,
    images: null
  }
]

export default function MenuTable({ refreshPage, menus }) {
  const [data, setData] = useState({ nodes: menus })
  const [menu, setDat] = useState({ menus })

  useEffect(() => {
    // setData(menus)
    console.log(data, "nodes")
    console.log(menu, "menus")
    console.log(menus, "props")
  }, [menus])

  //* Pagination *//

  const pagination = usePagination(data, {
    state: {
      page: 0,
      size: ITEMS_PER_PAGE
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

  const [search, setSearch] = useState("")

  useCustom("search", data, {
    state: { search },
    onChange: onSearchChange
  })

  function onSearchChange(action, state) {
    console.log(action, state)
    pagination.fns.onSetPage(0)
  }

  //* Filter *//

  const [isHide, setHide] = useState(false)

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
        MENU: (array) => array.sort((a, b) => a.name.localeCompare(b.name)),

        TYPE: (array) => array.sort((a, b) => a.typeMenu.localeCompare(b.typeMenu)),

        DATE: (array) => array.sort((a, b) => a.createdAt - b.createdAt)
      }
    }
  )

  function onSortChange(action, state) {
    console.log(action, state)
  }

  //* Custom Modifiers *//

  let modifiedNodes = data.nodes

  // search
  modifiedNodes = modifiedNodes.filter((node) => node.name.toLowerCase().includes(search.toLowerCase()))

  // filter
  // modifiedNodes = isHide ? modifiedNodes.filter((node) => !node.isComplete) : modifiedNodes

  //* Columns *//

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return formatDistanceToNow(date, { addSuffix: true })
  }

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
      renderCell: (item) => item.name,
      sort: { sortKey: "MENU" }
    },

    {
      label: "TIPO",
      renderCell: (item) => item.typeMenu,
      sort: { sortKey: "TYPE" }
    },
    {
      label: "FECHA",
      renderCell: (item) => formatDate(item.createdAt),

      sort: { sortKey: "DATE" }
    },
    {
      label: "PLATILLOS",
      renderCell: (item) => item.id,
      sort: { sortKey: "DISHES" }
    },
    {
      label: "ESTADO",
      renderCell: (item) => item.typeMenu,
      sort: { sortKey: "STATUS" }
    },
    {
      label: "ACCIONES",
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
          <span className="cursor-pointer" onClick={refreshPage}>
            <Icon icon="reload" size={20} />
          </span>
          <span className="cursor-pointer">
            <Icon icon="setting" size={20} />
          </span>
          <span className="cursor-pointer">
            <Icon icon="trash" size={20} />
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
          color={colors.primary_button}
        />
      </Group>
    </>
  )
}
