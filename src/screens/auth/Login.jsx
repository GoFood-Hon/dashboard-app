import React, { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useForm } from "react-hook-form"
import { emailRules, passwordRules } from "../../utils/inputRules"
import InputField from "../../components/Form/InputField"
import toast from "react-hot-toast"
import authApi from "../../api/authApi"
import { useDispatch } from "react-redux"
import { setUser } from "../../store/features/userSlice"
import { AUTH_NAVIGATION_ROUTES } from "../../routes"
import { Anchor, Button, Checkbox, Flex, Group } from "@mantine/core"
import { colors } from "../../theme/colors"

export default function Login() {
  const dispatch = useDispatch()
  const navigate = useNavigate()

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

  return (
    <>
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
            <Link
              className="text-sm text-gray-400 hover:underline"
              to={AUTH_NAVIGATION_ROUTES.ForgetPassword.path}>
              ¿Olvidaste tu contraseña?
            </Link>
          </Group>
          <Button type="submit" loading={isLoading} fullWidth color={colors.main_app_color}>
            Iniciar sesión
          </Button>
        </Flex>
      </form>
    </>
  )
}
