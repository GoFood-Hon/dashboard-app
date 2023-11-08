import React, { useState } from "react"
import { Checkbox, Group, ActionIcon, Pagination, TextInput } from "@mantine/core"

import { useCustom } from "@table-library/react-table-library/table"
import { CompactTable } from "@table-library/react-table-library/compact"
import { useRowSelect } from "@table-library/react-table-library/select"
import { useSort } from "@table-library/react-table-library/sort"
import { usePagination } from "@table-library/react-table-library/pagination"
import { Icon360, IconChevronDown, IconChevronUp, IconEdit, IconEye, IconSearch } from "@tabler/icons-react"
import { useTheme } from "@table-library/react-table-library/theme"
import { DEFAULT_OPTIONS, getTheme } from "@table-library/react-table-library/mantine"

const nodes = [
  {
    id: 1,
    user: "tarea",
    phoneNumber: "+2323232",
    status: "Entregado",
    date: new Date(2020, 1, 15),
    type: "Domicilio",
    total: "233.31"
  },
  {
    id: 2,
    user: "marea",
    phoneNumber: "+2323232",
    status: "Entregado",
    date: new Date(2020, 1, 15),
    type: "Domicilio",
    total: "233.31"
  }
]

export default function OrdersTable() {
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
        iconDefault: <Icon360 />,
        iconUp: <IconChevronUp />,
        iconDown: <IconChevronDown />
      },
      sortFns: {
        TASK: (array) => array.sort((a, b) => a.name.localeCompare(b.name)),
        DEADLINE: (array) => array.sort((a, b) => a.deadline - b.deadline),
        TYPE: (array) => array.sort((a, b) => a.type.localeCompare(b.type)),
        COMPLETE: (array) => array.sort((a, b) => a.isComplete - b.isComplete),
        TASKS: (array) => array.sort((a, b) => (a.nodes || []).length - (b.nodes || []).length)
      }
    }
  )

  function onSortChange(action, state) {
    console.log(action, state)
  }

  //* Custom Modifiers *//

  let modifiedNodes = data.nodes

  // search
  modifiedNodes = modifiedNodes.filter((node) => node.user.toLowerCase().includes(search.toLowerCase()))

  // filter
  modifiedNodes = isHide ? modifiedNodes.filter((node) => !node.isComplete) : modifiedNodes

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
      label: "Usuario",
      renderCell: (item) => item.user
    },
    {
      label: "Teléfono",
      renderCell: (item) => item.phoneNumber
      /*   sort: { sortKey: "DEADLINE" } */
    },
    {
      label: "Estado",
      renderCell: (item) => item.status
    },
    {
      label: "Fecha",
      renderCell: (item) =>
        item.date.toLocaleDateString("en-US", {
          year: "numeric",
          month: "2-digit",
          day: "2-digit"
        })

      /*  sort: { sortKey: "COMPLETE" } */
    },
    {
      label: "Tipo",
      renderCell: (item) => item.type
    },
    {
      label: "Total",
      renderCell: (item) => item.total
    },
    {
      label: "Acciones",
      renderCell: () => <IconEye />
    }
  ]
  return (
    <>
      {/* Form */}

      <Group mx={10}>
        <TextInput
          placeholder="Buscar pedido"
          value={search}
          icon={<IconSearch />}
          onChange={(event) => setSearch(event.target.value)}
        />
      </Group>

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
