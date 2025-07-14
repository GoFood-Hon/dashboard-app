import React, { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"
import { SETTING_NAVIGATION_ROUTES } from "../../routes"
import TableViewLayout from "../../screens/TableViewLayout"
import { deleteOffer, getPromotionByRestaurant, setPage, setSearchData } from "../../store/features/promotionsSlice"
import { useState } from "react"
import ConfirmationModal from "../ConfirmationModal"
import { useDisclosure } from "@mantine/hooks"
import { searchOptionsPromotions } from "../../utils/constants"
import { NoPermissionsAnimation } from "../../components/Plans/NoPermissionsAnimation"

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
  const searchField = useSelector((state) => state.promotions.searchField)
  const [promotionToDelete, setPromotionToDelete] = useState(null)
  const [opened, { close, open }] = useDisclosure(false)
  const user = useSelector((state) => state.user.value)
  const havePromotionsModule = !!user?.Restaurant?.Subscription?.Plan?.PlanFeatures?.some(
    (feature) => feature.featureCode === "promotions-module" && feature.PlanPlanFeatures?.avai === true
  )

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
    dispatch(setPage(1))
    dispatch(getPromotionByRestaurant({ limit, page: 1, order: "DESC", search_field: searchField, search: query }))
  }

  return havePromotionsModule ? (
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
        searchOptions={searchOptionsPromotions}
        selectedOption={searchField}
        setSelectedSearchOption={(value) => dispatch(setSelectedSearchOption(value))}
      />

      <ConfirmationModal
        opened={opened}
        close={close}
        title="¿Estás seguro que deseas eliminar?"
        description="Se eliminará la promoción seleccionada"
        onConfirm={() => dispatch(deleteOffer(promotionToDelete))}
      />
    </>
  ) : (
    <NoPermissionsAnimation moduleName='promociones' />
  )
}
