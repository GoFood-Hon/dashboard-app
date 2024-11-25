import {
  Anchor,
  Button,
  Checkbox,
  Container,
  Group,
  Paper,
  PasswordInput,
  Text,
  TextInput,
  Title,
} from '@mantine/core';
import classes from './AuthenticationImage.module.css';
import { colors } from '../../theme/colors';

export function AuthenticationImage() {
  return (
    <Container size={550} h='100%'>
      <Title ta="center" className={classes.title}>
        Bienvenido de vuelta
      </Title>
      <Text c="dimmed" size="sm" ta="center" mt={5}>
        Do not have an account yet?{" "}
        <Anchor size="sm" component="button">
          Create account
        </Anchor>
      </Text>
      <Paper withBorder shadow="md" p={30} mt={30} radius="md">
        <TextInput radius='md' label="Email" required />
        <PasswordInput radius='md' label="Password" required mt="md" />
        <Group justify="space-between" mt="lg">
          <Checkbox label="Recuérdame" />
          <Anchor component="button" size="sm">
            ¿Olvidaste tu contraseña?
          </Anchor>
        </Group>
        <Button radius='md' fullWidth color={colors.main_app_color} mt="xl">
          Iniciar sesión
        </Button>
      </Paper>
    </Container>
  )
}
