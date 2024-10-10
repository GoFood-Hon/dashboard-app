import { Badge, Button, CloseButton, Flex, Grid, Group, Input, Paper, Text, Space } from "@mantine/core"
import React, { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { colors } from "../../theme/colors"
import { createDishesTag, fetchAllDishesTags, deleteDishesTag } from "../../store/features/kitchenAndTagsSlice" // Importa deleteDishesTag
import { IconX } from "@tabler/icons-react"

export const CreateTags = () => {
  const dispatch = useDispatch()
  const [value, setValue] = useState("")

  // Obtener tags desde el estado
  const tags = useSelector((state) => state.kitchenAndTags.dishTags)
  const loading = useSelector((state) => state.kitchenAndTags.loading)

  // Ejecutar el fetch para obtener todos los tags cuando se monta el componente
  useEffect(() => {
    dispatch(fetchAllDishesTags())
  }, [dispatch])

  // Manejar la creación del nuevo tag
  const handleCreateTag = () => {
    if (value.trim() !== "") {
      dispatch(createDishesTag({ name: value })).then(() => {
        setValue("") // Limpiar el input después de crear el tag
      })
    }
  }

  // Manejar la eliminación del tag
  const handleDeleteTag = (id) => {
    dispatch(deleteDishesTag(id))
  }

  return (
    <Paper>
      <Grid>
        <Grid.Col span={12}>
          <Flex align="flex-start" style={{ width: "100%" }}>
            <Input
              placeholder="Ingresa el nombre del tag"
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
              onClick={handleCreateTag}
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
            justify={tags && tags.length > 0 ? "flex-start" : "center"} // Alinear a la izquierda si hay tags, centrar si no
            align="center" // Centrar verticalmente
          >
            {tags && tags.length > 0 ? (
              tags.map((tag) => (
                <Badge
                  key={tag?.id}
                  color={colors.main_app_color}
                  size="lg"
                  variant="default"
                  rightSection={
                    <IconX
                      className="cursor-pointer"
                      color={colors.main_app_color}
                      size="1.1rem"
                      onClick={() => handleDeleteTag(tag.id)}
                    />
                  }>
                  {tag?.name}
                </Badge>
              ))
            ) : (
              <Text color="dimmed" align="center">
                Los tags creados se mostrarán aquí
              </Text>
            )}
          </Flex>
        </Group>
      </Paper>
    </Paper>
  )
}
