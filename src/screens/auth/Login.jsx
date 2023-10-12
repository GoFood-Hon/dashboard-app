import React, { useContext, useEffect, useState } from "react"
import LoadingCircle from "../../components/LoadingCircle"
import { Link, useLocation, useNavigate } from "react-router-dom"

import { AuthContext } from "../../context/AuthProvider"
import Button from "../../components/Button"
import { useForm } from "react-hook-form"
import { ErrorMessage } from "../../components/ErrorMessage"

export default function Login() {
  const [isLoading, setIsLoading] = useState(false)
  const { user, setUser } = useContext(AuthContext)

  const navigate = useNavigate()
  const location = useLocation()
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm()

  const emailRules = {
    required: "Correo es requerido.",
    pattern: {
      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
      message: "Correo incorrecto."
    },
    maxLength: {
      value: 100,
      message: "Correo es demasiado largo."
    }
  }

  const passwordRules = {
    required: "Contraseña es requerida.",
    minLength: {
      value: 8,
      message: "Contraseña tiene que tener por lo menos 8 caracteres."
    }
  }

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

  const onSubmit = (data) => {
    console.log("Submit information", data)
    setUser(true)
  }

  return (
    <>
      {isLoading ? (
        <div className="flex flex-col items-center">
          <div className=" flex flex-col items-center">
            <h1 className="text-3xl font-bold text-zinc-800 dark:text-white file">Iniciando sesión</h1>
            <p className="text-sm text-gray-500 pb-5">Conectando con el servidor... 📡</p>
          </div>
          <LoadingCircle />
        </div>
      ) : (
        <div>
          <div className=" flex flex-col items-center">
            <h1 className="text-3xl font-bold text-zinc-800 dark:text-white file">Iniciar sesión en GoFood</h1>
            <p className="text-sm text-gray-500 pb-5">Inicia sesión con tu cuenta o con alguna red social.</p>
          </div>
          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col">
            <span className="text-slate-400">Correo electrónico</span>
            <input
              className={`${
                errors.email ? "border border-red-500" : "mb-4"
              }  mt-2 p-2 appearance-none block w-full border placeholder-gray-300 rounded focus:outline-none dark:bg-slate-900 dark:border-gray-600 dark:placeholder-gray-500`}
              type="text"
              placeholder="Ingrese su correo"
              {...register("email", emailRules)}
            />
            {errors.email && <span className="text-red-500 text-xs mb-3 pt-1">{errors.email.message}</span>}
            <span className="text-slate-400">Contraseña</span>
            <input
              className={`${
                errors.password ? "border border-red-500" : "mb-4"
              } mt-2 p-2 appearance-none block w-full border placeholder-gray-300 rounded focus:outline-none dark:bg-slate-900 dark:border-gray-600 dark:placeholder-gray-500`}
              type="password"
              placeholder="Ingrese su contraseña"
              {...register("password", passwordRules)}
            />
            <ErrorMessage message={errors?.password?.message} />
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
          <Button text={"Iniciar sesión con Google"} icon={"google"} className={"bg-white text-black border border-gray-200"} />
          <Button text={"Iniciar sesión con Facebook"} className={"bg-blue-700 text-white"} />
          <Button text={"Iniciar sesión con Apple"} icon={"apple"} className={"bg-black text-white"} />
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
