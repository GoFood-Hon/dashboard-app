import React, { useEffect, useState } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import livingImage from "../assets/images/living.png"
import layout1Image from "../assets/images/layout1.png"
import logoImage from "../assets/images/colorFUDGOLetters.png"
import otLogoDark from "../assets/images/logo__ot__dark.svg"
import otLogoLight from "../assets/images/logo__ot__light.svg"
import authUtils from "../utils/authUtils"
import { Anchor, Button, Checkbox, Container, Flex, Group, Image, Paper, Stack, Text, useMantineColorScheme } from "@mantine/core"
import { colors } from "../theme/colors"
import Lottie from "react-lottie"
import loginAnimation from "../assets/animation/LoginAnimation.json"
import { useMediaQuery } from "@mantine/hooks"
import InputField from "../components/Form/InputField"
import { useDispatch } from "react-redux"
import authApi from "../api/authApi"
import { setUser } from "../store/features/userSlice"
import { useForm } from "react-hook-form"
import { emailRules, passwordRules } from "../utils/inputRules"
import { AUTH_NAVIGATION_ROUTES } from "../routes"

export default function UnauthenticatedLayout() {
  const location = useLocation()
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [bgImage, setBgImage] = useState(layout1Image)
  const [loading, setLoading] = useState(true)
  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: loginAnimation
  }
  const isSmallScreen = useMediaQuery("(max-width: 760px)")
  const { colorScheme } = useMantineColorScheme()

  const [isLoading, setIsLoading] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm()

  const onSubmit = async ({ email, password }) => {
    setIsLoading(true)
    try {
      const res = await authApi.login({ email, password })

      if (res.status === "fail") {
        setIsLoading(false)
        toast.error(res.message)
        return
      }
      const userData = res?.data?.user

      if (userData) {
        setIsLoading(false)
        localStorage.setItem("token", res.token)
        localStorage.setItem("refreshToken", res.refreshToken)
        localStorage.setItem("setUserRole", res.data.user.role)
        dispatch(setUser(res.data.user))
        navigate("/")
      }
    } catch (err) {
      toast.error("Hubo un error!")
      setIsLoading(false)
    }
  }

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

  useEffect(() => {
    if (location.pathname === "/olvideMiContrase%C3%B1a") {
      setBgImage(livingImage)
    } else {
      setBgImage(layout1Image)
    }
  }, [location])

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
          height={500}
        />
        <Paper withBorder shadow="md" py={50} p={30} radius="md" w="100%">
          <Stack>
            <Group justify="center" position="center">
              <Image src={logoImage} alt="logo" h={28} />
            </Group>
            <form onSubmit={handleSubmit(onSubmit)}>
              <Flex direction="column" gap="md">
                <InputField label="Correo" name="email" type="email" register={register} rules={emailRules} errors={errors} />
                <InputField
                  label="Contraseña"
                  name="password"
                  type="password"
                  rules={passwordRules}
                  register={register}
                  errors={errors}
                />
                <Group justify="space-between" mt="md">
                  <Checkbox style={{ visibility: "hidden" }} color={colors.main_app_color} label="Recuérdame" />
                  <Anchor
                    c="dimmed"
                    href={AUTH_NAVIGATION_ROUTES.ForgetPassword.path}
                    target="_blank"
                    component="button"
                    size="sm">
                    ¿Olvidaste tu contraseña?
                  </Anchor>
                </Group>
                <Button type="submit" loading={isLoading} fullWidth color={colors.main_app_color}>
                  Iniciar sesión
                </Button>
              </Flex>
            </form>
            <Flex direction="column" mt="md" align="center">
              <Text c="dimmed" fs="italic" size="xs">
                powered by
              </Text>
              <Image src={colorScheme === "dark" ? otLogoDark : otLogoLight} style={{ color: "red" }} w={120} />
            </Flex>
          </Stack>
        </Paper>
      </Flex>
    </Container>
  )
}
