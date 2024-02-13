import React, { useEffect, useState, useRef } from "react"
import { Grid } from "@mantine/core"
import Map, { Source, Layer, Marker } from "react-map-gl"

import InputSearchCombobox from "../../components/Form/InputSearchCombobox"

import InputField from "../../components/Form/InputField"
import { hondurasDepartments, mapBoxStyles } from "../../utils/constants"
import { MAPBOX_KEY } from "../../services/env"

export default function LocationForm({ register, errors, setValue, itemDetails }) {
  const [marker, setMarker] = useState({
    longitude: itemDetails?.geolocation?.coordinates?.[0] ?? -88.025,
    latitude: itemDetails?.geolocation?.coordinates?.[1] ?? 15.50417
  })

  const [viewState, setViewState] = useState({
    longitude: itemDetails?.geolocation?.coordinates?.[0] ?? -88.025,
    latitude: itemDetails?.geolocation?.coordinates?.[1] ?? 15.50417,
    zoom: 12.2
  })

  const onDrag = (evt) => {
    const { lng, lat } = evt.lngLat
    setMarker({
      longitude: lng,
      latitude: lat
    })
    setValue("geolocation", [lng, lat])
  }

  const resetLocation = () => {
    setViewState({
      longitude: -88.025,
      latitude: 15.50417,
      zoom: 12.2
    })
  }

  return (
    <Grid>
      <Grid.Col span={{ base: 12 }}>
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
            <InputSearchCombobox
              label="Departamento (Obligatorio)"
              name={"state"}
              placeholder="Buscar departamento"
              items={hondurasDepartments}
              register={register}
              errors={errors}
              setValue={setValue}
            />
            <InputField label="Ciudad" name="city" register={register} errors={errors} className="text-black" />
            <div className="min-h-[25rem] flex flex-col w-full h-full bg-white rounded-2xl border border-blue-100 p-4">
              <label className="text-sky-950 text-sm font-bold leading-snug pb-4">Ubicación en mapa (Obligatorio)</label>
              <label className="text-gray-500 text-sm font-bold leading-snug pb-4">(Mueva el pin a la dirección exacta)</label>
              <label onClick={resetLocation} className="text-sky-950 text-sm font-bold leading-snug pb-4 cursor-pointer w-fit">
                Reiniciar vista
              </label>
              <Map
                {...viewState}
                onMove={(evt) => setViewState(evt.viewState)}
                mapboxAccessToken={MAPBOX_KEY}
                style={{ borderRadius: "1rem", width: "auto", height: "30rem", borderWidth: "2px" }}
                mapStyle={mapBoxStyles}>
                <Marker draggable onDrag={onDrag} longitude={marker.longitude} latitude={marker.latitude} anchor="bottom" />
              </Map>
            </div>
          </div>
        </div>
      </Grid.Col>
    </Grid>
  )
}
