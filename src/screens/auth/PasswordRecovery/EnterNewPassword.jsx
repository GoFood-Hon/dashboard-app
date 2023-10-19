import React from "react"
import InputField from "../../../components/Form/InputField"
import { yupResolver } from "@hookform/resolvers/yup"
import { passwordValidationSchema } from "../../../utils/inputRules"
import { useForm } from "react-hook-form"

export default function EnterNewPassword({ onSubmit }) {
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm({
    resolver: yupResolver(passwordValidationSchema)
  })

  return (
    <div className="w-full">
      <p className="text-sm dark:text-gray-300 pb-5 mt-2 text-center">Por favor ingrese su nueva contraseña.</p>
      <div className="flex flex-col">
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col">
          <InputField
            label="Nueva contraseña"
            name="password"
            type="password"
            register={register}
            errors={errors}
            placeholder="Ingrese su contraseña"
          />
          <InputField
            label="Confirmar contraseña"
            name="passwordConfirm"
            type="password"
            register={register}
            errors={errors}
            placeholder="Ingrese su contraseña nuevamente"
          />
          <input
            value={"Enviar"}
            type="submit"
            className={
              "bg-primary_button text-white flex h-10 w-full items-center justify-center space-x-3 rounded-md text-sm shadow-sm transition-all duration-700 focus:outline-none my-3 dark:bg-slate-900"
            }
          />
        </form>
      </div>
    </div>
  )
}
