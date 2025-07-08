import { Box, Input, PasswordInput, Popover, Progress, Text, TextInput } from "@mantine/core"
import { IconX, IconCheck } from "@tabler/icons-react"
import { useState } from "react"

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
  required,
  visible,
  onToggleVisibility,
  newPassword,
  watch
}) {
  const [popoverOpened, setPopoverOpened] = useState(false)

  const requirements = [
    { re: /[0-9]/, label: "Incluye al menos 1 número" },
    { re: /[a-z]/, label: "Incluye letras minúsculas" },
    { re: /[A-Z]/, label: "Incluye letras mayúsculas" },
    { re: /[$&+,:;=?@#|'<>.^*()%!-]/, label: "Incluye al menos 1 carácter especial" }
  ]

  const passwordValue = value ?? (watch ? watch(name) : "") ?? ""

  function getStrength(password) {
    if (!password || password.length === 0) return 0

    let multiplier = password.length > 5 ? 0 : 1
    requirements.forEach((r) => {
      if (!r.re.test(password)) multiplier += 1
    })

    return 100 - (100 / (requirements.length + 1)) * multiplier
  }

  function PasswordRequirement({ meets, label }) {
    return (
      <Text c={meets ? "teal" : "red"} style={{ display: "flex", alignItems: "center" }} mt={7} size="sm">
        {meets ? <IconCheck size={14} /> : <IconX size={14} />}
        <Box ml={10}>{label}</Box>
      </Text>
    )
  }

  function getErrorMessage(errors, name) {
    if (!errors) return undefined
    const parts = name.split(".")
    let current = errors
    for (const part of parts) {
      current = current?.[part]
      if (!current) return undefined
    }
    return current?.message
  }

  const strength = getStrength(passwordValue)
  const color = strength === 100 ? "teal" : strength > 50 ? "yellow" : "red"
  const checks = requirements.map((r, i) => <PasswordRequirement key={i} label={r.label} meets={r.re.test(passwordValue)} />)

  const commonProps = {
    placeholder,
    visible,
    onVisibilityChange: onToggleVisibility,
    required,
    classNames: {
      input: getErrorMessage(errors, name) ? "border-red-500" : "focus:border-gray-600"
    }
  }

  const inputProps = register(name, rules)

  const finalValueProps = {
    ...(value !== undefined && onChange ? { value, onChange } : { ...inputProps })
  }

  return (
    <>
      {type === "password" && newPassword ? (
        <Input.Wrapper label={label} error={getErrorMessage(errors, name)} styles={{ error: { marginTop: 6 } }}>
          <Popover opened={popoverOpened} position="bottom" width="target" transitionProps={{ transition: "pop" }}>
            <Popover.Target>
              <div onFocusCapture={() => setPopoverOpened(true)} onBlurCapture={() => setPopoverOpened(false)}>
                <PasswordInput {...commonProps} {...finalValueProps} />
              </div>
            </Popover.Target>
            <Popover.Dropdown>
              <Progress color={color} value={strength} size={5} mb="xs" />
              <PasswordRequirement label="Incluye al menos 6 caracteres" meets={passwordValue.length > 5} />
              {checks}
            </Popover.Dropdown>
          </Popover>
        </Input.Wrapper>
      ) : (
        <Input.Wrapper
          label={label}
          error={getErrorMessage(errors, name)}
          styles={{
            error: {
              marginTop: 6 
            }
          }}>
          {type === "password" ? (
            <PasswordInput {...commonProps} {...finalValueProps} />
          ) : (
            <TextInput type={type} disabled={disabled} withAsterisk {...commonProps} {...finalValueProps} />
          )}
        </Input.Wrapper>
      )}
    </>
  )
}
