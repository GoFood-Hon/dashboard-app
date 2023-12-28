import { Grid, Input } from "@mantine/core"
import React, { useEffect, useState } from "react"
import { colors } from "../../theme/colors"

import InputSearchCombobox from "../../components/Form/InputSearchCombobox"
import { useDispatch, useSelector } from "react-redux"

import { fetchBranches, selectAllBranches } from "../../store/features/branchesSlice"
import { useNavigate } from "react-router-dom"
import { NAVIGATION_ROUTES } from "../../routes"

export default function SucursalSettings({ setValue, errors, register }) {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const limit = useSelector((state) => state.branches.itemsPerPage)
  const page = useSelector((state) => state.branches.currentPage)
  const restaurant = useSelector((state) => state.restaurant.value)
  const filters = useSelector((state) => state.branches.filters)
  const branches = useSelector(selectAllBranches)

  const [itemSelected, setItemSelected] = useState({ name: "select..." })

  useEffect(() => {
    dispatch(
      fetchBranches({
        limit,
        page,
        order: "DESC",
        restaurantId: restaurant.id,
        filters
      })
    )
  }, [page, dispatch, restaurant])

  const handleNewBranchNavigation = () => {
    navigate(NAVIGATION_ROUTES.Branches.NewBranch.path)
  }

  return (
    <div className="w-full h-full flex flex-col bg-white rounded-2xl border border-blue-100 p-4">
      <Grid>
        <Grid.Col span={{ sm: 12, md: 6 }}>
          <div className="flex flex-col gap-2 pt-4 h-full justify-center">
            <InputSearchCombobox
              label="Sucursal"
              name={"branchId"}
              placeholder="Buscar sucursales"
              emptyMessage="Sin sucursales"
              items={branches}
              register={register}
              errors={errors}
              setValue={setValue}
              color={colors.primary_button}
              setItemSelected={setItemSelected}
            />
          </div>
        </Grid.Col>
        <Grid.Col span={{ sm: 12, md: 6 }}>
          <div className="flex flex-col gap-2 pt-4 h-full justify-center">
            <Input.Wrapper label="Encargado">
              <Input
                placeholder="Seleccione una sucursal"
                color={colors.primary_button}
                size={"md"}
                disabled
                value={itemSelected?.name}
              />
            </Input.Wrapper>
          </div>
        </Grid.Col>
        <Grid.Col span={{ sm: 12 }}>
          <div className="text-blue-600 text-base font-normal leading-normal cursor-pointer" onClick={handleNewBranchNavigation}>
            + Añadir sucursal
          </div>
        </Grid.Col>
      </Grid>
    </div>
  )
}
