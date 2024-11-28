import { Button, Container, Flex, Image, SimpleGrid, Text, Title } from "@mantine/core"
import classes from "./NotFound.module.css"
import Lottie from "react-lottie"
import animationData from "../../assets/animation/NotFoundPage.json"
import { useNavigate } from "react-router-dom"

export function NotFound() {
  const navigate = useNavigate()
  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice"
    }
  }

  return (
    <Container
      fluid
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        width: "100vw"
      }}>
      <SimpleGrid spacing={{ base: 40, sm: 80 }} cols={{ base: 1, sm: 2 }} style={{ maxWidth: "800px", textAlign: "center" }}>
        <Flex direction="column" align="center">
          <Title>Algo salió mal...</Title>
          <Text c="dimmed" size="lg">
            La página que estás intentando buscar no existe. Quizá estás buscando una dirección incorrecta, o la página que buscas se movió a otra URL.
          </Text>
          <Button onClick={() => navigate('/')} variant="outline" size="md" mt="md">
            Volver al inicio
          </Button>
        </Flex>
        <Lottie options={defaultOptions} width={440} />
      </SimpleGrid>
    </Container>
  )
}
