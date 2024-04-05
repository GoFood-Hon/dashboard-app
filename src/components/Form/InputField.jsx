import React from "react"
import { ErrorMessage } from "./ErrorMessage"

export default function InputField({
  label,
  name,
  register,
  rules,
  errors,
  placeholder,
  type = "text",
  defaultValue,
  countryPrefix
}) {
  return (
    <React.Fragment>
      <label className="text-sky-950 text-sm font-bold leading-snug">{label}</label>

      <div className="flex items-center">
        {countryPrefix && (
          <div className="text-sky-900 font-bold text-sm mr-2 mb-4 p-2 bg-light_selected_element rounded-md h-full">
            {countryPrefix}
          </div>
        )}
        <input
          className={`${
            errors[name] ? "border border-red-500" : "mb-4"
          }  mt-1 p-2 appearance-none block w-full border placeholder-gray-300 rounded focus:outline-none dark:bg-slate-900 dark:border-gray-600 dark:placeholder-gray-500`}
          type={type}
          defaultValue={defaultValue}
          placeholder={placeholder}
          {...register(name, rules)}
        />
      </div>
      <ErrorMessage message={errors?.[name]?.message} />
    </React.Fragment>
  )
}
