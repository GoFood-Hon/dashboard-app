import React, { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"
import { SETTING_NAVIGATION_ROUTES } from "../../routes"
import TableViewLayout from "../../screens/TableViewLayout"
import { deleteOffer, getPromotionByRestaurant, setPage, setSearchData } from "../../store/features/promotionsSlice"
import { useState } from "react"
import ConfirmationModal from "../ConfirmationModal"
import { useDisclosure } from "@mantine/hooks"

export default function PromotionsList() {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const limit = useSelector((state) => state.promotions.itemsPerPage)
  const page = useSelector((state) => state.promotions.currentPage)
  const promotionsPerPage = useSelector((state) => state.promotions.promotionsPerPage)
  const totalPromotions = useSelector((state) => state.promotions.totalPromotions)
  const totalPageCount = useSelector((state) => state.promotions.totalPagesCount)
  const promotionsList = promotionsPerPage[page] || []
  const loadingPromotions = useSelector((state) => state.promotions.loadingPromotions)
  const searchData = useSelector((state) => state.promotions.searchData)
  const [promotionToDelete, setPromotionToDelete] = useState(null)
  const [opened, { close, open }] = useDisclosure(false)

  const handleNewPromotion = () => {
    navigate(SETTING_NAVIGATION_ROUTES.Promotions.newPromotion.path)
  }

  useEffect(() => {
    if (!promotionsPerPage[page]) {
      dispatch(getPromotionByRestaurant({ limit, page, order: "DESC" }))
    }
  }, [dispatch, limit, page, promotionsPerPage])

  const handleSearch = (query) => {
    dispatch(setSearchData(query))
  }

  const executeSearch = async (query) => {
    dispatch(getPromotionByRestaurant({ limit, page, order: "DESC", search_field: "title", search: query }))
  }

  return (
    <>
      <TableViewLayout
        title="Promociones"
        page={page}
        limit={limit}
        totalElements={totalPromotions}
        onNewItemClick={handleNewPromotion}
        items={promotionsList}
        tableStructure="promotionsScreen"
        totalItems={totalPageCount}
        loading={loadingPromotions}
        setPage={(newPage) => dispatch(setPage(newPage))}
        onSearch={handleSearch}
        value={searchData}
        searchAction={executeSearch}
        deleteAction={(id) => {
          open()
          setPromotionToDelete(id)
        }}
      />

      <ConfirmationModal
        opened={opened}
        close={close}
        title="¿Estás seguro que deseas eliminar?"
        description="Se eliminará la promoción seleccionada"
        onConfirm={() => dispatch(deleteOffer(promotionToDelete))}
      />
    </>
  )
}
