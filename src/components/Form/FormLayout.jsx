import { Accordion, Button, Flex, Group, Stack, Paper } from "@mantine/core"
import React from "react"
import BackButton from "../../screens/Dishes/components/BackButton"
import { colors } from "../../theme/colors"

const FormLayout = ({ title, show, accordionTitles, accordionItems, update, navigate, isLoading, noDiscard }) => {
  return (
    <>
      <Group grow mb="xs">
        <Flex align="center" justify="space-between">
          <BackButton title={title} show={show} />
        </Flex>
      </Group>
      <Stack>
        <Accordion variant="separated" multiple radius="md" defaultValue={accordionTitles}>
          {accordionItems}
        </Accordion>
        <Paper withBorder radius="md" p="lg">
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
