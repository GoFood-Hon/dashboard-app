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
    try {
      const res = await authApi.login({ email, password })

      if (res.status === "fail") {
        toast.error(res.message)
        return
      }
      const userData = res?.data?.user

      if (userData) {
        setIsLoading(false)
        localStorage.setItem("token", res.token)
        localStorage.setItem("refreshToken", res.refreshToken)
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
      {isLoading ? (
        <div className="flex flex-col items-center">
          <div className=" flex flex-col items-center">
            <h1 className="text-3xl font-bold text-zinc-800 dark:text-white">Iniciando sesión</h1>
            <p className="text-sm text-gray-500 pb-5">Conectando con el servidor... 📡</p>
          </div>
          <LoadingCircle />
        </div>
      ) : (
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
            <input
              value={"Iniciar sesión"}
              type="submit"
              className={
                "bg-primary_button text-white flex h-10 w-full items-center justify-center space-x-3 rounded-md text-sm shadow-sm transition-all duration-700 focus:outline-none my-3 dark:bg-slate-900 cursor-pointer"
              }
            />
          </form>
        </div>
      )}
    </>
  )
}
