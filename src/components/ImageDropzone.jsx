import { Paper, Flex, Text, Image } from "@mantine/core"
import { Dropzone, IMAGE_MIME_TYPE } from "@mantine/dropzone"
import { IconPhoto } from "@tabler/icons-react"
import { rem } from "@mantine/core"
import { useState, useEffect } from "react"

export function ImageDropzone({ image, onDrop, images = [], error, title }) {
  const [previews, setPreviews] = useState([])

  useEffect(() => {
    if (images?.length > 0) {
      const imagePreviews = images.map((file) => URL.createObjectURL(file))
      setPreviews(imagePreviews)

      return () => imagePreviews.forEach((url) => URL.revokeObjectURL(url))
    }
  }, [images])

  return (
    <Paper withBorder radius="md" h="100%">
      <Flex align="center" h="100%" justify="center">
        <Dropzone onDrop={onDrop} accept={IMAGE_MIME_TYPE} h={220} style={{ cursor: "pointer" }}>
          <Flex direction="column" justify="center" align="center" h={220}>
            {previews.length > 0 ? (
              previews.map((src, i) => <Image key={i} radius="md" h="100%" maw="100%" fit="contain" src={src} />)
            ) : (
              <>
                {image && <Image radius="md" h="100%" maw="100%" fit="contain" src={image} />}
                {!image && (
                  <>
                    <IconPhoto style={{ width: rem(40), height: rem(40), color: "var(--mantine-color-dimmed)" }} stroke={1.5} />
                    <Text size="lg" ta="center">
                      Seleccione una imagen
                    </Text>
                    <Text size="sm" c="dimmed" ta="center" mt={3}>
                      Haga clic o arrastre la imagen {title}
                    </Text>
                    {error && (
                      <Text c="var(--mantine-color-error)" ta="center" size="xs" style={{ marginTop: 4, marginLeft: 4 }}>
                        {error}
                      </Text>
                    )}
                  </>
                )}
              </>
            )}
          </Flex>
        </Dropzone>
      </Flex>
    </Paper>
  )
}
