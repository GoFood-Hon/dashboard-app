import React, { useEffect, useState } from "react"
import { useLocation, useNavigate, Outlet } from "react-router-dom"
import logoImage from "../assets/images/colorFUDGOLetters.png"
import otLogoDark from "../assets/images/logo__ot__dark.svg"
import otLogoLight from "../assets/images/logo__ot__light.svg"
import authUtils from "../utils/authUtils"
import { Container, Flex, Group, Image, Paper, Stack, Text, useMantineColorScheme } from "@mantine/core"
import Lottie from "react-lottie"
import loginAnimation from "../assets/animation/LoginAnimation.json"
import { useMediaQuery } from "@mantine/hooks"

export default function UnauthenticatedLayout() {
  const location = useLocation()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: loginAnimation
  }
  const isSmallScreen = useMediaQuery("(max-width: 760px)")
  const { colorScheme } = useMantineColorScheme()

  useEffect(() => {
    const checkAuth = async () => {
      const isAuth = await authUtils.isAuthenticated()
      if (!isAuth) {
        setLoading(false)
      } else {
        navigate("/")
      }
    }
    checkAuth()
  }, [navigate])

  return (
    <Container
      h="100vh"
      fluid
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center"
      }}>
      <Flex align="center" gap="md">
        <Lottie
          style={isSmallScreen && { display: "none" }}
          options={defaultOptions}
          isClickToPauseDisabled={true}
          height={400}
        />
        <Paper
          withBorder
          shadow="md"
          py={50}
          p={30}
          radius="md"
          style={{
            minWidth: isSmallScreen ? "400px" : "550px",
            minHeight: "450px", 
            height: "100%", 
            maxWidth: "600px",
            maxHeight: "80vh" 
          }}>
          <Flex h="100%" direction='column' justify="space-between">
            <Group justify="center" position="center">
              <Image src={logoImage} alt="logo" h={28} />
            </Group>
            <Outlet />
            <Flex direction="column" mt="md" align="center">
              <Text c="dimmed" fs="italic" size="xs">
                powered by
              </Text>
              <Image src={colorScheme === "dark" ? otLogoDark : otLogoLight} style={{ color: "red" }} w={120} />
            </Flex>
          </Flex>
        </Paper>
      </Flex>
    </Container>
  )
}
