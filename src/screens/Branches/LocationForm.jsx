import { CloseIcon, Grid, Group, Text, rem } from "@mantine/core"
import InputField from "../../components/Form/InputField"
import InputTextAreaField from "../../components/Form/InputTextAreaField"
import { IconPhoto } from "@tabler/icons-react"
import { Dropzone, IMAGE_MIME_TYPE } from "@mantine/dropzone"
import React, { useEffect, useState } from "react"
import toast from "react-hot-toast"
import { bytesToMB } from "../../utils"
import InputSearchCombobox from "../../components/Form/InputSearchCombobox"
import { departments } from "../../utils/hondurasDepartments"

export default function LocationForm({ register, errors, setValue, isDataCleared }) {
  const [images, setImages] = useState([])
  const [fileInformation, setFileInformation] = useState(null)
  const [selectedDepartment, setSelectedDepartment] = useState(null)
  const [cities, setCities] = useState([])

  const getCitiesByDepartment = async (departmentId) => {}

  useEffect(() => {
    if (selectedDepartment) {
      getCitiesByDepartment(selectedDepartment.id)
    }
  }, [selectedDepartment])

  const handleDrop = (acceptedFiles) => {
    if (acceptedFiles.length > 0) {
      const [file] = acceptedFiles
      setFileInformation(file)
      setImages(acceptedFiles)
      setValue("files", acceptedFiles)
      toast.success("Archivos aceptados 👍", { duration: 7000 })
    }
  }

  const deleteImage = () => {
    setFileInformation(null)
    setImages([])
  }

  useEffect(() => {
    if (isDataCleared) {
      deleteImage()
    }
  }, [isDataCleared])

  const previews = images.map((file, index) => {
    const imageUrl = URL.createObjectURL(file)
    return (
      <img
        key={index}
        src={imageUrl}
        onLoad={() => URL.revokeObjectURL(imageUrl)}
        className="h-14 w-14 rounded-xl object-cover object-center border m-1"
      />
    )
  })

  return (
    <Grid>
      <Grid.Col span={{ base: 12, md: 8, lg: 8 }}>
        <div className="w-full h-full items-center justify-center flex bg-white rounded-2xl border border-blue-100 p-4">
          <div className="flex flex-col w-full">
            <InputField
              label="Dirección exacta (Obligatorio)"
              name="address"
              register={register}
              errors={errors}
              placeholder="Ej. 10 Calle, a la par de establecimiento"
              className="text-black"
            />
            <InputField
              label="Código postal (Opcional)"
              name="zipCode"
              register={register}
              errors={errors}
              placeholder="Ej. 21102"
              className="text-black"
            />

            <InputSearchCombobox
              label="Departamento (Obligatorio)"
              name={"department"}
              placeholder="Buscar departamento"
              items={departments}
              register={register}
              errors={errors}
              setValue={setValue}
            />

            <InputSearchCombobox
              label="Ciudad (Obligatorio)"
              name={"city"}
              placeholder="Buscar ciudades"
              items={departments}
              register={register}
              errors={errors}
              setValue={setValue}
            />

            <InputTextAreaField label="Nota" name="note" register={register} errors={errors} />
          </div>
        </div>
      </Grid.Col>
      <Grid.Col span={{ base: 12, md: 4, lg: 4 }}>
        <div className="flex flex-col justify-center items-center w-full h-full bg-white rounded-2xl border border-blue-100 p-4">
          <label className="text-sky-950 text-sm font-bold leading-snug">Ubicación en mapa (Obligatorio)</label>
        </div>
      </Grid.Col>
    </Grid>
  )
}
