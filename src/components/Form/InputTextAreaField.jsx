import React from "react"
import { ErrorMessage } from "./ErrorMessage"

export default function InputTextAreaField({ label, name, register, rules, errors, placeholder }) {
  return (
    <React.Fragment>
      <label className="text-sm font-bold leading-snug">{label}</label>
      <textarea
        className={`${
          errors[name] ? "border border-red-500" : null
        }  p-2 appearance-none block w-full `}
        placeholder={placeholder}
        {...register(name, rules)}
      />
      <ErrorMessage message={errors?.[name]?.message} />
    </React.Fragment>
  )
}
