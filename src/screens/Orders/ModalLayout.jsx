import { Modal } from "@mantine/core"

const ModalLayout = ({ opened, onClose, children, title, setDriver }) => {
  return (
    <>
      <Modal
        opened={opened}
        onClose={() => {
          onClose()
        }}
        title={title}
        centered
        radius="md">
        {children}
      </Modal>
    </>
  )
}

export default ModalLayout
