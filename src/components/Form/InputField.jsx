import React from "react"
import { ErrorMessage } from "./ErrorMessage"

export default function InputField({ label, name, register, rules, errors, placeholder, type = "text" }) {
  return (
    <div>
      <label className="text-slate-400">{label}</label>
      <input
        className={`${
          errors[name] ? "border border-red-500" : "mb-4"
        }  mt-2 p-2 appearance-none block w-full border placeholder-gray-300 rounded focus:outline-none dark:bg-slate-900 dark:border-gray-600 dark:placeholder-gray-500`}
        type={type}
        placeholder={placeholder}
        {...register(name, rules)}
      />
      <ErrorMessage message={errors?.[name]?.message} />
    </div>
  )
}
