import React, { useEffect, useState } from "react"
import { Grid, Image, Text, ScrollArea, Paper, Button, Loader, CloseButton } from "@mantine/core"
import { useSelector } from "react-redux"
import { getFormattedHNL } from "../../utils"
import { SortableList } from "./components"
import { colors } from "../../theme/colors"
import { useDebouncedState } from "@mantine/hooks"
import { useDispatch } from "react-redux"
import { setCurrentDishPage, setDishesAddedToMenuCount } from "../../store/features/menuSlice"

const AvailableComplementsCard = ({ item, onItemClick }) => {
  const { images, name, price } = item
  const handleItemClick = () => {
    onItemClick(item)
  }

  return (
    <Paper withBorder radius="md" onClick={handleItemClick}>
      <div className="w-full p-3 my-3 rounded-lg flex-row justify-between items-center flex text-sm cursor-pointer">
        <div className="flex flex-row items-center w-1/2">
          <Image
            h={"40"}
            w="auto"
            fit="contain"
            src={images?.[0]?.location}
            alt={images?.[0]?.key}
            radius={"sm"}
            fallbackSrc="https://placehold.co/600x400?text=Imagen+no+disponible"
          />
          <span className="pl-3">{name}</span>
        </div>
        <div className="flex flex-row w-1/2 justify-end">
          <span className="pl-3">{getFormattedHNL(price)}</span>
        </div>
      </div>
    </Paper>
  )
}

const ComplementCard = ({ item, handleRemoveComplement }) => {
  const { images, name, price } = item

  return (
    <div className="w-full h-full">
      <div className="w-full h-full flex-row justify-between items-center flex text-sm">
        <div className="flex flex-row items-center w-1/2">
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
          <span className="pl-3">{getFormattedHNL(price)}</span>
          <div className=" flex justify-center items-center">
            <CloseButton onClick={() => handleRemoveComplement(item)} />
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
  const [search, setSearch] = useDebouncedState("", 300)
  const dispatch = useDispatch()
  const { currentDishPage, updatingDishes, dishesLoading, dishesAddedToMenu } = useSelector((state) => state.menus)

  useEffect(() => {
    if (selectedDishes && Array.isArray(selectedDishes)) {
      setAddedComplements(selectedDishes)
    }
  }, [selectedDishes, data])

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

  useEffect(() => {
    setAddedComplements([])
  }, [isDataCleared])

  return (
    <Grid>
      <Grid.Col span={{ base: 12, md: 6 }}>
        <Paper withBorder radius="md" p="md" className="w-full h-full">
          {dishesLoading ? (
            <div className="h-[calc(100vh-350px)] w-full flex justify-center items-center">
              <Loader color={colors.main_app_color} />
            </div>
          ) : (
            <>
              <ScrollArea w={"100%"} h={350}>
                <div className="w-full space-y-2">
                  {extras.length > 0 ? (
                    extras?.map((item, key) => (
                      <AvailableComplementsCard
                        item={item}
                        key={key}
                        onItemClick={handleComplementClick}
                        handleRemoveComplement={handleRemoveComplement}
                      />
                    ))
                  ) : (
                    <Text size="sm" c="dimmed" inline mt={50} className="text-center leading-10">
                      No hay platillos para mostrar
                    </Text>
                  )}
                  {moreData && (
                    <div className="w-full flex justify-center mt-4">
                      <Button
                        loading={updatingDishes}
                        color={colors.main_app_color}
                        onClick={() => {
                          dispatch(setCurrentDishPage(currentDishPage + 1))
                        }}>
                        Cargar más
                      </Button>
                    </div>
                  )}
                </div>
              </ScrollArea>
            </>
          )}
        </Paper>
      </Grid.Col>
      <Grid.Col span={{ base: 12, md: 6 }}>
        <Paper withBorder p="md" radius="md" className="w-full h-full">
          {addedComplements.length > 0 ? (
            <ScrollArea w={"100%"} h={350}>
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
