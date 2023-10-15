import React from "react"
import { Link } from "react-router-dom"
import { useForm } from "react-hook-form"
import InputField from "../../components/Form/InputField"
import { yupResolver } from "@hookform/resolvers/yup"
import { registrationValidationSchema } from "../../utils/inputRules"
import Button from "../../components/Button"

export default function Register() {
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm({
    resolver: yupResolver(registrationValidationSchema)
  })

  const onSubmit = (data) => {
    console.log("Submit information", data)
  }

  return (
    <>
      <div className="w-full justify-center p-3 xl:w-3/6 2xl:w-2/6 lg:w-3/6 md:w-3/6 sm:w-5/6 py-10 xs:w-full xs:rounded-none bg-white dark:bg-slate-800 dark:border-slate-700 drop-shadow-xl shadow-slate-100 overflow-x-hidden shadow-xl md:rounded-2xl border border-gray-200 dark:shadow-slate-800">
        <div className="md:p-12 xs:p-5 items-center justify-center flex dark:text-white">
          <div className="w-full">
            <div className=" flex flex-col items-center">
              <h1 className="text-3xl font-bold text-zinc-800 dark:text-white file">Bienvenido a GoFood</h1>
              <p className="text-sm text-gray-500 pb-5">Empecemos creando una cuenta</p>
            </div>
            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col">
              <InputField
                label="Nombre de usuario"
                name="username"
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
            <Button text={"Registrarse con Google"} icon={"google"} className={"bg-white text-black border border-gray-200"} />
            <Button text={"Registrarse con Facebook"} className={"bg-blue-700 text-white"} />
            <Button text={"Registrarse con Apple"} icon={"apple"} className={"bg-black text-white"} />
            <div className="flex flex-row justify-center w-full mb-3">
              <p>Ya tienes una cuenta?</p>
              <Link to={"/login"} className="hover:underline text-orange-500 cursor-pointer pl-1">
                Iniciar sesión
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
