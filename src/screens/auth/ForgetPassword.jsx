import React from "react"
import { useForm } from "react-hook-form"
import { Link } from "react-router-dom"
import { emailRules } from "../../utils/inputRules"
import InputField from "../../components/Form/InputField"

export default function ForgetPassword() {
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm()

  const onSubmit = (data) => {
    console.log("Submit information", data)
  }

  return (
    <>
      <div>
        <div className=" flex flex-col items-center">
          <h1 className="text-3xl font-bold text-zinc-800 dark:text-white file">Recuperar contraseña!</h1>
          <p className="text-sm text-gray-500 pb-5 mt-2 text-center">
            Ingrese su correo y siga las instrucciones que se enviaran a su correo.
          </p>
        </div>
        <div className="flex flex-col">
          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col">
            <InputField
              label="Correo electrónico"
              name="email"
              register={register}
              rules={emailRules}
              errors={errors}
              placeholder="Ingrese su correo"
            />
            <input
              value={"Envíame el correo"}
              type="submit"
              className={
                "bg-slate-900 text-white flex h-10 w-full items-center justify-center space-x-3 rounded-md text-sm shadow-sm transition-all duration-700 focus:outline-none my-3"
              }
            />
          </form>
          <Link
            to={"/login"}
            className=" text-center items-center justify-center w-full text-orange-500 hover:underline font-bold">
            Iniciar sesión
          </Link>
        </div>
      </div>
    </>
  )
}
