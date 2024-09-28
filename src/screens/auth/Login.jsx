import React, { useState } from "react"
import LoadingCircle from "../../components/LoadingCircle"
import { Link, useNavigate } from "react-router-dom"
import { useForm } from "react-hook-form"
import { emailRules, passwordRules } from "../../utils/inputRules"
import InputField from "../../components/Form/InputField"
import toast from "react-hot-toast"
import authApi from "../../api/authApi"
import { useDispatch } from "react-redux"
import { setUser } from "../../store/features/userSlice"
import { AUTH_NAVIGATION_ROUTES } from "../../routes"
import { LoaderComponent } from "../../components/LoaderComponent"

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
      <div className="w-full">
        <div className="mb-5">
          <p className="text-sm text-gray-500 pb-2">PANEL GOFOOD</p>
          <h1 className="text-3xl font-bold text-zinc-800 dark:text-white">Inicio de sesión</h1>
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col">
          <InputField
            label="Correo"
            name="email"
            type="email"
            register={register}
            rules={emailRules}
            errors={errors}
            placeholder="Ingrese su correo"
          />
          <InputField
            label="Contraseña"
            name="password"
            type="password"
            rules={passwordRules}
            register={register}
            errors={errors}
            placeholder="Ingrese su contraseña"
          />
          <Link
            to={AUTH_NAVIGATION_ROUTES.ForgetPassword.path}
            className="mb-3 mt-3 hover:underline hover:cursor-pointer text-sm text-secondary_text">
            ¿Olvidaste tu contraseña?
          </Link>
          {isLoading ? (
            <LoaderComponent width={'full'} size={28} margin />
          ) : (
            <input
              value={"Iniciar sesión"}
              type="submit"
              className={
                "bg-primary_button text-white flex h-10 w-full items-center justify-center space-x-3 rounded-md text-sm shadow-sm transition-all duration-700 focus:outline-none my-3 dark:bg-slate-900 cursor-pointer"
              }
            />
          )}
        </form>
      </div>
    </>
  )
}
