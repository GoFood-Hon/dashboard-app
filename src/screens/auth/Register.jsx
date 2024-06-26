import React, { useState } from "react"
import { Link } from "react-router-dom"
import { useForm } from "react-hook-form"
import InputField from "../../components/Form/InputField"
import { yupResolver } from "@hookform/resolvers/yup"
import { registrationValidationSchema } from "../../utils/inputRules"
import { AUTH_NAVIGATION_ROUTES } from "../../routes"
import authApi from "../../api/authApi"
import toast from "react-hot-toast"
import { useDispatch } from "react-redux"
import { setUser } from "../../store/features/userSlice"

export default function Register() {
  const [isLoading, setIsLoading] = useState(false)
  const dispatch = useDispatch()

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm({
    resolver: yupResolver(registrationValidationSchema)
  })

  const onSubmit = async ({ name, email, password, phoneNumber }) => {
    try {
      const res = await authApi.signup({ name, email, password, phoneNumber: "+50412345678" })

      if (res.error) {
        toast.error(`Hubo un error. ${res.message}`)
        return
      }
      const userData = res?.data?.user

      if (userData) {
        toast.success("Usuario registrado, bienvenido a GoFood!")
        setIsLoading(false)
        localStorage.setItem("token", res.token)
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
        <div className="w-full">
          <div className=" flex flex-col items-center">
            <h1 className="text-3xl font-bold text-zinc-800 dark:text-white file">Bienvenido a GoFood</h1>
            <p className="text-sm text-gray-500 pb-5">Empecemos creando una cuenta</p>
          </div>
          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col">
            <InputField
              label="Nombre de usuario"
              name="name"
              register={register}
              errors={errors}
              placeholder="Ingrese nombre de usuario"
            />
            <InputField
              label="Correo electrónico"
              name="email"
              register={register}
              errors={errors}
              placeholder="Ingrese su correo"
            />
            <InputField
              label="Contraseña"
              name="password"
              type="password"
              register={register}
              errors={errors}
              placeholder="Ingrese su contraseña"
            />
            <InputField
              label="Confirmar contraseña"
              name="confirmPassword"
              type="password"
              register={register}
              errors={errors}
              placeholder="Ingrese su contraseña nuevamente"
            />
            <input
              value={"Registrarse"}
              type="submit"
              className={
                "bg-slate-900 text-white flex h-10 w-full items-center justify-center space-x-3 rounded-md text-sm shadow-sm transition-all duration-700 focus:outline-none my-3"
              }
            />
          </form>
          {/*
            <Button text={"Registrarse con Google"} icon={"google"} className={"bg-white text-black border border-gray-200"} />
            <Button text={"Registrarse con Facebook"} className={"bg-blue-700 text-white"} />
            <Button text={"Registrarse con Apple"} icon={"apple"} className={"bg-black text-white"} />
          */}
          <div className="flex flex-row justify-center w-full mb-3">
            <p>Ya tienes una cuenta?</p>
            <Link
              to={AUTH_NAVIGATION_ROUTES.Login.path}
              className="hover:underline pl-1 text-primary_text cursor-pointer dark:text-dark_secondary_text">
              Iniciar sesión
            </Link>
          </div>
        </div>
      </div>
    </>
  )
}
