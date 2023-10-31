import React, { useEffect, useState } from "react"
import BaseLayout from "../components/BaseLayout"
import { Breadcrumbs, CloseButton, Grid, Input } from "@mantine/core"
import { Link, useLocation, useNavigate } from "react-router-dom"
import BreadCrumbNavigation from "../components/BreadCrumbNavigation"
import { useDispatch, useSelector } from "react-redux"
import {
  fetchComplements,
  selectAllComplements,
  selectComplementsError,
  selectComplementsStatus
} from "../store/features/complementsSlice"
import LoadingCircle from "../components/LoadingCircle"
import ItemCard from "../components/ItemCard"

export default function Complements() {
  const navigate = useNavigate()
  const location = useLocation()

  const dispatch = useDispatch()
  const complements = useSelector(selectAllComplements)
  const status = useSelector(selectComplementsStatus)
  const error = useSelector(selectComplementsError)
  const [searchDish, setSearchDish] = useState("")

  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchComplements())
    }
  }, [status, dispatch])

  return (
    <BaseLayout>
      <section>
        <div className="flex flex-row justify-between items-center pb-6">
          <div className="flex flex-row gap-x-3 items-center">
            <h1 className="text-white-200 text-2xl font-semibold">Complementos</h1>
          </div>
          <div>
            <Breadcrumbs>
              <BreadCrumbNavigation location={location} />
            </Breadcrumbs>
          </div>
        </div>
      </section>
      <section>
        <div>
          <Input
            className="w-80"
            placeholder="Buscar platillo"
            value={searchDish}
            onChange={(event) => setSearchDish(event.currentTarget.value)}
            rightSectionPointerEvents="all"
            rightSection={
              <CloseButton
                aria-label="Clear input"
                onClick={() => setSearchDish("")}
                style={{ display: searchDish ? undefined : "none" }}
              />
            }
          />
        </div>
      </section>
      <section className="my-6 w-full">
        {status === "loading" && (
          <div className="h-[calc(100vh-350px)] w-full flex justify-center items-center">
            <LoadingCircle />
          </div>
        )}

        {status === "error" && <div>Error: {error}</div>}

        <Grid grow>
          {complements?.map((item, key) => (
            <Grid.Col span={{ base: 12, md: 6, lg: 3 }} key={key}>
              <ItemCard item={item} />
            </Grid.Col>
          ))}
        </Grid>
      </section>
    </BaseLayout>
  )
}
