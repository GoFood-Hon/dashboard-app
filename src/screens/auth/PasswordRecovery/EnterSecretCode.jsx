import React from "react"
import InputField from "../../../components/Form/InputField"
import { inputRequired } from "../../../utils/inputRules"
import { useForm } from "react-hook-form"

export default function EnterSecretCode({ onSubmit }) {
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm()

  return (
    <div>
      <p className="text-sm dark:text-gray-300 pb-5 mt-2 text-center">
        Por favor ingrese el código enviado a su correo, valido por 10 minutos.
      </p>

      <div className="flex flex-col">
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col">
          <InputField
            errors={errors}
            label="Código"
            rules={inputRequired}
            name="token"
            register={register}
            placeholder="Ingrese el código secreto"
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
