import React, { useState, useEffect } from "react"
import { Grid, Paper, SimpleGrid, Stack, Text, TextInput, useMantineColorScheme } from "@mantine/core"
import Map, { GeolocateControl, Marker, Source, Layer } from "react-map-gl"
import "mapbox-gl/dist/mapbox-gl.css"
import InputSearchCombobox from "../../components/Form/InputSearchCombobox"
import InputField from "../../components/Form/InputField"
import { hondurasDepartments } from "../../utils/constants"
import InputTextAreaField from "../../components/Form/InputTextAreaField"
import * as turf from "@turf/turf"
import { useSelector } from "react-redux"
import { colors } from "../../theme/colors"

export default function LocationForm({ register, errors, setValue, itemDetails, newBranch }) {
  const { colorScheme } = useMantineColorScheme()
  const [markerPosition, setMarkerPosition] = useState(null)
  const [lng, setLng] = useState(0)
  const [lat, setLat] = useState(0)
  const [isMapReady, setIsMapReady] = useState(newBranch)
  const range = useSelector((state) => state.branches.shippingRange)

  useEffect(() => {
    if (itemDetails?.geolocation?.coordinates) {
      const [initialLng, initialLat] = itemDetails.geolocation.coordinates
      setLng(initialLng)
      setLat(initialLat)
      setMarkerPosition({ longitude: initialLng, latitude: initialLat })
      setValue("geolocation", [initialLng, initialLat])
      setIsMapReady(true)
    }
  }, [itemDetails])

  const handleMapClick = (event) => {
    const { lngLat } = event
    setLng(lngLat.lng)
    setLat(lngLat.lat)
    setMarkerPosition({ longitude: lngLat.lng, latitude: lngLat.lat })
    setValue("geolocation", [lngLat.lng, lngLat.lat])
  }

  const generateCircle = () => {
    if (!lng || !lat) return null
    const point = turf.point([lng, lat])
    return turf.circle(point, range, {
      steps: 64,
      units: "kilometers"
    })
  }

  const circleGeoJSON = generateCircle()

  return (
    <Grid>
      <Grid.Col span={{ base: 12 }}>
        <Paper withBorder radius="md" p="md">
          <Stack>
            <InputTextAreaField label="Dirección exacta (Obligatorio)" name="address" register={register} errors={errors} />
            <InputSearchCombobox
              label="Departamento (Obligatorio)"
              name={"state"}
              searchValue={itemDetails?.state}
              items={hondurasDepartments}
              register={register}
              errors={errors}
              setValue={setValue}
            />
            <InputField label="Ciudad" name="city" register={register} errors={errors} />
            <Stack>
              <Paper>
                <Text fw={700}>Ubicación en mapa (Obligatorio)</Text>
                <Text size="sm" c="dimmed" pb="xs">
                  Haga clic en el mapa para seleccionar la ubicación
                </Text>
                <Paper h={380} className="h-72 relative">
                  {isMapReady && (
                    <Map
                      initialViewState={
                        newBranch
                          ? { longitude: -88.025, latitude: 15.50417, zoom: 12 }
                          : {
                              longitude: lng,
                              latitude: lat,
                              zoom: 12
                            }
                      }
                      style={{ borderRadius: "6px" }}
                      mapStyle={
                        colorScheme === "dark"
                          ? import.meta.env.VITE_MAPBOX_DARK_STYLE_URL
                          : import.meta.env.VITE_MAPBOX_LIGHT_STYLE_URL
                      }
                      mapboxAccessToken={import.meta.env.VITE_MAPBOX_ACCESS_TOKEN}
                      onClick={handleMapClick}>
                      {markerPosition && (
                        <Marker {...markerPosition} longitude={lng} latitude={lat} color={colors.main_app_color} />
                      )}

                      <GeolocateControl
                        showAccuracyCircle={false}
                        showUserLocation={false}
                        onGeolocate={(position) => {
                          setLng(position.coords.longitude)
                          setLat(position.coords.latitude)
                          setValue("geolocation", [position.coords.longitude, position.coords.latitude])
                          setMarkerPosition({ longitude: position.coords.longitude, latitude: position.coords.latitude })
                        }}
                        ref={(ref) => {
                          if (ref) {
                            const button = ref._container?.querySelector("button")
                            if (button) {
                              button.setAttribute("aria-label", "Find my location")
                              const tooltip = button.querySelector(".mapboxgl-ctrl-icon")
                              if (tooltip) tooltip.title = "Encuentra mi ubicación"
                            }
                          }
                        }}
                      />

                      {circleGeoJSON && (
                        <Source id="circle" type="geojson" data={circleGeoJSON}>
                          <Layer
                            id="circle-fill"
                            type="fill"
                            paint={{
                              "fill-color": `${colors.main_app_color}`,
                              "fill-opacity": 0.3
                            }}
                          />
                          <Layer
                            id="circle-outline"
                            type="line"
                            paint={{
                              "line-color": `${colors.main_app_color}`,
                              "line-width": 2
                            }}
                          />
                        </Source>
                      )}
                    </Map>
                  )}
                </Paper>
                <SimpleGrid mt="sm" cols={{ base: 1, sm: 2 }}>
                  <TextInput disabled label="Longitud" value={lng} placeholder="Disabled input" />
                  <TextInput disabled label="Latitud" value={lat} placeholder="Disabled input" />
                </SimpleGrid>
              </Paper>
            </Stack>
          </Stack>
        </Paper>
      </Grid.Col>
    </Grid>
  )
}
