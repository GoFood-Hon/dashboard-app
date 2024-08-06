import React, { useEffect, useState, useRef } from "react"
import { Grid } from "@mantine/core"
import Map, { GeolocateControl, Marker } from "react-map-gl"
import "mapbox-gl/dist/mapbox-gl.css"
import InputSearchCombobox from "../../components/Form/InputSearchCombobox"
import InputField from "../../components/Form/InputField"
import { hondurasDepartments, mapBoxStyles } from "../../utils/constants"
import { MAPBOX_KEY } from "../../services/env"

export default function LocationForm({ register, errors, setValue, itemDetails }) {
  const [markerPosition, setMarkerPosition] = useState(null)
  const [errorLocalizacion, setErrorLocalizacion] = useState(false)
  const [lng, setLng] = useState(0)
  const [lat, setLat] = useState(0)

  const handleMapClick = (event) => {
    const { lngLat } = event
    setLng(lngLat.lng)
    setLat(lngLat.lat)
    setMarkerPosition({ longitude: lngLat.lng, latitude: lngLat.lat })
    setValue("geolocation", [lngLat.lng, lngLat.lat])
    setErrorLocalizacion(false)
  }

  const handleMapInput = () => {
    setErrorLocalizacion(false)
    setMarkerPosition({ longitude: lng, latitude: lat })
    setValue("geolocation", [lng, lat])
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
              {/* Select direction from map */}
              <div className="flex flex-col gap-2">
                <div className="h-72 relative">
                  <Map
                    initialViewState={{
                      longitude: `${import.meta.env.VITE_MAPBOX_LNG_DEFAULT}`,
                      latitude: `${import.meta.env.VITE_MAPBOX_LAT_DEFAULT}`,
                      zoom: 10
                    }}
                    mapStyle={import.meta.env.VITE_MAPBOX_STYLE_URL}
                    mapboxAccessToken={import.meta.env.VITE_MAPBOX_ACCESS_TOKEN}
                    onClick={handleMapClick}>
                    {markerPosition && <Marker {...markerPosition} longitude={lng} latitude={lat} color="red"/>}
                    <GeolocateControl
                      positionOptions={{ enableHighAccuracy: true }}
                      trackUserLocation={true}
                      onGeolocate={(position) => {
                        setLng(position.coords.longitude)
                        setLat(position.coords.latitude)
                        handleMapInput()
                      }}
                    />
                  </Map>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Grid.Col>
    </Grid>
  )
}
