import { Paper, Flex, Text, Image } from "@mantine/core"
import { Dropzone, IMAGE_MIME_TYPE } from "@mantine/dropzone"
import { IconPhoto } from "@tabler/icons-react"
import { rem } from "@mantine/core"
import { useState, useEffect, useMemo } from "react"

export function ImageDropzone({ image, onDrop, images, error, title }) {
  const [previews, setPreviews] = useState([])

  const normalizedFiles = useMemo(() => {
    if (!images) return []
    if (images instanceof FileList) return Array.from(images)
    if (Array.isArray(images)) {
      return images.filter((item) => item instanceof File)
    }
    return []
  }, [images])

  useEffect(() => {
    if (normalizedFiles.length === 0) {
      setPreviews([])
      return
    }

    const urls = normalizedFiles.map((file) => URL.createObjectURL(file))
    setPreviews(urls)

    return () => urls.forEach((url) => URL.revokeObjectURL(url))
  }, [normalizedFiles])

  const hasPreviews = previews.length > 0
  const showFallbackImage = !hasPreviews && !!image

  return (
    <Paper withBorder radius="md" h="100%">
      <Flex align="center" h="100%" justify="center">
        <Dropzone onDrop={onDrop} accept={IMAGE_MIME_TYPE} h={220} style={{ cursor: "pointer" }}>
          <Flex direction="column" justify="center" align="center" h={220}>
            {hasPreviews ? (
              previews.map((src, i) => <Image key={i} radius="md" h="100%" maw="100%" fit="contain" src={src} />)
            ) : showFallbackImage ? (
              <Image radius="md" h="100%" maw="100%" fit="contain" src={image} />
            ) : (
              <>
                <IconPhoto
                  style={{
                    width: rem(40),
                    height: rem(40),
                    color: "var(--mantine-color-dimmed)"
                  }}
                  stroke={1.5}
                />
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
          </Flex>
        </Dropzone>
      </Flex>
    </Paper>
  )
}
