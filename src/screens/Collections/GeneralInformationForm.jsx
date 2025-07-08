import { useEffect } from "react"
import { Grid, Paper, Select } from "@mantine/core"
import InputField from "../../components/Form/InputField"
import InputTextAreaField from "../../components/Form/InputTextAreaField"
import { useDispatch } from "react-redux"
import { setCollectionType } from "../../store/features/collectionsSlice"
import { useSelector } from "react-redux"
import { ImageDropzone } from "../../components/ImageDropzone"

export default function GeneralInformationForm({ register, errors, setValue, image, edit, watch }) {
  const collectionType = useSelector((state) => state.collections.collectionType)
  const dispatch = useDispatch()

  const handleDrop = (acceptedFiles) => {
    if (acceptedFiles.length > 0) {
      setValue("files", acceptedFiles)
    }
  }

  useEffect(() => {
    setValue("type", "dishes")
  }, [])

  const handleCollectionType = (value) => {
    setValue("type", value === "Productos" ? "dishes" : "restaurants")
    dispatch(setCollectionType(value === "Productos" ? "dishes" : "restaurants"))
  }

  return (
    <Grid>
      <Grid.Col span={{ base: 12, md: 8, lg: 8 }}>
        <Paper withBorder radius="md" p="xs">
          <Grid gutter="md">
            <Grid.Col span={{ base: 12 }}>
              <InputField label="Nombre (Obligatorio)" name="name" register={register} errors={errors} />
            </Grid.Col>
            <Grid.Col span={{ base: 12 }}>
              <InputTextAreaField label="Descripción (Obligatorio)" name="description" register={register} errors={errors} />
            </Grid.Col>
            <Grid.Col span={{ base: 12 }}>
              <Select
                disabled={edit}
                name="type"
                label="Contenido de la colección"
                data={["Comercios", "Productos"]}
                defaultValue={"Productos"}
                value={collectionType === "dishes" ? "Productos" : "Comercios"}
                allowDeselect={false}
                maxDropdownHeight={200}
                onChange={handleCollectionType}
                classNames={{
                  input: "focus:border-gray-600"
                }}
              />
            </Grid.Col>
          </Grid>
        </Paper>
      </Grid.Col>
      <Grid.Col order={{ base: 1, sm: 1, md: 2 }} span={{ base: 12, md: 4, lg: 4 }}>
        <ImageDropzone
          image={image}
          images={watch("files")}
          onDrop={handleDrop}
          error={errors?.files?.message}
          title="de la colección"
        />
      </Grid.Col>
    </Grid>
  )
}
