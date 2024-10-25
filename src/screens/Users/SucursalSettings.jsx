import { Container, Grid, Input } from "@mantine/core"
import React, { useEffect, useState } from "react"
import { colors } from "../../theme/colors"

import InputSearchCombobox from "../../components/Form/InputSearchCombobox"
import { useDispatch, useSelector } from "react-redux"

import { fetchBranches, selectAllBranches } from "../../store/features/branchesSlice"
import { useNavigate } from "react-router-dom"
import { NAVIGATION_ROUTES_RES_ADMIN } from "../../routes"

export default function SucursalSettings({ setValue, errors, register }) {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const limit = useSelector((state) => state.branches.itemsPerPage)
  const page = useSelector((state) => state.branches.currentPage)
  const restaurant = useSelector((state) => state?.restaurant?.value)
  const filters = useSelector((state) => state.branches.filters)
  const branches = useSelector(selectAllBranches)
  const user = useSelector((state) => state.user.value)

  useEffect(() => {
    dispatch(
      fetchBranches({
        limit,
        page,
        order: "DESC",
        restaurantId: user.restaurantId,
        filters
      })
    )
  }, [page, dispatch, restaurant])

  const handleNewBranchNavigation = () => {
    navigate(NAVIGATION_ROUTES_RES_ADMIN.Branches.NewBranch.path)
  }

  return (
    <>
      <InputSearchCombobox
        label="Seleccione una sucursal"
        name={"branchId"}
        emptyMessage="Sin sucursales"
        items={branches}
        register={register}
        errors={errors}
        setValue={setValue}
        color={colors.primary_button}
      />
    </>
  )
}
