import React, { useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import { fetchBranches, setPage, setSearchData, setSelectedSearchOption, updateBranchStatus } from "../../store/features/branchesSlice"
import { NAVIGATION_ROUTES_RES_ADMIN } from "../../routes"
import CardsViewLayout from "../../screens/CardsViewLayout"
import { searchOptionsBranchs } from "../../utils/constants"

export default function Branches() {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const user = useSelector((state) => state.user.value)
  const limit = useSelector((state) => state.branches.itemsPerPage)
  const page = useSelector((state) => state.branches.currentPage)
  const branchesPerPage = useSelector((state) => state.branches.branchesPerPage)
  const totalBranches = useSelector((state) => state.branches.totalBranches)
  const totalPageCount = useSelector((state) => state.branches.totalPagesCount)
  const branchesList = branchesPerPage[page] || []
  const loadingBranches = useSelector((state) => state.branches.loadingBranches)
  const searchData = useSelector((state) => state.branches.searchData)
  const searchField = useSelector((state) => state.branches.searchField)

  useEffect(() => {
    if (!branchesPerPage[page]) {
      dispatch(fetchBranches({ limit, page, order: "DESC" }))
    }
  }, [dispatch, limit, page, branchesPerPage])

  const handleNewItem = () => {
    navigate(NAVIGATION_ROUTES_RES_ADMIN.Branches.NewBranch.path)
  }

  const onChangePagination = (newPage) => {
    dispatch(setPage(newPage))
  }

  const handleEnableSelected = async (id) => {
    dispatch(updateBranchStatus({ data: { id, isActive: true }, propertyToUpdate: "isActive" }))
  }

  const handleDisableSelected = async (id) => {
    dispatch(updateBranchStatus({ data: { id, isActive: false }, propertyToUpdate: "isActive" }))
  }

  const handleClick = (id) => {
    navigate(`${NAVIGATION_ROUTES_RES_ADMIN.Branches.path}/${id}`)
  }

  const handleSearch = (query) => {
    dispatch(setSearchData(query))
  }

  const executeSearch = async (query) => {
    dispatch(setPage(1))
    dispatch(fetchBranches({ limit, page: 1, order: "DESC", search_field: searchField, search: query }))
  }

  return (
    <CardsViewLayout
      title="Sucursales"
      page={page}
      limit={limit}
      totalPageCount={totalPageCount}
      totalElements={totalBranches}
      elementsName="sucursales"
      loadingElements={loadingBranches}
      elementsList={branchesList}
      onNewItemClick={handleNewItem}
      onEnableItem={handleEnableSelected}
      onDisableItem={handleDisableSelected}
      onDetailsClick={handleClick}
      onPaginationChange={onChangePagination}
      user={user}
      onSearch={handleSearch}
      value={searchData}
      searchAction={executeSearch}
      searchOptions={searchOptionsBranchs}
      selectedOption={searchField}
      setSelectedSearchOption={(value) => dispatch(setSelectedSearchOption(value))}
    />
  )
}
