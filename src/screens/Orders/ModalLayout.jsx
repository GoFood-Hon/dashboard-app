import { Modal, ScrollArea } from "@mantine/core"

const ModalLayout = ({ opened, onClose, children, title, setDriver }) => {
  return (
    <>
      <Modal
        opened={opened}
        onClose={() => {
          onClose()
        }}
        scrollAreaComponent={ScrollArea.Autosize}
        title={title}
        centered
        radius="md">
        {children}
      </Modal>
    </>
  )
}

export default ModalLayout
