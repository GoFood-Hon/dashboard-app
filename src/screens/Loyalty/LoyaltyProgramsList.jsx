import React, { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { fetchAllLoyaltyPrograms, setPage } from "../../store/features/loyaltySlice"
import TableViewLayout from "../TableViewLayout"

export const LoyaltyProgramsList = () => {
  const dispatch = useDispatch()
  const limit = useSelector((state) => state.loyalty.itemsPerPage)
  const page = useSelector((state) => state.loyalty.currentPage)
  const programsPerPage = useSelector((state) => state.loyalty.programsPerPage)
  const totalPrograms = useSelector((state) => state.loyalty.totalPrograms)
  const totalPageCount = useSelector((state) => state.loyalty.totalPagesCount)
  const programsList = programsPerPage[page] || []
  const loadingPrograms = useSelector((state) => state.loyalty.loadingPrograms)

  useEffect(() => {
    if (!programsPerPage[page]) {
      dispatch(fetchAllLoyaltyPrograms({ limit, page, order: "DESC" }))
    }
  }, [dispatch, limit, page, programsPerPage])

  return (
    <>
      <TableViewLayout
        title="Programas de lealtad"
        page={page}
        limit={limit}
        totalElements={totalPrograms}
        items={programsList.map((program) => ({
          ...program,
          restaurantName: program?.Restaurant?.name
        }))}
        tableStructure="loyaltyProgramsScreen"
        totalItems={totalPageCount}
        loading={loadingPrograms}
        setPage={(newPage) => dispatch(setPage(newPage))}
      />
    </>
  )
}
