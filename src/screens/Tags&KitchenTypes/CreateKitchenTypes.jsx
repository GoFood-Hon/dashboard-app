import { Badge, Button, CloseButton, Flex, Grid, Group, Input, Paper, Text, Space } from "@mantine/core"
import React, { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { colors } from "../../theme/colors"
import { createKitchenType, fetchAllKitchenTypes, deleteKitchenType } from "../../store/features/kitchenAndTagsSlice" // Importa deleteKitchenType
import { IconX } from "@tabler/icons-react"

export const CreateKitchenTypes = () => {
  const dispatch = useDispatch()
  const [value, setValue] = useState("")

  // Obtener tipos de cocina desde el estado
  const kitchenTypes = useSelector((state) => state.kitchenAndTags.kitchenTypes)
  const loading = useSelector((state) => state.kitchenAndTags.loading)

  // Ejecutar el fetch para obtener todos los tipos de cocina cuando se monta el componente
  useEffect(() => {
    dispatch(fetchAllKitchenTypes())
  }, [dispatch])

  // Manejar la creación del nuevo tipo de cocina
  const handleCreateKitchenType = () => {
    if (value.trim() !== "") {
      dispatch(createKitchenType({ name: value })).then(() => {
        setValue("") // Limpiar el input después de crear el tipo de cocina
      })
    }
  }

  // Manejar la eliminación del tipo de cocina
  const handleDeleteKitchenType = (id) => {
    dispatch(deleteKitchenType(id)) // Llamar al thunk para eliminar
  }

  return (
    <Paper>
      <Grid>
        <Grid.Col span={12}>
          <Flex align="flex-start" style={{ width: "100%" }}>
            <Input
              placeholder="Ingresa el tipo de cocina"
              value={value}
              onChange={(event) => setValue(event.currentTarget.value)}
              rightSectionPointerEvents="all"
              rightSection={
                <CloseButton
                  aria-label="Clear input"
                  onClick={() => setValue("")}
                  style={{ display: value ? undefined : "none" }}
                />
              }
              style={{ flex: 1 }} // Para que el Input ocupe el espacio restante
            />
            <Button
              color={colors.main_app_color}
              onClick={handleCreateKitchenType}
              style={{ marginLeft: "8px" }} // Espacio entre el input y el botón
            >
              Crear
            </Button>
          </Flex>
        </Grid.Col>
      </Grid>

      <Space h={20} />

      <Paper withBorder radius="md" p="xs">
        <Group grow>
          <Flex
            direction="row"
            wrap="wrap" // Permitir que los elementos se envuelvan
            gap="sm" // Espacio entre los badges (ajústalo como necesites)
            justify={kitchenTypes && kitchenTypes.length > 0 ? "flex-start" : "center"} // Alinear a la izquierda si hay tipos de cocina, centrar si no
            align="center" // Centrar verticalmente
          >
            {kitchenTypes && kitchenTypes.length > 0 ? (
              kitchenTypes.map((type) => (
                <Badge
                  key={type?.id}
                  color={colors.main_app_color}
                  size="lg"
                  variant="default"
                  rightSection={
                    <IconX
                      className="cursor-pointer"
                      color={colors.main_app_color}
                      size="1.1rem"
                      onClick={() => handleDeleteKitchenType(type.id)} // Llamar al manejador de eliminación
                    />
                  }>
                  {type?.name}
                </Badge>
              ))
            ) : (
              <Text color="dimmed" align="center">
                Los tipos de cocina creados se mostrarán aquí
              </Text>
            )}
          </Flex>
        </Group>
      </Paper>
    </Paper>
  )
}
