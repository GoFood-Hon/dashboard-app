import React, { useEffect, useState } from "react"
import { Grid, Image, Text, ScrollArea, Paper, Group, Button, Loader, Box, CloseButton, Stack, Flex } from "@mantine/core"
import { useSelector } from "react-redux"
import { SortableList } from "../Dishes/components"
import { useDispatch } from "react-redux"
import {
  fetchDishesForCollections,
  fetchRestaurantsForCollections,
  setCurrentDishPage,
  setCurrentRestaurantPage,
  setElementsCount,
  setSearchDishesData,
  setSearchRestaurantsData
} from "../../store/features/collectionsSlice"
import { colors } from "../../theme/colors"
import { SearchComponent } from "../../components/SearchComponent"
import { IconCircleCheckFilled } from "@tabler/icons-react"

const AvailableComplementsCard = ({ item, onItemClick, isSelected }) => {
  const { images, name } = item
  const handleItemClick = () => {
    onItemClick(item)
  }

  return (
    <Paper
      withBorder
      radius="md"
      onClick={handleItemClick}
      style={{
        cursor: "pointer",
        borderColor: isSelected ? "grey" : undefined
      }}>
      <Group p="xs" position="apart">
        <Group>
          <Image w={35} h={35} src={images?.[0]?.location} radius="md" />
          <Flex justify="space-between" gap='xs' align="center">
            <Text truncate="end" fz="sm" fw={500}>
              {name}
            </Text>
            {isSelected && <IconCircleCheckFilled size={18} />}
          </Flex>
        </Group>
      </Group>
    </Paper>
  )
}

const ComplementCard = ({ item, handleRemoveComplement }) => {
  const { images, name } = item

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
            <CloseButton onClick={() => handleRemoveComplement(item)} />
          </div>
        </div>
      </div>
    </div>
  )
}

export default function ComplementsForm({ setValue, defaultMessage, moreData, data, name, selectedDishes }) {
  const [addedComplements, setAddedComplements] = useState([])
  const [extras, setExtras] = useState([])
  const [deletedElements, setDeletedElements] = useState([])
  const [newElements, setNewElements] = useState([])
  const dispatch = useDispatch()
  const {
    currentDishPage,
    currentRestaurantPage,
    updatingDishes,
    dishesLoading,
    collectionType,
    updatingRestaurants,
    restaurantsLoading,
    elementsCount,
    dishesPerPage,
    restaurantsPerPage,
    searchDishesData,
    searchRestaurantsData
  } = useSelector((state) => state.collections)

  useEffect(() => {
    setAddedComplements([])
    setValue("dishes", [])
    setValue("restaurants", [])
  }, [collectionType])

  useEffect(() => {
    if (!addedComplements.length && selectedDishes && Array.isArray(selectedDishes)) {
      setAddedComplements(selectedDishes)
    }
  }, [selectedDishes])

  useEffect(() => {
    setExtras(data)
    dispatch(setElementsCount(selectedDishes?.length))
  }, [data, selectedDishes])

  const updateComplementsValue = (complements) => {
    const complementIds = complements.map((complement) => complement.id)
    setValue(name, complementIds)
  }

  const updateAddedComplementsValue = (complements) => {
    const complementIds = complements.map((complement) => complement.id)
    setValue("newElements", complementIds)
  }

  const updateDeletedComplementsValue = (complements) => {
    const complementIds = complements.map((complement) => complement.id)
    setValue("deletedElements", complementIds)
  }

  const handleComplementClick = (complement) => {
    const exists = addedComplements.some((item) => item.id === complement.id)

    if (!exists) {
      if (selectedDishes) {
        const isInSelectedDishes = selectedDishes.some((element) => element.id === complement.id)
        if (!isInSelectedDishes) {
          setNewElements([...newElements, complement])
          updateAddedComplementsValue([...newElements, complement])
        }
      }
      setAddedComplements([...addedComplements, complement])
      updateComplementsValue([...addedComplements, complement])
      dispatch(setElementsCount(elementsCount + 1))
    }
  }

  const handleRemoveComplement = (complement) => {
    const updatedAddedComplements = addedComplements.filter((item) => item !== complement)
    if (selectedDishes) {
      const isInSelectedDishes = selectedDishes.some((element) => element.id === complement.id)
      if (isInSelectedDishes) {
        setDeletedElements([...deletedElements, complement])
        updateDeletedComplementsValue([...deletedElements, complement])
      } else {
        if (newElements.some((element) => element.id === complement.id)) {
          const updatedNewElements = newElements.filter((element) => element.id !== complement.id)
          setNewElements(updatedNewElements)
          updateAddedComplementsValue(updatedNewElements)
        }
      }
      dispatch(setElementsCount(elementsCount - 1))
    }
    setAddedComplements(updatedAddedComplements)
    updateComplementsValue(updatedAddedComplements)
  }

  const handleSearch = (query) => {
    if (collectionType === "dishes") {
      dispatch(setSearchDishesData(query))
    } else {
      dispatch(setSearchRestaurantsData(query))
    }
  }

  const executeSearch = async (query) => {
    if (collectionType === "dishes") {
      dispatch(setCurrentDishPage(1))
      dispatch(
        fetchDishesForCollections({
          limit: dishesPerPage,
          page: 1,
          search_field: "name",
          search: query
        })
      )
    } else {
      dispatch(setCurrentRestaurantPage(1))
      dispatch(
        fetchRestaurantsForCollections({
          limit: restaurantsPerPage,
          page: 1,
          search_field: "name",
          search: query
        })
      )
    }
  }

  const fetchMoreElements = () => {
    if (collectionType === "dishes") {
      dispatch(setCurrentDishPage(currentDishPage + 1))
      dispatch(
        fetchDishesForCollections({
          limit: dishesPerPage,
          page: currentDishPage + 1
        })
      )
    } else {
      dispatch(setCurrentRestaurantPage(currentRestaurantPage + 1))
      dispatch(
        fetchRestaurantsForCollections({
          limit: restaurantsPerPage,
          page: currentRestaurantPage + 1
        })
      )
    }
  }

  return (
    <Grid>
      <Grid.Col span={{ base: 12, md: 7 }}>
        <Paper withBorder radius="md" p="md" className="w-full h-full">
          <Stack gap="sm">
            <SearchComponent
              onSearch={handleSearch}
              elementName={collectionType === "dishes" ? "platillos" : "comercios"}
              value={collectionType === "dishes" ? searchDishesData : searchRestaurantsData}
              searchAction={executeSearch}
              noSelect
            />
            {(collectionType === "dishes" ? dishesLoading : restaurantsLoading) ? (
              <div className="h-[calc(100vh-645px)] w-full flex justify-center items-center">
                <Loader color={colors.main_app_color} />
              </div>
            ) : (
              <ScrollArea h={400} scrollbars="y">
                <Grid columns={12} gutter="xs">
                  {extras.length > 0 ? (
                    extras.map((item, key) => (
                      <Grid.Col key={key} span={{ base: 12, md: 6 }} style={{ cursor: "pointer" }}>
                        <AvailableComplementsCard
                          item={item}
                          onItemClick={handleComplementClick}
                          handleRemoveComplement={handleRemoveComplement}
                          isSelected={addedComplements.some((complement) => complement.id === item.id)}
                        />
                      </Grid.Col>
                    ))
                  ) : (
                    <Flex justify="center" align="center" h={350} w="100%">
                      <Text c="dimmed">No hay {collectionType === "dishes" ? "platillos" : "comercios"} para mostrar</Text>
                    </Flex>
                  )}

                  {moreData && (
                    <Grid.Col span={12}>
                      <Flex justify="center" mt="xs">
                        <Button
                          loading={collectionType === "dishes" ? updatingDishes : updatingRestaurants}
                          color={colors.main_app_color}
                          onClick={() => fetchMoreElements()}>
                          Cargar más
                        </Button>
                      </Flex>
                    </Grid.Col>
                  )}
                </Grid>
              </ScrollArea>
            )}
          </Stack>
        </Paper>
      </Grid.Col>
      <Grid.Col span={{ base: 12, md: 5 }}>
        <Paper withBorder p="md" radius="md" className="w-full h-full">
          {addedComplements.length > 0 ? (
            <ScrollArea w={"100%"} h={435}>
              <SortableList
                items={addedComplements}
                onChange={setAddedComplements}
                renderItem={(item) => (
                  <SortableList.Item id={item.id}>
                    <ComplementCard item={item} handleRemoveComplement={() => handleRemoveComplement(item)} />
                  </SortableList.Item>
                )}
              />
            </ScrollArea>
          ) : (
            <Text c="dimmed" className="flex flex-col w-full h-full text-xl justify-center item-center text-center">
              {defaultMessage}
            </Text>
          )}
        </Paper>
      </Grid.Col>
    </Grid>
  )
}
