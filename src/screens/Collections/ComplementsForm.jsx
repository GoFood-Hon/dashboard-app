import React, { useEffect, useState } from "react"
import { Grid, Image, Text, ScrollArea, Paper, Flex, Group, Avatar, Button, Loader, Box } from "@mantine/core"
import { useSelector } from "react-redux"
import { getFormattedHNL } from "../../utils"

import LoadingCircle from "../../components/LoadingCircle"
import { selectComplementsError, selectComplementsStatus } from "../../store/features/complementsSlice"
import { TrashIcon } from "../../assets/icons/TrashIcon"
import { IconX } from "@tabler/icons-react"
import { SortableList } from "../Dishes/components"
import { useDispatch } from "react-redux"
import { setCurrentDishPage, setCurrentRestaurantPage } from "../../store/features/collectionsSlice"
import { colors } from "../../theme/colors"

const AvailableComplementsCard = ({ item, onItemClick }) => {
  const { images, name } = item
  const handleItemClick = () => {
    onItemClick(item)
  }

  return (
    <Paper withBorder radius="md" onClick={handleItemClick}>
      <Group p="xs">
        <Image w={35} h={35} src={images?.[0]?.location} radius="md" />
        <Box w={215}>

        <Text truncate="end" fz="sm" fw={500}>
          {name}
        </Text>
        </Box>
      </Group>
    </Paper>
  )
}

const ComplementCard = ({ item, handleRemoveComplement }) => {
  const { images, name, price } = item

  return (
    <div className="w-full h-full">
      <div className="w-full h-full flex-row justify-between items-center flex text-sm">
        <div className="flex flex-row items-center w-1/2 cur">
          <Image
            h={"40"}
            w="auto"
            fit="contain"
            src={images?.[0]?.location}
            alt={images?.[0]?.key}
            radius={"sm"}
            fallbackSrc="https://placehold.co/60x40?text=Imagen+no+disponible"
          />

          <span className="pl-3">{name}</span>
        </div>
        <div className="flex flex-row w-1/2 justify-end items-center gap-2">
          <div className=" flex justify-center items-center">
            <span
              onClick={() => handleRemoveComplement(item)}
              className="cursor-pointer text-red-500 transition ease-in-out duration-200 rounded-full hover:bg-red-500 hover:text-white p-1">
              <IconX size={20} />
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function ComplementsForm({
  setValue,
  isDataCleared,
  defaultMessage,
  moreData,
  itemsAvailableLabel,
  data,
  name,
  selectedDishes
}) {
  const [addedComplements, setAddedComplements] = useState([])
  const [extras, setExtras] = useState([])
  const dispatch = useDispatch()
  const {
    currentDishPage,
    currentRestaurantPage,
    updatingDishes,
    dishesLoading,
    collectionType,
    updatingRestaurants,
    restaurantsLoading
  } = useSelector((state) => state.collections)

  useEffect(() => {
    setAddedComplements([])
    setValue("dishes", [])
    setValue("restaurants", [])
  }, [collectionType])

  useEffect(() => {
    if (selectedDishes && Array.isArray(selectedDishes)) {
      setAddedComplements(selectedDishes)
    }
  }, [selectedDishes, data])

  useEffect(() => {
    if (Array.isArray(selectedDishes)) {
      const filteredExtras = data.filter((item) => !selectedDishes.some((selected) => selected.id === item.id))
      setExtras(filteredExtras)
    } else {
      setExtras(data)
    }
  }, [data, selectedDishes])

  const updateComplementsValue = (complements) => {
    const complementIds = complements.map((complement) => complement.id)
    setValue(name, complementIds)
  }

  const handleComplementClick = (complement) => {
    // Verificar si el complemento ya existe en `addedComplements`
    const exists = addedComplements.some((item) => item.id === complement.id)

    // Si no existe, se agrega
    if (!exists) {
      setAddedComplements([...addedComplements, complement])
      //setExtras((prevExtras) => prevExtras.filter((extra) => extra.id !== complement.id))
      updateComplementsValue([...addedComplements, complement])
    }
  }

  const handleRemoveComplement = (complement) => {
    const updatedAddedComplements = addedComplements.filter((item) => item !== complement)
    setAddedComplements(updatedAddedComplements)

    setExtras((prevExtras) => [...prevExtras, complement])

    updateComplementsValue(updatedAddedComplements)
  }

  useEffect(() => {
    setAddedComplements([])
  }, [isDataCleared])

  return (
    <Grid>
      <Grid.Col span={{ base: 12, md: 7 }}>
        <Paper withBorder radius="md" p="md" className="w-full h-full">
          {dishesLoading ? (
            <div className="h-[calc(100vh-350px)] w-full flex justify-center items-center">
              <Loader color={colors.main_app_color} />
            </div>
          ) : (
            <>
              <ScrollArea style={{ width: "100%" }} h={350} offsetScrollbars>
                <Grid columns={2} gutter="md">
                  {extras.length > 0 ? (
                    extras.map((item, key) => (
                      <Grid.Col span={1} key={key} style={{cursor: 'pointer'}}>
                        <AvailableComplementsCard
                          item={item}
                          onItemClick={handleComplementClick}
                          handleRemoveComplement={handleRemoveComplement}
                        />
                      </Grid.Col>
                    ))
                  ) : (
                    <Grid.Col span={2}>
                      <Text size="sm" c="dimmed" inline mt={50} className="text-center leading-10">
                        No hay {collectionType === "dishes" ? "platillos" : "restaurantes"} para mostrar
                      </Text>
                    </Grid.Col>
                  )}
                  {/* Mostrar el botón "Cargar más" solo si hasMore es true */}
                  {moreData && (
                    <div className="w-full flex justify-center mt-4">
                      <Button
                        loading={collectionType === "dishes" ? updatingDishes : updatingRestaurants}
                        color={colors.main_app_color}
                        onClick={() => {
                          collectionType === "dishes"
                            ? dispatch(setCurrentDishPage(currentDishPage + 1))
                            : dispatch(setCurrentRestaurantPage(currentRestaurantPage + 1))
                        }}>
                        Cargar más
                      </Button>
                    </div>
                  )}
                </Grid>
              </ScrollArea>
            </>
          )}
        </Paper>
      </Grid.Col>
      <Grid.Col span={{ base: 12, md: 5 }}>
        <Paper withBorder p="md" radius="md" className="w-full h-full">
          {addedComplements.length > 0 ? (
            <ScrollArea w={"100%"} h={350}>
              <SortableList
                items={addedComplements}
                onChange={setAddedComplements}
                renderItem={(item) => (
                  <SortableList.Item id={item.id}>
                    <SortableList.DragHandle />
                    <ComplementCard item={item} handleRemoveComplement={() => handleRemoveComplement(item)} />
                  </SortableList.Item>
                )}
              />
            </ScrollArea>
          ) : (
            <Text className="flex flex-col w-full h-full text-xl justify-center item-center text-center">{defaultMessage}</Text>
          )}
        </Paper>
      </Grid.Col>
    </Grid>
  )
}
