import React from "react"
import { Grid, Input, PasswordInput, TextInput } from "@mantine/core"

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
  defaultValue,
  disabled,
  required
}) {
  return (
    <React.Fragment>
      <Grid grow>
        <Grid.Col>
          <Input.Wrapper label={label} error={errors?.[name]?.message}>
            {type === "password" ? (
              <PasswordInput
                classNames={{
                  input: errors[name] ? "border-red-500" : "focus:border-gray-600"
                }}
                value={value}
                defaultValue={defaultValue}
                onChange={onChange}
                placeholder={placeholder}
                {...register(name, rules)}
              />
            ) : (
              <TextInput
                disabled={disabled}
                classNames={{
                  input: errors[name] ? "border-red-500" : "focus:border-gray-600"
                }}
                type={type}
                value={value}
                defaultValue={defaultValue}
                onChange={onChange}
                placeholder={placeholder}
                {...register(name, rules)}
                required={required}
                withAsterisk
              />
            )}
          </Input.Wrapper>
        </Grid.Col>
      </Grid>
    </React.Fragment>
  )
}
