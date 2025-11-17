import React from "react"
import { useRouteError, isRouteErrorResponse } from "react-router-dom"
import { Container, Title, Text, Button, Group, Stack } from "@mantine/core"
import { colors } from "../theme/colors"

export function AppErrorBoundary({ error: propError }) {
  const routeError = useRouteError?.() || null
  const error = propError || routeError

  let title = "Ha ocurrido un error inesperado"
  let message = "Ocurrió un problema al cargar esta sección."

  // Si viene un error de router (404, 500, etc.)
  if (error && isRouteErrorResponse?.(error)) {
    if (error.status === 404) {
      title = "Página no encontrada"
      message = "La sección solicitada no existe o fue movida."
    } else if (error.status === 500) {
      title = "Error del servidor"
      message = "Hubo un error interno. Intenta nuevamente más tarde."
    } else {
      message = error.statusText || message
    }
  }

  // Si es una excepción normal
  else if (error instanceof Error) {
    message = error.message || message
  }

  // Si no hay error (fallback)
  else if (!error) {
    message = "Ocurrió un error desconocido."
  }

  return (
    <Container className="h-[calc(100vh-220px)] w-full flex align-center justify-center flex-col">
      <Stack>
        <Title order={2} ta="center">
          {title}
        </Title>
        <Text c="dimmed" size="md" ta="center">
          {message}
        </Text>
        <Group justify="center">
          <Button color={colors.main_app_color} onClick={() => window.location.reload()}>
            Recargar página
          </Button>
        </Group>
      </Stack>
    </Container>
  )
}
