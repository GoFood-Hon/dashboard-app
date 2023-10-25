import React, { useState } from "react"
import { CloseButton, Grid, Input } from "@mantine/core"

export default function ComplementsForm() {
  const [searchComplement, setSearchComplement] = useState("")

  return (
    <Grid>
      <Grid.Col span={{ base: 12, md: 7 }}>
        <div className="w-full h-full p-6 bg-white rounded-lg border border-blue-100">Draggable List</div>
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
          <div>
            <div className="w-full p-5 my-3 bg-white rounded-lg border border-blue-100 flex-row justify-between items-center flex text-sm">
              <div className="flex flex-row items-center w-1/2">
                <img className="w-10 h-10" src="https://via.placeholder.com/40x40" />
                <span className="text-sky-950 pl-3">Papas</span>
              </div>
              <div className="flex flex-row w-1/2 justify-end">
                <span className="text-sky-950 pl-3">+ HND 120.00</span>
              </div>
            </div>
          </div>
          <div>
            <div className="w-full p-5 my-3 bg-white rounded-lg border border-blue-100 flex-row justify-between items-center flex text-sm">
              <div className="flex flex-row items-center w-1/2">
                <img className="w-10 h-10" src="https://via.placeholder.com/40x40" />
                <span className="text-sky-950 pl-3">Papas Supreme</span>
              </div>
              <div className="flex flex-row w-1/2 justify-end">
                <span className="text-sky-950 pl-3">+ HND 10.03</span>
              </div>
            </div>
          </div>
          <div>
            <div className="w-full p-5 my-3 bg-white rounded-lg border border-blue-100 flex-row justify-between items-center flex text-sm">
              <div className="flex flex-row items-center w-1/2">
                <img className="w-10 h-10" src="https://via.placeholder.com/40x40" />
                <span className="text-sky-950 pl-3">Chilli Cheese</span>
              </div>
              <div className="flex flex-row w-1/2 justify-end">
                <span className="text-sky-950 pl-3">+ HND 103.23</span>
              </div>
            </div>
          </div>
        </div>
      </Grid.Col>
    </Grid>
  )
}
