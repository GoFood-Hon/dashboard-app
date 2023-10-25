import { Grid, Group, Text } from "@mantine/core"
import { Dropzone } from "@mantine/dropzone"
import { IconPhoto, IconUpload, IconX } from "@tabler/icons-react"
import React from "react"
import InputTextAreaField from "./Form/InputTextAreaField"
import InputField from "./Form/InputField"

export default function GeneralInformation() {
  return (
    <Grid>
      <Grid.Col span={{ base: 12, md: 6, lg: 6 }}>
        <div className="w-full h-full items-center justify-center flex bg-white rounded-2xl border border-blue-100 p-4">
          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col w-full">
            <InputField
              label="Nombre (Obligatorio)"
              name="dishName"
              register={register}
              rules={inputRequired}
              errors={errors}
              placeholder="Ej. Pollo con papas"
              className="text-black"
            />
            <InputTextAreaField
              label="Descripción (Obligatorio)"
              name="dishDescription"
              rules={inputRequired}
              register={register}
              errors={errors}
              placeholder="Ej. Rico pollo con papas, salsas..."
            />
          </form>
        </div>
      </Grid.Col>
      <Grid.Col span={{ base: 12, md: 6, lg: 6 }}>
        <div className="w-full h-full bg-white rounded-2xl border border-blue-100 p-4">
          <Dropzone
            onDrop={(files) => console.log("accepted files", files)}
            onReject={(files) => console.log("rejected files", files)}
            accept={IMAGE_MIME_TYPE}>
            <Group justify="center" gap="xl" mih={220} style={{ pointerEvents: "none" }}>
              <Dropzone.Accept>
                <IconUpload style={{ width: rem(52), height: rem(52), color: "var(--mantine-color-blue-6)" }} stroke={1.5} />
              </Dropzone.Accept>
              <Dropzone.Reject>
                <IconX style={{ width: rem(52), height: rem(52), color: "var(--mantine-color-red-6)" }} stroke={1.5} />
              </Dropzone.Reject>
              <Dropzone.Idle>
                <IconPhoto style={{ width: rem(52), height: rem(52), color: "var(--mantine-color-dimmed)" }} stroke={1.5} />
              </Dropzone.Idle>

              <div className="flex items-center flex-col">
                <Text size="xl" inline>
                  Seleccione una imagen destacada
                </Text>
                <Text size="sm" c="dimmed" inline mt={7} className="text-center">
                  Haga click o arrastre una imagen que sera usada junto con el platillo
                </Text>
              </div>
            </Group>
          </Dropzone>
        </div>
      </Grid.Col>
    </Grid>
  )
}
