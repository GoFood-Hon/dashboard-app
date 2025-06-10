import { Button, CloseButton, Flex, Grid, Group, Input, Paper, Text, Space, Pill } from "@mantine/core"
import React, { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { colors } from "../../theme/colors"
import { createDishesTag, fetchAllDishesTags, deleteDishesTag } from "../../store/features/kitchenAndTagsSlice"
import { useDisclosure } from "@mantine/hooks"
import classes from "./ActionsGrid.module.css"
import ConfirmationModal from "../ConfirmationModal"

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
              placeholder="Ingresa el nombre de la categoría"
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
          <Pill.Group>
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
          </Pill.Group>
        </Flex>
      </Group>

      <ConfirmationModal
        opened={opened}
        close={close}
        title="¿Estás seguro que deseas eliminar?"
        description="El tag se quitará de todos los platillos a los que esté asociado"
        onConfirm={() => handleDeleteTag(tagId)}
      />
    </Paper>
  )
}
