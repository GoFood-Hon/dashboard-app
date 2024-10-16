import React from "react"
import { Textarea } from "@mantine/core"
import { ErrorMessage } from "./ErrorMessage"

export default function InputTextAreaField({ label, name, register, rules, errors, placeholder }) {
  return (
    <React.Fragment>
      <Textarea
        label={label}
        placeholder={placeholder}
        error={errors?.[name]?.message}
        {...register(name, rules)}
        minRows={3}
      />
    </React.Fragment>
  )
}
