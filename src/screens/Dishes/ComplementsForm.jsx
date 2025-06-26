import React, { useEffect, useState } from "react"
import { Grid, Image, Text, ScrollArea, Paper, Button, Loader, CloseButton, Stack, Flex, Box } from "@mantine/core"
import { useSelector } from "react-redux"
import { getFormattedHNL } from "../../utils"
import { SortableList } from "./components"
import { colors } from "../../theme/colors"
import { useDispatch } from "react-redux"
import { getAllDishes, setCurrentDishPage, setDishesAddedToMenuCount, setSearchDishesData } from "../../store/features/menuSlice"
import { SearchComponent } from "../../components/SearchComponent"
import { IconCircleCheckFilled } from "@tabler/icons-react"

const AvailableComplementsCard = ({ item, onItemClick, isSelected }) => {
  const { images, name, price } = item

  return (
    <Paper
      withBorder
      radius="md"
      p="md"
      onClick={() => onItemClick(item)}
      style={{
        cursor: "pointer",
        borderColor: isSelected ? "grey" : undefined
      }}>
      <Flex justify="space-between" align="center">
        <Flex align="center" gap="xs" w="50%">
          <Image
            h={40}
            w="auto"
            fit="contain"
            src={images?.[0]?.location}
            alt={images?.[0]?.key}
            radius="sm"
            fallbackSrc="https://placehold.co/600x400?text=Imagen+no+disponible"
          />
          <Text size="sm">{name}</Text>

          {isSelected && <IconCircleCheckFilled size="1.2rem" />}
        </Flex>

        <Flex justify="flex-end" align="center" w="50%">
          <Text size="sm">{getFormattedHNL(price)}</Text>
        </Flex>
      </Flex>
    </Paper>
  )
}

const ComplementCard = ({ item, handleRemoveComplement }) => {
  const { images, name, price } = item

  return (
    <Box w="100%" h="100%">
      <Flex w="100%" h="100%" justify="space-between" align="center">
        <Flex align="center" w="50%" gap="sm">
          <Image
            h={40}
            w="auto"
            fit="contain"
            src={images?.[0]?.location}
            alt={images?.[0]?.key}
            radius="sm"
            fallbackSrc="https://placehold.co/60x40?text=Imagen+no+disponible"
          />
          <Text size="sm">{name}</Text>
        </Flex>

        <Flex align="center" justify="flex-end" w="50%" gap="sm">
          <Text size="sm">{getFormattedHNL(price)}</Text>
          <CloseButton onClick={() => handleRemoveComplement(item)} />
        </Flex>
      </Flex>
    </Box>
  )
}

export default function ComplementsForm({ setValue, defaultMessage, moreData, data, name, selectedDishes }) {
  const [addedComplements, setAddedComplements] = useState([])
  const [extras, setExtras] = useState([])
  const dispatch = useDispatch()
  const user = useSelector((state) => state.user.value)
  const { currentDishPage, updatingDishes, dishesLoading, dishesAddedToMenu, searchDishesData, dishesPerPage } = useSelector(
    (state) => state.menus
  )

  useEffect(() => {
    if (selectedDishes && Array.isArray(selectedDishes)) {
      setAddedComplements(selectedDishes)
    }
  }, [selectedDishes])

  useEffect(() => {
    dispatch(setDishesAddedToMenuCount(selectedDishes?.length || 0))
    setExtras(data)
  }, [data, selectedDishes])

  const updateComplementsValue = (complements) => {
    const complementIds = complements.map((complement) => complement.id)
    setValue(name, complementIds)
  }

  const handleComplementClick = (complement) => {
    const exists = addedComplements.some((item) => item.id === complement.id)

    if (!exists) {
      dispatch(setDishesAddedToMenuCount(dishesAddedToMenu + 1))
      setAddedComplements([...addedComplements, complement])
      updateComplementsValue([...addedComplements, complement])
    }
  }

  const handleRemoveComplement = (complement) => {
    const updatedAddedComplements = addedComplements.filter((item) => item !== complement)
    setAddedComplements(updatedAddedComplements)
    dispatch(setDishesAddedToMenuCount(dishesAddedToMenu - 1))
    updateComplementsValue(updatedAddedComplements)
  }

  const handleSearch = (query) => {
    dispatch(setSearchDishesData(query))
  }

  const executeSearch = async (query) => {
    dispatch(setCurrentDishPage(1))
    dispatch(
      getAllDishes({
        limit: dishesPerPage,
        restaurantId: user.restaurantId,
        page: 1,
        order: "DESC",
        search_field: "name",
        search: query
      })
    )
  }

  const fetchMoreDishes = () => {
    dispatch(setCurrentDishPage(currentDishPage + 1))
    dispatch(
      getAllDishes({
        limit: dishesPerPage,
        restaurantId: user.restaurantId,
        page: currentDishPage + 1,
        order: "DESC"
      })
    )
  }

  return (
    <Grid>
      <Grid.Col span={{ base: 12, md: 6 }}>
        <Paper withBorder radius="md" p="md" className="w-full h-full">
          <Stack gap="sm">
            <SearchComponent
              onSearch={handleSearch}
              elementName={"platillos"}
              value={searchDishesData}
              searchAction={executeSearch}
              noSelect
            />
            {dishesLoading ? (
              <div className="h-[calc(100vh-645px)] w-full flex justify-center items-center">
                <Loader color={colors.main_app_color} />
              </div>
            ) : (
              <ScrollArea w="100%" h={400}>
                {extras.length > 0 ? (
                  <Stack w="100%" gap="sm">
                    {extras.map((item, key) => (
                      <AvailableComplementsCard
                        key={key}
                        item={item}
                        onItemClick={handleComplementClick}
                        handleRemoveComplement={handleRemoveComplement}
                        isSelected={addedComplements.some((complement) => complement.id === item.id)}
                      />
                    ))}
                    {moreData && (
                      <Flex justify="center">
                        <Button loading={updatingDishes} color={colors.main_app_color} onClick={() => fetchMoreDishes()}>
                          Cargar más
                        </Button>
                      </Flex>
                    )}
                  </Stack>
                ) : (
                  <Flex justify="center" align="center" h={350} w="100%">
                    <Text c="dimmed">No hay platillos para mostrar</Text>
                  </Flex>
                )}
              </ScrollArea>
            )}
          </Stack>
        </Paper>
      </Grid.Col>
      <Grid.Col span={{ base: 12, md: 6 }}>
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
            <Text c="dimmed" className="flex flex-col w-full h-full text-md justify-center item-center text-center">
              {defaultMessage}
            </Text>
          )}
        </Paper>
      </Grid.Col>
    </Grid>
  )
}
