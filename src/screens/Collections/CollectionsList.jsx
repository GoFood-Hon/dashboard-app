import React, { useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { NAVIGATION_ROUTES_SUPER_ADMIN } from "../../routes"
import { useDispatch, useSelector } from "react-redux"
import { setCurrentPage } from "../../store/features/userSlice"
import { fetchCollections, setSearchData, setSelectedSearchOption } from "../../store/features/collectionsSlice"
import TableViewLayout from "../TableViewLayout"
import { searchOptionsCollections } from "../../utils/constants"

export const CollectionsList = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const limit = useSelector((state) => state.collections.itemsPerPage)
  const page = useSelector((state) => state.collections.currentPage)
  const collectionsPerPage = useSelector((state) => state.collections.collectionsPerPage)
  const totalCollections = useSelector((state) => state.collections.totalCollections)
  const totalPageCount = useSelector((state) => state.collections.totalPagesCount)
  const collectionsList = collectionsPerPage[page] || []
  const loadingCollections = useSelector((state) => state.collections.loadingCollections)
  const searchData = useSelector((state) => state.collections.searchData)
  const searchField = useSelector((state) => state.collections.searchField)

  useEffect(() => {
    if (!collectionsPerPage[page]) {
      dispatch(fetchCollections({ limit, page, order: "DESC" }))
    }
  }, [dispatch, limit, page, collectionsPerPage, loadingCollections])

  const handleNewItem = () => {
    navigate(NAVIGATION_ROUTES_SUPER_ADMIN.Collections.NewCollection.path)
  }

  const handleSearch = (query) => {
    dispatch(setSearchData(query))
  }

  const executeSearch = async (query) => {
    dispatch(fetchCollections({ limit, page, order: "DESC", search_field: searchField, search: query }))
  }

  return (
    <>
      <TableViewLayout
        title="Colecciones"
        page={page}
        limit={limit}
        totalElements={totalCollections}
        onNewItemClick={handleNewItem}
        items={collectionsList}
        tableStructure="collectionsScreen"
        totalItems={totalPageCount}
        loading={loadingCollections}
        setPage={(newPage) => dispatch(setCurrentPage(newPage))}
        onSearch={handleSearch}
        value={searchData}
        searchAction={executeSearch}
        searchOptions={searchOptionsCollections}
        selectedOption={searchField}
        setSelectedSearchOption={(value) => dispatch(setSelectedSearchOption(value))}
      />
    </>
  )
}
