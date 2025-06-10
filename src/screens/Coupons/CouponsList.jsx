import React, { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"
import { SETTING_NAVIGATION_ROUTES } from "../../routes"
import TableViewLayout from "../TableViewLayout"
import { useState } from "react"
import ConfirmationModal from "../ConfirmationModal"
import { useDisclosure } from "@mantine/hooks"
import { deleteCoupon, getCoupons, setPage, setSearchData, setSelectedSearchOption } from "../../store/features/couponsSlice"
import { searchOptionsCoupons } from "../../utils/constants"

export default function CouponsList() {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const limit = useSelector((state) => state.coupons.itemsPerPage)
  const page = useSelector((state) => state.coupons.currentPage)
  const couponsPerPage = useSelector((state) => state.coupons.couponsPerPage)
  const totalCoupons = useSelector((state) => state.coupons.totalCoupons)
  const totalPageCount = useSelector((state) => state.coupons.totalPagesCount)
  const couponsList = couponsPerPage[page] || []
  const loadingCoupons = useSelector((state) => state.coupons.loadingCoupons)
  const searchData = useSelector((state) => state.coupons.searchData)
  const searchField = useSelector((state) => state.coupons.searchField)
  const [couponToDelete, setCouponToDelete] = useState(null)
  const [opened, { close, open }] = useDisclosure(false)

  const handleNewCoupon = () => {
    navigate(SETTING_NAVIGATION_ROUTES.Coupons.newCoupon.path)
  }

  useEffect(() => {
    if (!couponsPerPage[page]) {
      dispatch(getCoupons({ limit, page, order: "DESC" }))
    }
  }, [dispatch, limit, page, couponsPerPage])

  const handleSearch = (query) => {
    dispatch(setSearchData(query))
  }

  const executeSearch = async (query) => {
    dispatch(getCoupons({ limit, page, order: "DESC", search_field: searchField, search: query }))
  }

  return (
    <>
      <TableViewLayout
        title="Cupones"
        page={page}
        limit={limit}
        totalElements={totalCoupons}
        onNewItemClick={handleNewCoupon}
        items={couponsList}
        tableStructure="couponsScreen"
        totalItems={totalPageCount}
        loading={loadingCoupons}
        setPage={(newPage) => dispatch(setPage(newPage))}
        onSearch={handleSearch}
        value={searchData}
        searchAction={executeSearch}
        deleteAction={(id) => {
          open()
          setCouponToDelete(id)
        }}
        searchOptions={searchOptionsCoupons}
        selectedOption={searchField}
        setSelectedSearchOption={(value) => dispatch(setSelectedSearchOption(value))}
      />

      <ConfirmationModal
        opened={opened}
        close={close}
        title="¿Estás seguro que deseas eliminar?"
        description="Se eliminará el cupón seleccionado"
        onConfirm={() => dispatch(deleteCoupon(couponToDelete))}
      />
    </>
  )
}
