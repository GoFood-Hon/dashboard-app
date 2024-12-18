import { Accordion, Button, Flex, Group, Stack, Paper, ThemeIcon, Text, Space } from "@mantine/core"
import React from "react"
import BackButton from "../../screens/Dishes/components/BackButton"
import { colors } from "../../theme/colors"

const FormLayout = ({
  title,
  show,
  accordionStructure,
  accordionTitles,
  accordionItems,
  update,
  navigate,
  isLoading,
  noDiscard,
  noButtons,
  statusButton
}) => {
  const items = accordionStructure.map((item, key) => (
    <Accordion.Item key={key} value={item.title}>
      <Accordion.Control>
        <Flex align="center" gap="xs">
          <ThemeIcon radius="xl" p="md" bg={colors.main_app_color}>
            <Text fw={700}>{key + 1}</Text>
          </ThemeIcon>
          <Flex>
            <Text fw={700}>{item.title} <Text span>({item?.requirement})</Text></Text>
          </Flex>
        </Flex>
      </Accordion.Control>
      <Accordion.Panel>{item.form}</Accordion.Panel>
    </Accordion.Item>
  ))

  return (
    <>
      <Group grow mb="xs">
        <Flex align="center" justify="space-between">
          <BackButton title={title} show={show} />
          <Button
            style={{ display: statusButton ? "block" : "none" }}
            color={colors.main_app_color}
            onClick={() => {
              navigate()
            }}>
            Habilitar
          </Button>
        </Flex>
      </Group>
      <Stack>
        <Accordion variant="separated" multiple radius="md" defaultValue={accordionTitles}>
          {items}
        </Accordion>
        <Paper style={{ display: noButtons ? "none" : "block" }} withBorder radius="md" p="lg">
          <Flex justify="end" gap="xs">
            <Button
              style={{ display: noDiscard ? "none" : "block" }}
              color={colors.main_app_color}
              variant="outline"
              onClick={() => {
                navigate()
              }}>
              Descartar
            </Button>
            <Button loading={isLoading} color={colors.main_app_color} type="submit">
              {update ? "Actualizar" : "Guardar"}
            </Button>
          </Flex>
        </Paper>
      </Stack>
    </>
  )
}

export default FormLayout
