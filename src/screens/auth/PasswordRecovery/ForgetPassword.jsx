import React, { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import toast from "react-hot-toast"
import authApi from "../../../api/authApi"
import EnterEmail from "./EnterEmail"
import SuccessScreen from "./SuccessScreen"
import EnterNewPassword from "./EnterNewPassword"
import EnterSecretCode from "./EnterSecretCode"
import { AUTH_NAVIGATION_ROUTES } from "../../../routes"
import { Flex, Group, Stack, Text } from "@mantine/core"
import { showNotification } from "@mantine/notifications"

export default function ForgetPassword() {
  const navigate = useNavigate()
  const [token, setToken] = useState(null)
  const [step, setStep] = useState("enterEmail")
  const [isLoading, setIsLoading] = useState(false)

  const handleEmailSubmit = async ({ email }) => {
    setIsLoading(true)
    try {
      const res = await authApi.forgotPassword({ email })
      if (res.error) {
        showNotification({
          title: "Error",
          message: res?.error?.message,
          color: "red"
        })
      }
      if (res.status === "success") {
        showNotification({
          title: "Correo enviado",
          message: `Se envió un código de verificación a ${email}`,
          color: "green"
        })
        setStep("enterSecretCode")
      }
    } catch (err) {
      toast.error("Se ha encontrado un error en su solicitud: ", err)
      showNotification({
        title: "Error",
        message: `Se ha encontrado un error en su solicitud`,
        color: "red"
      })
      return false
    }
    setIsLoading(false)
  }

  async function handleCodeSubmit({ token }) {
    setIsLoading(true)
    try {
      const res = await authApi.verifyOTP({ token })
      if (res.error) {
        showNotification({
          title: "Error",
          message: `El código ingresado no es válido`,
          color: "red"
        })
      }
      if (res.status === "success") {
        setToken(token)
        showNotification({
          title: "Código verificado",
          message: `Ahora puede restablecer su contraseña`,
          color: "green"
        })
        setStep("enterNewPassword")
      }
      setIsLoading(false)
    } catch (err) {
      showNotification({
        title: "Error",
        message: `Se ha encontrado un error en su solicitud`,
        color: "red"
      })
      return false
    }
    setIsLoading(false)
  }

  async function handlePasswordSubmit({ password, passwordConfirm }) {
    setIsLoading(true)
    try {
      const res = await authApi.resetPassword({ password, passwordConfirm, token })
      if (res.error) {
        showNotification({
          title: "Error",
          message: res?.error?.message,
          color: "red"
        })
        return
      }

      if (res.status === "success") {
        showNotification({
          title: "Contraseña restablecida",
          message: `Será redirigido al inicio de sesión en 10 segundos`,
          color: "green",
          autoClose: 5000
        })
        setStep("success")

        setTimeout(() => {
          navigate("/login") 
        }, 10000)
      }
    } catch (err) {
      showNotification({
        title: "Error",
        message: `Se ha encontrado un error en su solicitud`,
        color: "red"
      })
      return false
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      <Stack>
        {!step === "success" && (
          <Text fw={700} size="sm" ta="center" tt="uppercase" c="dimmed" fs="italic">
            Recuperar contraseña
          </Text>
        )}
        {step === "enterEmail" && <EnterEmail onSubmit={handleEmailSubmit} isLoading={isLoading} />}
        {step === "enterSecretCode" && <EnterSecretCode onSubmit={handleCodeSubmit} isLoading={isLoading} />}
        {step === "enterNewPassword" && <EnterNewPassword onSubmit={handlePasswordSubmit} isLoading={isLoading} />}
        {step === "success" && <SuccessScreen />}
        {step === "enterEmail" && (
          <Group justify="center">
            <Link className="text-sm text-gray-300 hover:underline" to={AUTH_NAVIGATION_ROUTES.Login.path}>
              Volver al inicio de sesión
            </Link>
          </Group>
        )}
      </Stack>
    </>
  )
}
