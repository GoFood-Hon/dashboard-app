import React, { useContext, useEffect, useState, useRef } from "react"
import LoadingCircle from "../../components/LoadingCircle"
import { Link, useLocation, useNavigate } from "react-router-dom"
import { AuthContext } from "../../context/AuthProvider"
import Button from "../../components/Button"
import { useForm } from "react-hook-form"
import { emailRules, passwordRules } from "../../utils/inputRules"
import InputField from "../../components/Form/InputField"
import toast from "react-hot-toast"

export default function Login() {
  const { user, setUser } = useContext(AuthContext)

  const [isLoading, setIsLoading] = useState(false)

  const navigate = useNavigate()
  const location = useLocation()
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm()

  useEffect(() => {
    if (user && location.state?.from) {
      setIsLoading(true)
      setTimeout(() => {
        setIsLoading(false)
        navigate(location.state.from.pathname)
      }, 7000)
    } else if (user) {
      setIsLoading(true)
      setTimeout(() => {
        setIsLoading(false)
        navigate("/")
      }, 7000)
    }
  }, [user, location.state])

  const notify = () => toast.success("Acceso garantizado!")

  const onSubmit = (data) => {
    console.log("Submit information", data)
    notify()
    setUser(true)
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
        <div>
          <div className="flex flex-col items-center">
            <h1 className="text-3xl font-bold text-zinc-800 dark:text-white">Iniciar sesión en GoFood</h1>
            <p className="text-sm text-gray-500 pb-5">Inicia sesión con tu cuenta o con alguna red social.</p>
          </div>
          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col">
            <InputField
              label="Correo electrónico"
              name="email"
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
            <Link to={"/forgetPassword"} className="mb-3 mt-3 hover:underline hover:cursor-pointer text-sm text-orange-500">
              Olvidaste tu contraseña?
            </Link>
            <input
              value={"Iniciar sesión"}
              type="submit"
              className={
                "bg-slate-900 text-white flex h-10 w-full items-center justify-center space-x-3 rounded-md text-sm shadow-sm transition-all duration-700 focus:outline-none my-3"
              }
            />
          </form>

          {/*
           * SOCIAL MEDIA LOGINS
           */}

          <div className="w-full flex flex-col items-center justify-center text-sm text-gray-500">
            <div className="flex flex-row justify-center w-full mb-3">
              <p>No tienes una cuenta?</p>
              <Link to={"/register"} className="hover:underline text-orange-500 cursor-pointer pl-1">
                Crear cuenta
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
