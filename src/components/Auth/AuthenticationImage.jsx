import { Button, Paper, PasswordInput, TextInput, Title } from "@mantine/core"
import classes from "./AuthenticationImage.module.css"
import { colors } from "../../theme/colors"

export function AuthenticationImage() {
  return (
    <div className={classes.wrapper}>
      {/* Imagen en la izquierda */}
      <div className={classes.imageSection}></div>

      {/* Formulario en la derecha */}
      <Paper className={classes.form} radius={0} p={30}>
        <Title order={2} className={classes.title} ta="center" mt="md" mb={50}>
          ¡Bienvenido de vuelta!
        </Title>
        <TextInput radius="md" label="Correo" />
        <PasswordInput radius="md" label="Contraseña" mt="md" />
        <Button color={colors.main_app_color} radius="md" fullWidth mt="xl">
          Iniciar
        </Button>
      </Paper>
    </div>
  )
}
