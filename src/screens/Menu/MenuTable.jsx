import React, { useEffect, useState } from "react"
import { Checkbox, Group, Pagination, TextInput, Avatar } from "@mantine/core"

import { useCustom } from "@table-library/react-table-library/table"
import { CompactTable } from "@table-library/react-table-library/compact"
import { useRowSelect } from "@table-library/react-table-library/select"
import { useSort } from "@table-library/react-table-library/sort"
import { usePagination } from "@table-library/react-table-library/pagination"
import { IconChevronDown, IconChevronUp, IconSearch } from "@tabler/icons-react"
import { useTheme } from "@table-library/react-table-library/theme"
import { DEFAULT_OPTIONS, getTheme } from "@table-library/react-table-library/mantine"
import { Icon } from "../../components/Icon"
import { ITEMS_PER_PAGE } from "../../utils/paginationConfig"
import { colors } from "../../theme/colors"
import { useNavigate } from "react-router-dom"
import { NAVIGATION_ROUTES_KITCHEN, NAVIGATION_ROUTES_RES_ADMIN, NAVIGATION_ROUTES_SUPER_ADMIN } from "../../routes"
import { formatDateDistanceToNow } from "../../utils"

export default function MenuTable({ refreshPage, items, handleDisableSelected, screenType }) {
  const navigate = useNavigate()
  const [data, setData] = useState({ nodes: items })
  const [itemsSelected, setItemsSelected] = useState([])

  useEffect(() => {
    setData({ nodes: items })
  }, [items])

  let columns = []

  const handleClick = (id) => {
    if (screenType === "menuScreen") {
      navigate(`${NAVIGATION_ROUTES_RES_ADMIN.Menu.path}/${id}`)
    } else if (screenType === "usersScreen") {
      navigate(`${NAVIGATION_ROUTES_RES_ADMIN.Users.path}/${id}`)
    } else if (screenType === "ordersScreen") {
      navigate(`${NAVIGATION_ROUTES_RES_ADMIN.Pedidos.path}/${id}`)
    } else if (screenType === "adminUserScreen") {
      navigate(`${NAVIGATION_ROUTES_SUPER_ADMIN.Users.path}/${id}`)
    } else if (screenType === "planScreen") {
      navigate(`${NAVIGATION_ROUTES_SUPER_ADMIN.Plans.path}/${id}`)
    } else if (screenType === "orderHistoryScreen") {
      navigate(`${NAVIGATION_ROUTES_KITCHEN.OrderHistory.path}/${id}`)
    }
  }

  if (screenType === "menuScreen") {
    columns = [
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

      /*   {
        label: "TIPO",
        renderCell: (item) => item.typeMenu,
        sort: { sortKey: "TYPE" }
      }, */
      {
        label: "FECHA",
        renderCell: (item) => formatDateDistanceToNow(item.createdAt),

        sort: { sortKey: "DATE" }
      },
      {
        label: "PLATILLOS",
        renderCell: (item) => item.dishesCount,
        sort: { sortKey: "DISHES" }
      },
      {
        label: "ESTADO",
        renderCell: (item) => (item.isActive ? "Habilitado" : "Deshabilitado"),
        sort: { sortKey: "STATUS" }
      },
      {
        label: "ACCIONES",
        renderCell: (item) => {
          return (
            <span onClick={() => handleClick(item.id)}>
              <Icon icon="eye" size={19} />
            </span>
          )
        }
      }
    ]
  } else if (screenType === "usersScreen" || screenType === "adminUserScreen") {
    columns = [
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
        }
      },

      {
        label: "USUARIO",
        renderCell: (item) => (
          <div className="flex flex-row items-center gap-2">
            <Avatar size="sm" src={item?.images?.[0]?.location} />
            {item.name}
          </div>
        ),
        sort: { sortKey: "USER" }
      },

      {
        label: "CORREO",
        renderCell: (item) => item.email,
        sort: { sortKey: "EMAIL" }
      },
      {
        label: "TELÉFONO",
        renderCell: (item) => item.phoneNumber,
        sort: { sortKey: "PHONE_NUMBER" }
      },
      {
        label: "FECHA",
        renderCell: (item) => formatDateDistanceToNow(item.createdAt),

        sort: { sortKey: "DATE" }
      },

      {
        label: "ESTADO",
        renderCell: (item) => (item.active ? "Habilitado" : "Deshabilitado"),
        sort: { sortKey: "STATUS" }
      },
      /* {
        label: "COMPRAS",
        renderCell: (item) => item.purchases,
        sort: { sortKey: "PURCHASES" }
      }, */
      {
        label: "ACCIONES",
        renderCell: (item) => (
          <span onClick={() => handleClick(item.id)}>
            <Icon icon="eye" size={19} />
          </span>
        )
      }
    ]
  } else if (screenType === "ordersScreen") {
    columns = [
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
        }
      },
      {
        label: "USUARIO",
        renderCell: (item) => <div className="flex flex-row items-center gap-2">{item?.Order?.User?.name}</div>,
        sort: { sortKey: "USER" }
      },
      {
        label: "TELÉFONO",
        renderCell: (item) => item?.Order?.User?.phoneNumber,
        sort: { sortKey: "PHONE_NUMBER" }
      },
      {
        label: "ESTADO",
        renderCell: (item) => item.status,
        sort: { sortKey: "STATUS" }
      },
      {
        label: "FECHA",
        renderCell: (item) => formatDateDistanceToNow(item.createdAt),
        sort: { sortKey: "DATE" }
      },
      {
        label: "TIPO",
        renderCell: (item) => item?.Order?.type,
        sort: { sortKey: "TYPE" }
      },
      {
        label: "TOTAL",
        renderCell: (item) => item.total,
        sort: { sortKey: "TOTAL" }
      },
      {
        label: "ACCIONES",
        renderCell: (item) => (
          <span onClick={() => handleClick(item.id)}>
            <Icon icon="eye" size={19} />
          </span>
        )
      }
    ]
  } else if (screenType === "planScreen") {
    columns = [
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
        }
      },
      {
        label: "Nombre del plan",
        renderCell: (item) => <div className="flex flex-row items-center gap-2">{item.name}</div>,
        sort: { sortKey: "NAME" }
      },

      {
        label: "Tipo de pago",
        renderCell: (item) => item.paymentType,
        sort: { sortKey: "PAYMENT_TYPE" }
      },
      {
        label: "Precio",
        renderCell: (item) => item.price,
        sort: { sortKey: "PRICE" }
      },
      {
        label: "Ultima actualización",
        renderCell: (item) => formatDateDistanceToNow(item.updatedAt),
        sort: { sortKey: "LAST_UPDATE" }
      },
      {
        label: "Acciones",
        renderCell: (item) => (
          <span onClick={() => handleClick(item.id)}>
            <Icon icon="eye" size={19} />
          </span>
        )
      }
    ]
  } else if (screenType === "orderHistoryScreen") {
    columns = [
      {
        label: "Orden ID",
        renderCell: (item) => item.orderId,

        select: {
          renderHeaderCellSelect: () => (
            <Checkbox
              checked={select.state.all}
              indeterminate={!select.state.all && !select.state.none}
              onChange={select.fns.onToggleAll}
            />
          ),
          renderCellSelect: (item) => (
            <Checkbox checked={select.state.ids.includes(item.orderId)} onChange={() => select.fns.onToggleById(item.orderId)} />
          )
        }
      },
      {
        label: "COSTO DE ENVÍO",
        renderCell: (item) => <div className="flex flex-row items-center gap-2">{item.shippingPrice}</div>,
        sort: { sortKey: "SHIPPING_PRICE" }
      },
      {
        label: "DESCUENTO",
        renderCell: (item) => item?.discount,
        sort: { sortKey: "DISCOUNT" }
      },
      {
        label: "SUBTOTAL",
        renderCell: (item) => item.subtotal,
        sort: { sortKey: "SUBTOTAL" }
      },
      {
        label: "ISV",
        renderCell: (item) => formatDateDistanceToNow(item?.isv),
        sort: { sortKey: "ISV" }
      },
      {
        label: "TOTAL",
        renderCell: (item) => item?.total,
        sort: { sortKey: "TOTAL" }
      },
      {
        label: "FECHA DE PAGO",
        renderCell: (item) => item.paidDate,
        sort: { sortKey: "DATE" }
      },
      {
        label: "ACCIONES",
        renderCell: (item) => (
          <span onClick={() => handleClick(item.id)}>
            <Icon icon="eye" size={19} />
          </span>
        )
      }
    ]
  } else {
    columns = []
  }

  //* Pagination *//

  const pagination = usePagination(data, {
    state: {
      page: 0,
      size: ITEMS_PER_PAGE
    },
    onChange: onPaginationChange
  })

  function onPaginationChange(action, state) {
    // console.log(action, state)
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
    // console.log(action, state)
    pagination.fns.onSetPage(0)
  }

  //* Filter *//

  const [isHide, setHide] = useState(false)

  useCustom("filter", data, {
    state: { isHide },
    onChange: onFilterChange
  })

  function onFilterChange(action, state) {
    // console.log(action, state)
    pagination.fns.onSetPage(0)
  }

  //* Select *//

  const select = useRowSelect(data, {
    onChange: onSelectChange
  })

  function onSelectChange(action, state) {
    // console.log(action, state)
    setItemsSelected(state.ids)
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

        TYPE: (array) => array.sort((a, b) => a.Order.type.localeCompare(b.Order.type)),

        DATE: (array) => array.sort((a, b) => a.createdAt - b.createdAt)
      }
    }
  )

  function onSortChange(action, state) {
    // console.log(action, state)
  }

  let modifiedNodes = data.nodes

  // search
  modifiedNodes = modifiedNodes.filter((node) => {
    const searchField =
      screenType === "ordersScreen" ? node.Order?.User?.name : screenType === "orderHistoryScreen" ? node?.orderId : node.name
    return searchField?.toLowerCase().includes(search?.toLowerCase())
  })

  // filter
  // modifiedNodes = isHide ? modifiedNodes.filter((node) => !node.isComplete) : modifiedNodes

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
          {handleDisableSelected && (
            <span className="cursor-pointer" onClick={() => handleDisableSelected(itemsSelected)}>
              <Icon icon="trash" size={20} />
            </span>
          )}
        </div>
      </div>

      {/* Table */}

      <CompactTable
        columns={columns}
        data={{ ...data, nodes: modifiedNodes }}
        select={select}
        theme={theme}
        sort={sort}
        pagination={pagination}
        color={colors.primary_button}
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
