import React, { useState } from "react"
import BaseLayout from "../components/BaseLayout"
import { Breadcrumbs, CloseButton, Grid, Input, Pagination } from "@mantine/core"
import Button from "../components/Button"
import { Link } from "react-router-dom"
import DishesCard from "../components/DishesCard"
import { colors } from "../theme/colors"

export default function Dishes() {
  const [searchDish, setSearchDish] = useState("")

  const dishes = [
    {
      src: "src/assets/dishes/whopper.png",
      status: "Habilitado",
      dishName: "Whopper",
      price: 120.0,
      isUserSearch: true,
      isUserLove: true,
      isPromotion: true
    },
    {
      src: "src/assets/dishes/whopper.png",
      status: "Deshabilitado",
      dishName: "Whopper",
      price: 120.0,
      isUserSearch: false,
      isUserLove: false,
      isPromotion: true
    },
    {
      src: "src/assets/dishes/whopper.png",
      status: "Habilitado",
      dishName: "CangreBurguer",
      price: 130.0,
      isUserSearch: true,
      isUserLove: true,
      isPromotion: false
    },
    {
      src: "src/assets/dishes/whopper.png",
      status: "Habilitado",
      dishName: "Whopper",
      price: 220.0,
      isUserSearch: false,
      isUserLove: false,
      isPromotion: false
    },
    {
      src: "src/assets/dishes/whopper.png",
      status: "Habilitado",
      dishName: "Whopper",
      price: 144.0,
      isUserSearch: true,
      isUserLove: false,
      isPromotion: true
    },
    {
      src: "src/assets/dishes/whopper.png",
      status: "Deshabilitado",
      dishName: "Whopper",
      price: 313.0,
      isUserSearch: false,
      isUserLove: true,
      isPromotion: false
    }
  ]

  const breadcrumbItems = [
    { title: "Inicio", href: "/" },
    { title: "Menu", href: "/menu" },
    { title: "Platillos", href: "/menu/dishes" }
  ].map((item, index) => (
    <Link to={item.href} key={index}>
      {item.title}
    </Link>
  ))

  return (
    <BaseLayout>
      <section>
        <div className="flex flex-row justify-between items-center pb-6">
          <div className="flex flex-row gap-x-3 items-center">
            <h1 className="text-white-200 text-2xl font-semibold">Platillos</h1>
            <Button text={"Nuevo Platillo"} className={"text-white text-md px-3 py-2 bg-primary_button mb-0"} />
          </div>
          <div>
            <Breadcrumbs>{breadcrumbItems}</Breadcrumbs>
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
