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

function getMockItems() {
  return createRange(50, (index) => ({ id: index + 1 }))
}

function createRange(length, initializer) {
  return [...new Array(length)].map((_, index) => initializer(index))
}

const ComplementCard = ({ item }) => {
  const { active, images, name, price } = item

  return (
    <div>
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

export default function ComplementsForm() {
  const dispatch = useDispatch()
  const complements = useSelector(selectAllComplements)
  const status = useSelector(selectComplementsStatus)
  const error = useSelector(selectComplementsError)

  const [searchComplement, setSearchComplement] = useState("")
  const [items, setItems] = useState(getMockItems)

  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchComplements())
    }
  }, [status, dispatch])

  return (
    <Grid>
      <Grid.Col span={{ base: 12, md: 7 }}>
        <div className="w-full h-full p-6 bg-white rounded-lg border border-blue-100">
          <SortableList
            items={items}
            onChange={setItems}
            renderItem={(item) => (
              <SortableList.Item id={item.id}>
                <SortableList.DragHandle />
                {item.id}
              </SortableList.Item>
            )}
          />
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
              <ComplementCard item={item} key={key} />
            ))}
          </div>
        </div>
      </Grid.Col>
    </Grid>
  )
}
