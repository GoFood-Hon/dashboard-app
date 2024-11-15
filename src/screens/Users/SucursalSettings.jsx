import React, { useEffect } from "react"
import { colors } from "../../theme/colors"
import InputSearchCombobox from "../../components/Form/InputSearchCombobox"
import { useDispatch, useSelector } from "react-redux"
import { fetchBranches } from "../../store/features/branchesSlice"

export default function SucursalSettings({ setValue, errors, register }) {
  const dispatch = useDispatch()
  const limit = useSelector((state) => state.branches.itemsPerPage)
  const page = useSelector((state) => state.branches.currentPage)
  const branchesPerPage = useSelector((state) => state.branches.branchesPerPage)
  const branchesList = branchesPerPage[page] || []
  const loadingBranches = useSelector((state) => state.branches.loadingBranches)

  useEffect(() => {
    if (!branchesPerPage[page]) {
      dispatch(fetchBranches({ limit, page, order: "DESC" }))
    }
  }, [dispatch, limit, page, branchesPerPage])

  return (
    <>
      <InputSearchCombobox
        label="Seleccione una sucursal"
        name={"branchId"}
        emptyMessage="Sin sucursales"
        items={branchesList}
        status={loadingBranches}
        register={register}
        errors={errors}
        setValue={setValue}
        color={colors.primary_button}
      />
    </>
  )
}
