import React, { useEffect, useState } from "react"
import BaseLayout from "../../components/BaseLayout"
import { Breadcrumbs, CloseButton, Grid, Input, Pagination } from "@mantine/core"
import Button from "../../components/Button"
import { useNavigate, useLocation } from "react-router-dom"
import DishesCard from "../../components/DishesCard"
import { colors } from "../../theme/colors"
import { NAVIGATION_ROUTES } from "../../routes"
import BreadCrumbNavigation from "../../components/BreadCrumbNavigation"
import { useDispatch, useSelector } from "react-redux"
import { fetchDishes, selectAllDishes, selectDishesError, selectDishesStatus } from "../../store/features/DishesSlice"
import LoadingCircle from "../../components/LoadingCircle"

export default function Dishes() {
  const navigate = useNavigate()
  const location = useLocation()

  const dispatch = useDispatch()
  const dishes = useSelector(selectAllDishes)
  const status = useSelector(selectDishesStatus)
  const error = useSelector(selectDishesError)

  const [searchDish, setSearchDish] = useState("")

  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchDishes())
    }
  }, [status, dispatch])

  const handleNewDish = () => {
    navigate(NAVIGATION_ROUTES.Menu.submenu.Dishes.submenu.NewDish.path)
  }

  return (
    <BaseLayout>
      <section>
        <div className="flex flex-row justify-between items-center pb-6">
          <div className="flex flex-row gap-x-3 items-center">
            <h1 className="text-white-200 text-2xl font-semibold">Platillos</h1>
            <Button
              text={"Nuevo Platillo"}
              className={"text-white text-md px-3 py-2 bg-primary_button mb-0"}
              onClick={handleNewDish}
            />
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
          {dishes.map((item, key) => (
            <Grid.Col span={{ base: 12, md: 6, lg: 3 }} key={key}>
              <DishesCard dish={item} />
            </Grid.Col>
          ))}
        </Grid>
      </section>
      <section className="flex flex-row justify-between">
        <div />
        <Pagination total={10} color={colors.primary_button} />
      </section>
    </BaseLayout>
  )
}
