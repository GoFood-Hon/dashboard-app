import React from "react"
import { Textarea } from "@mantine/core"

export default function InputTextAreaField({ label, name, register, rules, errors, placeholder, disabled }) {
  return (
    <React.Fragment>
      <Textarea
        disabled={disabled}
        label={label}
        placeholder={placeholder}
        error={errors?.[name]?.message}
        {...register(name, rules)}
        autosize
        minRows={2}
      />
    </React.Fragment>
  )
}
