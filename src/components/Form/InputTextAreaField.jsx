import React from "react"
import { Textarea } from "@mantine/core"

export default function InputTextAreaField({ label, name, register, rules, errors, placeholder }) {
  return (
    <React.Fragment>
      <Textarea
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
