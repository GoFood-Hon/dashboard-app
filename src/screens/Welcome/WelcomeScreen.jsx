import React from "react"
import BaseLayout from "../../components/BaseLayout"
import { useSelector } from "react-redux"
import { Grid } from "@mantine/core"
import Cards from "../../components/Cards"
import { welcomeCards } from "../../utils/constants"

export const WelcomeScreen = () => {
  const user = useSelector((state) => state.user.value)

  return (
    <BaseLayout>
      <section className="mx-auto w-[30rem] mt-10">
        <h1 className="font-extrabold text-left text-6xl text-blue-950 leading-relaxed">
          Hola, <p className="text-green-500">{user.name}👋</p>
        </h1>
      </section>
      <section className="max-w-[50rem] mx-auto mt-8">
        <Grid>
          {welcomeCards.map((item, key) => (
            <Grid.Col span={{ base: 12, md: 6, lg: 4 }} key={key}>
              <Cards gutter={{ base: 5, xs: "md", md: "xl", xl: 50 }} data={item} />
            </Grid.Col>
          ))}
        </Grid>
      </section>
    </BaseLayout>
  )
}
