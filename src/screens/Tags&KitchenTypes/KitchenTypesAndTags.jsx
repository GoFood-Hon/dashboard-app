import React, { useState } from "react"
import { Accordion, Flex, Paper, Button } from "@mantine/core"
import BackButton from "../Dishes/components/BackButton"
import { CreateTags } from "./CreateTags"
import { CreateKitchenTypes } from "./CreateKitchenTypes"

export const KitchenTypesAndTags = () => {
  const accordionStructure = [
    {
      title: "Lista de Tags",
      requirement: "Opcional",
      form: <CreateTags />
    },
    {
      title: "Tipos de cocina",
      requirement: "Opcional",
      form: <CreateKitchenTypes />
    }
  ]

  const items = accordionStructure.map((item, key) => (
    <Accordion.Item key={key} value={item.title}>
      <Accordion.Control>
        <div className="w-full rounded-lg flex-row flex items-center">
          <div
            className={`text-slate-50 text-base font-bold bg-[#EE364C] rounded-full p-2 w-8 h-8 flex items-center justify-center`}>
            {key + 1}
          </div>
          <span className="text-base font-bold  leading-normal ml-4">{item.title}</span>
          <span className="text-base font-normal ml-1">({item?.requirement})</span>
        </div>
      </Accordion.Control>
      <Accordion.Panel>{item.form}</Accordion.Panel>
    </Accordion.Item>
  ))

  return (
    <>
      <section>
        <div className="flex flex-row justify-between items-center pb-4 flex-wrap xs:gap-3">
          <BackButton title="Tags / Tipos de cocina" />
        </div>
      </section>
      <section>
        <Accordion variant="separated" multiple defaultValue={["Lista de Tags", "Tipos de cocina"]}>
          {items}
        </Accordion>
      </section>
    </>
  )
}