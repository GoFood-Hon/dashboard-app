import { Button, CloseButton, Flex, Grid, Group, Input, Paper, Text, Space, Modal, Pill } from "@mantine/core"
import React, { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { colors } from "../../theme/colors"
import { createDishesTag, fetchAllDishesTags, deleteDishesTag } from "../../store/features/kitchenAndTagsSlice"
import { useDisclosure } from "@mantine/hooks"
import classes from "./ActionsGrid.module.css"

export const CreateTags = () => {
  const dispatch = useDispatch()
  const [value, setValue] = useState("")
  const tags = useSelector((state) => state.kitchenAndTags.dishTags)
  const [opened, { close, open }] = useDisclosure(false)
  const [tagId, setTagId] = useState(0)

  useEffect(() => {
    dispatch(fetchAllDishesTags())
  }, [dispatch])

  const handleCreateTag = () => {
    if (value.trim() !== "") {
      dispatch(createDishesTag({ name: value })).then(() => {
        setValue("")
      })
    }
  }

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
              style={{ flex: 1 }}
            />
            <Button color={colors.main_app_color} onClick={handleCreateTag} style={{ marginLeft: "8px" }}>
              Crear
            </Button>
          </Flex>
        </Grid.Col>
      </Grid>

      <Space h={20} />

      <Group grow>
        <Flex direction="row" wrap="wrap" gap="sm" justify={tags && tags.length > 0 ? "flex-start" : "center"} align="center">
          {tags && tags.length > 0 ? (
            tags.map((tag) => (
              <Pill
                className={classes.tag}
                size="md"
                onRemove={() => {
                  setTagId(tag.id)
                  open()
                }}
                key={tag.id}
                withRemoveButton>
                {tag?.name}
              </Pill>
            ))
          ) : (
            <Text color="dimmed" size="sm" align="center">
              Los tags creados se mostrarán aquí
            </Text>
          )}
        </Flex>
      </Group>

      <Modal
        opened={opened}
        radius='md'
        onClose={close}
        withCloseButton={false}
        closeOnEscape
        size="md"
        overlayProps={{
          backgroundOpacity: 0.55,
          blur: 3
        }}
        title="¿Estás seguro que deseas eliminar?">
        <Text size="md">El tag se quitará de todos los platillos a los que esté asociado</Text>

        <Group mt="sm" justify="end">
          <Button color={colors.main_app_color} variant="outline" onClick={close}>
            Cancelar
          </Button>
          <Button
            color={colors.main_app_color}
            onClick={() => {
              handleDeleteTag(tagId)
              close()
            }}>
            Confirmar
          </Button>
        </Group>
      </Modal>
      
    </Paper>
  )
}
