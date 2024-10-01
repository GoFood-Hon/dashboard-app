import React, { useEffect, useState } from "react"
import { useSelector } from "react-redux"
import { Grid } from "@mantine/core"
import Cards from "../../components/Cards"
import { APP_ROLES, branchWelcomeCards, kitchenWelcomeCards } from "../../utils/constants"

export const WelcomeScreen = () => {
  const user = useSelector((state) => state.user.value)

  const [welcomeCards, setWelcomeCards] = useState([])

  useEffect(() => {
    if (user && user.role) {
      switch (user.role) {
        case APP_ROLES.branchAdmin:
          setWelcomeCards(branchWelcomeCards)
          break
        case APP_ROLES.cashierUser:
          setWelcomeCards(branchWelcomeCards)
          break
        case APP_ROLES.kitchenUser:
          setWelcomeCards(kitchenWelcomeCards)
          break
        default:
          setWelcomeCards([])
          break
      }
    }
  }, [user])

  return (
    <>
      <section className="mx-auto w-[30rem] mt-10">
        <h1 className="font-extrabold text-left text-6xl text-blue-950 leading-relaxed">
          Hola, <p className="text-green-500">{user.name}👋</p>
        </h1>
      </section>
      <section className="max-w-[50rem] mx-auto mt-8">
        <Grid>
          {welcomeCards.map((item, key) => (
            <Grid.Col span={{ base: 12, md: 6, lg: 4 }} key={key}>
              <Cards data={item} />
            </Grid.Col>
          ))}
        </Grid>
      </section>
    </>
  )
}
