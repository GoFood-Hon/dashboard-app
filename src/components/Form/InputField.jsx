import React, { useState } from "react";
import { Grid, Input } from "@mantine/core";
import { IconEye, IconEyeOff } from "@tabler/icons-react";

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
  countryPrefix
}) {
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  return (
    <React.Fragment>
      <Grid grow>
        <Grid.Col>
          <Input.Wrapper label={label} error={errors?.[name]?.message}>
            <Input
              classNames={{
                input: errors[name] ? "border-red-500" : ""
              }}
              type={type === "password" ? (showPassword ? "text" : "password") : type}
              value={value}
              onChange={onChange}
              placeholder={placeholder}
              {...register(name, rules)}
              rightSection={
                type === "password" && (
                  <div onClick={togglePasswordVisibility} style={{ cursor: "pointer" }}>
                    {showPassword ? (
                      <IconEyeOff size={20} />
                    ) : (
                      <IconEye size={20} />
                    )}
                  </div>
                )
              }
              style={{ flex: 1 }}
            />
          </Input.Wrapper>
        </Grid.Col>
      </Grid>
    </React.Fragment>
  );
}
