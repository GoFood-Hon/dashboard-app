import { CloseIcon, Grid, Group, Text, rem } from "@mantine/core"
import { Dropzone, IMAGE_MIME_TYPE } from "@mantine/dropzone"
import { IconPhoto } from "@tabler/icons-react"
import React, { useState } from "react"
import InputTextAreaField from "../../components/Form/InputTextAreaField"
import InputField from "../../components/Form/InputField"
import toast from "react-hot-toast"

export default function GeneralInformationForm({ register, errors, setValue, control }) {
  const [uploadedImage, setUploadedImage] = useState(null)
  const [fileInformation, setFileInformation] = useState(null)

  function bytesToMB(bytes) {
    const megabytes = bytes / (1024 * 1024)
    return megabytes.toFixed(2)
  }

  const handleDrop = (acceptedFiles) => {
    if (acceptedFiles.length > 0) {
      const file = acceptedFiles[0]
      setFileInformation(acceptedFiles[0])
      setUploadedImage(URL.createObjectURL(file))
      toast.success("Accepted files", acceptedFiles)

      setValue("files", acceptedFiles)
    }
  }

  const deleteImage = () => {
    setUploadedImage(null)
    setFileInformation(null)
  }

  return (
    <Grid>
      <Grid.Col span={{ base: 12, md: 8, lg: 8 }}>
        <div className="w-full h-full items-center justify-center flex bg-white rounded-2xl border border-blue-100 p-4">
          <div className="flex flex-col w-full">
            <InputField
              label="Nombre (Obligatorio)"
              name="name"
              register={register}
              errors={errors}
              placeholder="Ej. Pollo con papas"
              className="text-black"
            />

            <InputTextAreaField
              label="Descripción (Obligatorio)"
              name="description"
              register={register}
              errors={errors}
              placeholder="Ej. Rico pollo con papas, salsas..."
            />
          </div>
        </div>
      </Grid.Col>
      <Grid.Col span={{ base: 12, md: 4, lg: 4 }}>
        <div className="w-full h-full bg-white rounded-2xl border border-blue-100 p-4">
          <Dropzone onDrop={handleDrop} accept={IMAGE_MIME_TYPE}>
            <Group justify="center" gap="xl" mih={220} style={{ pointerEvents: "none" }}>
              <div className="flex items-center flex-col">
                {!uploadedImage ? (
                  <>
                    <IconPhoto style={{ width: rem(52), height: rem(52), color: "var(--mantine-color-dimmed)" }} stroke={1.5} />
                    <Text size="xl" inline className="text-center">
                      Seleccione una imagen destacada
                    </Text>
                  </>
                ) : (
                  <div className="flex flex-row justify-end w-full border border-slate-200 mb-6">
                    <div className="flex flex-row w-full items-center gap-2 flex-wrap">
                      <img
                        style={{
                          backgroundImage: `url(${uploadedImage})`,
                          backgroundSize: "cover",
                          width: rem(52),
                          height: rem(52)
                        }}
                      />
                      <div className="flex flex-col">
                        <Text className="font-semibold italic">{fileInformation.name}</Text>
                        <Text className="font-semibold" size="sm" c="dimmed" inline>
                          {bytesToMB(fileInformation.size)} MB
                        </Text>
                      </div>
                    </div>

                    <button onClick={deleteImage} className="pr-3">
                      <CloseIcon size={24} />
                    </button>
                  </div>
                )}
                <Text size="sm" c="dimmed" inline mt={7} className="text-center">
                  Haga click o arrastre una imagen que sera usada junto con el platillo
                </Text>
              </div>
            </Group>
          </Dropzone>

          {errors.files && <p className="text-red-500 text-center w-full">* Imagen es requerida.</p>}
        </div>
      </Grid.Col>
    </Grid>
  )
}
