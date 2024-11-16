import React, { useEffect } from "react"
import InputSearchCombobox from "../../components/Form/InputSearchCombobox"
import { useDispatch, useSelector } from "react-redux"
import { fetchNoPaginatedBranches } from "../../store/features/branchesSlice"
import { Controller } from "react-hook-form"
import { Select } from "@mantine/core"

export default function SucursalSettings({ control }) {
  const dispatch = useDispatch()
  const user = useSelector((state) => state.user.value)
  const branchesList = useSelector((state) => state.branches.branches)

  useEffect(() => {
    dispatch(fetchNoPaginatedBranches({ restaurantId: user.Restaurant.id }))
  }, [])

  return (
    <>
      <Controller
        name="sucursalId"
        control={control}
        render={({ field, fieldState }) => (
          <Select
            label="Sucursal asignada"
            data={branchesList.map((item) => ({
              value: item.id,
              label: item.name
            }))}
            allowDeselect={false}
            maxDropdownHeight={200}
            value={field.value}
            onChange={field.onChange}
            error={fieldState.error ? fieldState.error.message : null}
            searchable
            clearable
          />
        )}
      />
    </>
  )
}
