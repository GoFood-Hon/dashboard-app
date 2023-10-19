import React from "react"
import InputField from "../../../components/Form/InputField"
import { useForm } from "react-hook-form"
import { emailRules } from "../../../utils/inputRules"

export default function EnterEmail({ onSubmit }) {
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm()

  return (
    <div>
      <p className="text-sm text-gray-500 pb-5 mt-2 text-center">
        Ingrese su correo y siga las instrucciones que se enviaran a su correo.
      </p>
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
              "bg-primary_button text-white flex h-10 w-full items-center justify-center space-x-3 rounded-md text-sm shadow-sm transition-all duration-700 focus:outline-none my-3 dark:bg-slate-900"
            }
          />
        </form>
      </div>
    </div>
  )
}
