import React from "react"
import { ErrorMessage } from "./ErrorMessage"

export default function InputTextAreaField({ label, name, register, rules, errors, placeholder }) {
  return (
    <div>
      <label className="text-slate-400">{label}</label>
      <textarea
        className={`${
          errors[name] ? "border border-red-500" : "mb-4"
        }  mt-2 p-2 appearance-none block w-full border placeholder-gray-300 rounded focus:outline-none dark:bg-slate-900 dark:border-gray-600 dark:placeholder-gray-500`}
        placeholder={placeholder}
        {...register(name, rules)}
      />
      <ErrorMessage message={errors?.[name]?.message} />
    </div>
  )
}
