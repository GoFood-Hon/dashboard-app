import React, { useEffect, useState } from "react"
import { CloseButton, Grid, Input } from "@mantine/core"
import { SortableList } from "./components"
import { getFormattedHNL } from "../../utils"
import LoadingCircle from "../../components/LoadingCircle"
import {
  fetchComplements,
  selectAllComplements,
  selectComplementsError,
  selectComplementsStatus
} from "../../store/features/complementsSlice"
import { useDispatch, useSelector } from "react-redux"
import EyeIcon from "../../assets/icons/EyeIcon"
import { TrashIcon } from "../../assets/icons/TrashIcon"

const AvailableComplementsCard = ({ item, onItemClick }) => {
  const { active, images, name, price } = item
  const handleItemClick = () => {
    onItemClick(item)
  }

  return (
    <div onClick={handleItemClick} className="cursor-pointer">
      <div className="w-full p-5 my-3 bg-white rounded-lg border border-blue-100 flex-row justify-between items-center flex text-sm">
        <div className="flex flex-row items-center w-1/2">
          <img className="w-10 h-10" src={images?.[0]?.location} alt={images?.[0]?.key} />
          <span className="text-sky-950 pl-3">{name}</span>
        </div>
        <div className="flex flex-row w-1/2 justify-end">
          <span className="text-sky-950 pl-3">{getFormattedHNL(price)}</span>
        </div>
      </div>
    </div>
  )
}

const ComplementCard = ({ item }) => {
  const { active, images, name, price } = item

  return (
    <div className="w-full h-full">
      <div className="w-full h-full flex-row justify-between items-center flex text-sm">
        <div className="flex flex-row items-center w-1/2">
          <img className="w-10 h-10" src={images?.[0]?.location} alt={images?.[0]?.key} />
          <span className="text-sky-950 pl-3">{name}</span>
        </div>
        <div className="flex flex-row w-1/2 justify-end">
          <span className="text-sky-950 pl-3">{getFormattedHNL(price)}</span>
          <div className="h-full flex justify-center items-center">
            <span className="mx-1 cursor-pointer">
              <EyeIcon width={20} height={20} />
            </span>
            <span className="mx-1 cursor-pointer">
              <TrashIcon width={20} height={20} fill={"#F87171"} />
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function ComplementsForm() {
  const dispatch = useDispatch()
  const complements = useSelector(selectAllComplements)
  const status = useSelector(selectComplementsStatus)
  const error = useSelector(selectComplementsError)

  const [searchComplement, setSearchComplement] = useState("")
  const [addedComplements, setAddedComplements] = useState([])

  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchComplements())
    }
  }, [status, dispatch])

  const handleComplementClick = (complement) => {
    setAddedComplements([...addedComplements, complement])
  }

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
                  <ComplementCard item={item} />
                </SortableList.Item>
              )}
            />
          ) : (
            <div className="flex flex-col w-full h-full text-xl justify-center item-center text-center">
              Por favor seleccione complementos para este platillo
            </div>
          )}
        </div>
      </Grid.Col>
      <Grid.Col span={{ base: 12, md: 5 }}>
        <div className="w-full h-full p-6 bg-white rounded-lg border border-blue-100">
          <span className="text-sm font-semibold ">Complementos disponibles </span>
          <span className="text-sm">(opcional)</span>
          <div className="my-2">
            <Input
              className="w-full"
              placeholder="Buscar complemento"
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
            />
          </div>
          <div className="w-full">
            {status === "loading" && (
              <div className="h-[calc(100vh-350px)] w-full flex justify-center items-center">
                <LoadingCircle />
              </div>
            )}
            {status === "error" && <div>Error: {error}</div>}
            {complements?.map((item, key) => (
              <AvailableComplementsCard item={item} key={key} onItemClick={handleComplementClick} />
            ))}
          </div>
        </div>
      </Grid.Col>
    </Grid>
  )
}
