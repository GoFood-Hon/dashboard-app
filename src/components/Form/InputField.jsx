import React, { useState } from "react"
import { ErrorMessage } from "./ErrorMessage"
import { Icon } from "../Icon"

export default function InputField({
  label,
  name,
  register,
  rules,
  errors,
  placeholder,
  type = "text",
  value, // Cambia defaultValue a value
  onChange, // Asegura que tengas un onChange handler si es controlado
  countryPrefix
}) {
  const [showPassword, setShowPassword] = useState(false)

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword)
  }

  return (
    <React.Fragment>
      <label className="text-sky-950 text-sm font-bold leading-snug">{label}</label>

      <div className="flex items-center justify-center relative">
        {countryPrefix && (
          <div className="text-sky-900 font-bold text-sm mr-2 py-3 text-center border rounded-md h-full min-w-[4rem]">
            {countryPrefix}
          </div>
        )}
        <input
          className={`${
            errors[name] ? "border border-red-500" : "mb-2"
          }  mt-2 p-2 appearance-none block w-full border placeholder-gray-300 rounded focus:outline-none dark:bg-slate-900 dark:border-gray-600 dark:placeholder-gray-500`}
          type={type === "password" ? (showPassword ? "text" : "password") : type}
          value={value} // Usa value en lugar de defaultValue
          onChange={onChange} // Asegúrate de que este evento esté manejado correctamente
          placeholder={placeholder}
          {...register(name, rules)}
        />
        {type === "password" && (
          <button
            type="button"
            className="focus:outline-none pl-1 absolute right-2 top-0 bottom-0"
            onClick={togglePasswordVisibility}>
            <Icon icon="eye" size={20} />
          </button>
        )}
      </div>
      <ErrorMessage message={errors?.[name]?.message} />
    </React.Fragment>
  )
}
