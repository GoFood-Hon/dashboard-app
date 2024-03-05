import React, { useEffect, useState } from "react"
import { Grid, Image, Text } from "@mantine/core"
import { useSelector } from "react-redux"

import { getFormattedHNL } from "../../utils"
import { SortableList } from "./components"
import LoadingCircle from "../../components/LoadingCircle"
import { selectComplementsError, selectComplementsStatus } from "../../store/features/complementsSlice"
import { TrashIcon } from "../../assets/icons/TrashIcon"

const AvailableComplementsCard = ({ item, onItemClick }) => {
  const { images, name, price } = item
  const handleItemClick = () => {
    onItemClick(item)
  }

  return (
    <div onClick={handleItemClick} className="cursor-pointer">
      <div className="w-full p-5 my-3 bg-white rounded-lg border border-blue-100 flex-row justify-between items-center flex text-sm">
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
          <span className="text-sky-950 pl-3">{name}</span>
        </div>
        <div className="flex flex-row w-1/2 justify-end">
          <span className="text-sky-950 pl-3">{getFormattedHNL(price)}</span>
        </div>
      </div>
    </div>
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

          <span className="text-sky-950 pl-3">{name}</span>
        </div>
        <div className="flex flex-row w-1/2 justify-end">
          <span className="text-sky-950 pl-3">{getFormattedHNL(price)}</span>
          <div className="h-full flex justify-center items-center">
            <span className="mx-1 cursor-pointer" onClick={() => handleRemoveComplement(item)}>
              <TrashIcon width={20} height={20} fill={"#F87171"} />
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function ComplementsForm({ setValue, isDataCleared, defaultMessage, itemsAvailableLabel, data, name }) {
  const status = useSelector(selectComplementsStatus)
  const error = useSelector(selectComplementsError)

  const [addedComplements, setAddedComplements] = useState([])
  const [extras, setExtras] = useState([])

  useEffect(() => {
    setExtras(data)
  }, [data])

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
        <div className="w-full h-full p-6 bg-white rounded-lg border border-blue-100">
          {addedComplements.length > 0 ? (
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
          ) : (
            <div className="flex flex-col w-full h-full text-xl justify-center item-center text-center">{defaultMessage}</div>
          )}
        </div>
      </Grid.Col>
      <Grid.Col span={{ base: 12, md: 5 }}>
        <div className="w-full h-full p-6 bg-white rounded-lg border border-blue-100">
          <span className="text-sm font-semibold ">{itemsAvailableLabel}</span>
          <div className="my-2">
            {/*  <Input
              className="w-full"
              placeholder="Buscar"
              value={searchComplement}
              onChange={(event) => setSearchComplement(event.currentTarget.value)}
              rightSectionPointerEvents="all"
              rightSection={
                <CloseButton
                  aria-label="Clear input"
                  onClick={() => setSearchComplement("")}
                  style={{ display: searchComplement ? undefined : "none" }}
                />
              }
            /> */}
          </div>
          <div className="w-full">
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
              <Text size="sm" c="dimmed" inline mt={20} className="text-center leading-10">
                Sin disponibilidad...
              </Text>
            )}
          </div>
        </div>
      </Grid.Col>
    </Grid>
  )
}
