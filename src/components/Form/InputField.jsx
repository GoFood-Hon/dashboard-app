import React, { useState } from "react"
import { Grid, Input, PasswordInput } from "@mantine/core"
import { IconEye, IconEyeOff } from "@tabler/icons-react"

export default function InputField({
  label,
  name,
  register,
  rules,
  errors,
  placeholder,
  type = "text",
  value,
  onChange,
  countryPrefix,
  defaultValue
}) {
  return (
    <React.Fragment>
      <Grid grow>
        <Grid.Col>
          <Input.Wrapper label={label} error={errors?.[name]?.message}>
            {type === "password" ? (
              <PasswordInput
                classNames={{
                  input: errors[name] ? "border-red-500" : ""
                }}
                value={value}
                defaultValue={defaultValue}
                onChange={onChange}
                placeholder={placeholder}
                {...register(name, rules)}
              />
            ) : (
              <Input
                classNames={{
                  input: errors[name] ? "border-red-500" : ""
                }}
                type={type}
                value={value}
                defaultValue={defaultValue}
                onChange={onChange}
                placeholder={placeholder}
                {...register(name, rules)}
              />
            )}
          </Input.Wrapper>
        </Grid.Col>
      </Grid>
    </React.Fragment>
  )
}
