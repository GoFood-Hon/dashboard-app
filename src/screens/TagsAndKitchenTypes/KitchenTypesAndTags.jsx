import { Accordion, Stack } from "@mantine/core"
import BackButton from "../Dishes/components/BackButton"
import { CreateTags } from "./CreateTags"
import { CreateKitchenTypes } from "./CreateKitchenTypes"

export const KitchenTypesAndTags = () => {
  const accordionStructure = [
    {
      title: "Lista de tipos de establecimientos",
      form: <CreateKitchenTypes />
    },
    {
      title: "Lista de categorías",
      form: <CreateTags />
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
          <span className={`text-base font-normal ml-1 ${item?.requirement ?? 'invisible'}`}>({item?.requirement})</span>
        </div>
      </Accordion.Control>
      <Accordion.Panel>{item.form}</Accordion.Panel>
    </Accordion.Item>
  ))

  return (
    <Stack gap="xs">
      <BackButton title="Tipos de establecimientos / Categorías" />
      <Accordion radius="md" variant="separated" multiple defaultValue={["Lista de categorías", "Lista de tipos de establecimientos"]}>
        {items}
      </Accordion>
    </Stack>
  )
}
