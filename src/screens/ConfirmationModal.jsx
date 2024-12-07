import { Modal, Button, Group, Text } from "@mantine/core"
import { colors } from "../theme/colors"

const ConfirmationModal = ({ opened, close, title, description, onConfirm }) => {
  return (
    <>
      <Modal
        opened={opened}
        radius="md"
        onClose={close}
        withCloseButton={false}
        closeOnEscape
        size="md"
        overlayProps={{
          backgroundOpacity: 0.55,
          blur: 3
        }}
        title={title}>
        <Text size="md">{description}</Text>

        <Group mt="sm" gap='xs' justify="end">
          <Button color={colors.main_app_color} variant="outline" onClick={close}>
            Cancelar
          </Button>
          <Button
            color={colors.main_app_color}
            onClick={() => {
              if (onConfirm) onConfirm()
              close()
            }}>
            Confirmar
          </Button>
        </Group>
      </Modal>
    </>
  )
}

export default ConfirmationModal
