import React, { useEffect, useState } from "react"
import { useSelector } from "react-redux"
import { Container, Grid, Title } from "@mantine/core"
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
    <Container>
      <section className=" w-[30rem] mt-10">
        <Title fw={700} order={1}>
          Hola, {user.name}
        </Title>
      </section>
      <section className="max-w-[50rem] mt-8">
        <Grid>
          {welcomeCards.map((item, key) => (
            <Grid.Col span={{ base: 12, md: 6, lg: 4 }} key={key}>
              <Cards data={item} />
            </Grid.Col>
          ))}
        </Grid>
      </section>
    </Container>
  )
}
