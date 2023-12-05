import { Grid, Radio } from "@mantine/core"
import React, { useEffect, useState } from "react"
import { colors } from "../../theme/colors"
import InputCombobox from "../../components/Form/InputCombobox"
import InputSearchCombobox from "../../components/Form/InputSearchCombobox"
import { useDispatch, useSelector } from "react-redux"

import { fetchBranches, selectAllBranches } from "../../store/features/branchesSlice"
import { useLocation, useNavigate } from "react-router-dom"

const userTypes = [
  {
    value: "cajero",
    label: "Cajero"
  },
  {
    value: "cocina",
    label: "Cocina"
  },
  {
    value: "motorista",
    label: "Motorista"
  }
]

export default function SucursalSettings({ setValue, errors, register }) {
  const navigate = useNavigate()
  const location = useLocation()
  const dispatch = useDispatch()

  const branches = useSelector(selectAllBranches)
  const restaurant = useSelector((state) => state.restaurant.value)

  useEffect(() => {
    dispatch(
      fetchBranches({
        order: "DESC",
        restaurantId: restaurant.id
      })
    )
  }, [dispatch, restaurant])

  return (
    <div className="w-full h-full flex flex-col bg-white rounded-2xl border border-blue-100 p-4">
      <Grid>
        <Grid.Col span={{ sm: 12, md: 6 }}>
          <div className="flex flex-col gap-2 pt-4">
            <InputSearchCombobox
              label="Sucursal"
              name={"branch"}
              placeholder="Buscar sucursales"
              emptyMessage="Sin sucursales"
              items={branches}
              register={register}
              errors={errors}
              setValue={setValue}
              color={colors.primary_button}
            />
          </div>
        </Grid.Col>
        <Grid.Col span={{ sm: 12, md: 6 }}>
          <div className="flex flex-col gap-2 pt-4">
            <InputCombobox
              disabled={true}
              items={userTypes}
              placeholder="Encargado de la sucursal..."
              setValue={setValue}
              errors={errors}
              label="Encargado"
              name="type"
            />
          </div>
        </Grid.Col>
      </Grid>
    </div>
  )
}
