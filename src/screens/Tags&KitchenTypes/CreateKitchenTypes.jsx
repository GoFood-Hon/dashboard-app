import {
  Button,
  CloseButton,
  Flex,
  Grid,
  Group,
  Input,
  Paper,
  Text,
  Space,
  Modal,
  SimpleGrid,
  UnstyledButton
} from "@mantine/core"
import React, { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { colors } from "../../theme/colors"
import { createKitchenType, fetchAllKitchenTypes, deleteKitchenType } from "../../store/features/kitchenAndTagsSlice"
import { useDisclosure } from "@mantine/hooks"
import classes from "./ActionsGrid.module.css"
import { IconToolsKitchen2 } from "@tabler/icons-react"

export const CreateKitchenTypes = () => {
  const dispatch = useDispatch()
  const [value, setValue] = useState("")
  const [opened, { close, open }] = useDisclosure(false)
  const kitchenTypes = useSelector((state) => state.kitchenAndTags.kitchenTypes)
  const [kitchenId, setKitchenId] = useState(0)

  useEffect(() => {
    dispatch(fetchAllKitchenTypes())
  }, [dispatch])

  const handleCreateKitchenType = () => {
    if (value.trim() !== "") {
      dispatch(createKitchenType({ name: value })).then(() => {
        setValue("")
      })
    }
  }

  const handleDeleteKitchenType = (id) => {
    dispatch(deleteKitchenType(id))
  }

  return (
    <Paper>
      <Grid>
        <Grid.Col span={12}>
          <Flex align="flex-start" style={{ width: "100%" }}>
            <Input
              placeholder="Ingresa el nombre de la especialidad"
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
            <Button color={colors.main_app_color} onClick={handleCreateKitchenType} style={{ marginLeft: "8px" }}>
              Crear
            </Button>
          </Flex>
        </Grid.Col>
      </Grid>
      <Space h={20} />
      {kitchenTypes && kitchenTypes.length > 0 ? (
        <SimpleGrid cols={{ base: 2, sm: 3, md: 4, lg: 5 }}>
          {kitchenTypes.map((type) => (
            <Paper radius="md" withBorder key={type.id} className={classes.item} style={{ position: "relative" }}>
              <CloseButton
                onClick={() => {
                  setKitchenId(type.id)
                  open()
                }}
                style={{ position: "absolute", top: "5px", right: "5px" }}
              />
              <Flex direction="column" align="center">
                <IconToolsKitchen2 size="2rem" />
                <Text size="sm" tt="capitalize" mt={7}>
                  {type.name}
                </Text>
              </Flex>
            </Paper>
          ))}
        </SimpleGrid>
      ) : (
        <Text c="dimmed" ta="center" size="sm">
          Los tipos de cocina creados se mostrarán aquí
        </Text>
      )}

      <Modal
        opened={opened}
        onClose={close}
        withCloseButton={false}
        closeOnEscape
        radius="md"
        size="md"
        overlayProps={{
          backgroundOpacity: 0.55,
          blur: 3
        }}
        title="¿Estás seguro que deseas eliminar?">
        <Text>El tipo de cocina se quitará de todos los restaurantes a los que esté asociado</Text>

        <Group mt="sm" justify="end">
          <Button color={colors.main_app_color} variant="outline" onClick={close}>
            Cancelar
          </Button>
          <Button
            color={colors.main_app_color}
            onClick={() => {
              handleDeleteKitchenType(kitchenId)
              close()
            }}>
            Confirmar
          </Button>
        </Group>
      </Modal>
    </Paper>
  )
}
