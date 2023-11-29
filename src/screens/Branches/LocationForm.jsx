/* eslint-disable import/no-webpack-loader-syntax */
import { CloseIcon, Grid, Group, Text, rem } from "@mantine/core"
import InputField from "../../components/Form/InputField"
import InputTextAreaField from "../../components/Form/InputTextAreaField"
import { IconPhoto } from "@tabler/icons-react"
import { Dropzone, IMAGE_MIME_TYPE } from "@mantine/dropzone"
import React, { useEffect, useState, useRef } from "react"
import toast from "react-hot-toast"
import { bytesToMB } from "../../utils"
import InputSearchCombobox from "../../components/Form/InputSearchCombobox"
import { departments } from "../../utils/hondurasDepartments"
import mapboxgl from "mapbox-gl"

mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_KEY

export default function LocationForm({ register, errors, setValue }) {
  const [selectedDepartment, setSelectedDepartment] = useState(null)
  const [cities, setCities] = useState([])

  const mapContainer = useRef(null)
  const map = useRef(null)
  const [lng, setLng] = useState(-88.025)
  const [lat, setLat] = useState(15.50417)
  const [zoom, setZoom] = useState(12.2)

  const getCitiesByDepartment = async (departmentId) => {}

  useEffect(() => {
    if (map.current) return
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/onetouchstudio/clopr8g1x00il01nz2nw7045t",
      center: [lng, lat],
      zoom
    })
  })

  useEffect(() => {
    if (selectedDepartment) {
      getCitiesByDepartment(selectedDepartment.id)
    }
  }, [selectedDepartment])

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
          <label className="text-sky-950 text-sm font-bold leading-snug pb-4">Ubicación en mapa (Obligatorio)</label>
          <div ref={mapContainer} className="h-full w-full rounded-2xl" />
        </div>
      </Grid.Col>
    </Grid>
  )
}
