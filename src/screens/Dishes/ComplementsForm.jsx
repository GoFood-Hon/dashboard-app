import React, { useEffect, useState } from "react"
import { Grid, Image, Text, ScrollArea, Paper } from "@mantine/core"
import { useSelector } from "react-redux"
import { getFormattedHNL } from "../../utils"
import { SortableList } from "./components"
import LoadingCircle from "../../components/LoadingCircle"
import { selectComplementsError, selectComplementsStatus } from "../../store/features/complementsSlice"
import { TrashIcon } from "../../assets/icons/TrashIcon"
import { IconX } from "@tabler/icons-react"

const AvailableComplementsCard = ({ item, onItemClick }) => {
  const { images, name, price } = item
  const handleItemClick = () => {
    onItemClick(item)
  }

  return (
    <Paper withBorder radius='md' onClick={handleItemClick}>
      <div className="w-full p-3 my-3 rounded-lg flex-row justify-between items-center flex text-sm">
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
  itemsAvailableLabel,
  data,
  name,
  selectedDishes
}) {
  const status = useSelector(selectComplementsStatus)
  const error = useSelector(selectComplementsError)

  const [addedComplements, setAddedComplements] = useState([])
  const [extras, setExtras] = useState([])

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
    setAddedComplements([...addedComplements, complement])
    setExtras((prevExtras) => prevExtras.filter((extra) => extra !== complement))
    updateComplementsValue([...addedComplements, complement])
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
            <div className="flex flex-col w-full h-full text-xl justify-center item-center text-center">{defaultMessage}</div>
          )}
        </Paper>
      </Grid.Col>
      <Grid.Col span={{ base: 12, md: 5 }}>
        <Paper withBorder radius="md" p="md" className="w-full h-full">
          <span className="text-sm font-semibold ">{itemsAvailableLabel}</span>
          <ScrollArea w={"100%"} h={350}>
            <div className="w-full mt-2 space-y-2">
              {status === "loading" && (
                <div className="h-[calc(100vh-350px)] w-full flex justify-center items-center">
                  <LoadingCircle />
                </div>
              )}
              {status === "error" && <div>Error: {error}</div>}
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
            </div>
          </ScrollArea>
        </Paper>
      </Grid.Col>
    </Grid>
  )
}
