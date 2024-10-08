import React, { useState } from "react"
import { MantineProvider, createTheme, Button, Checkbox, Grid, Input, ScrollArea, Paper, Text } from "@mantine/core"
import { IconPlus, IconX, IconArrowNarrowRight } from "@tabler/icons-react"
import { colors } from "../../theme/colors"
import { convertToDecimal, getFormattedHNL } from "../../utils"
import extrasApi from "../../api/extrasApi"
import { showNotification } from "@mantine/notifications"

export const EditAdditionalForm = ({ additional, setAdditional, dishDetails }) => {
  const [newAdditionalTitle, setNewAdditionalTitle] = useState("")
  const [isRequired, setIsRequired] = useState(false)
  const [minRequired, setMinRequired] = useState("")
  const [additionalItem, setAdditionalItem] = useState([
    {
      name: "",
      price: "",
      isFree: false
    }
  ])

  const theme = createTheme({
    cursorType: "pointer"
  })

  const handleNewCategory = () => {
    if (newAdditionalTitle === "") {
      showNotification({
        title: "Error",
        message: "Debes completar todos los campos",
        color: "red",
        duration: 7000
      })
    } else {
      const newItemObject = {
        name: newAdditionalTitle,
        required: isRequired,
        dishId: dishDetails.id,
        requiredMinimum: isRequired ? minRequired : null,
        additionalsDetails: additionalItem?.map((item) => ({
          name: item.name,
          isFree: item.isFree,
          price: convertToDecimal(item.price)
        }))
      }
      setAdditional([...additional, newItemObject])

      setNewAdditionalTitle("")
      setIsRequired(false)
      setMinRequired("")
      setAdditionalItem([
        {
          name: "",
          price: "",
          isFree: false
        }
      ])
    }
  }

  const handleDeleteAdditional = (indexToDelete) => {
    setAdditional((prevAdditionals) => {
      const updatedAdditionals = [...prevAdditionals]
      updatedAdditionals.splice(indexToDelete, 1)
      return updatedAdditionals
    })
  }

  const handleAddItem = () => {
    setAdditionalItem([...additionalItem, { name: "", price: "", isFree: false }])
  }
  const handleDeleteItem = (index) => {
    setAdditionalItem(additionalItem.filter((_, i) => i !== index))
  }

  const handleInputChange = (index, key, value) => {
    const newItems = [...additionalItem]
    newItems[index][key] = value
    setAdditionalItem(newItems)
  }

  const handleIsRequired = () => {
    setIsRequired(!isRequired)
  }

  const handleIsFree = (index, isChecked) => {
    const updatedAdditionalItem = [...additionalItem]
    updatedAdditionalItem[index].isFree = isChecked
    setAdditionalItem(updatedAdditionalItem)
  }

  return (
    <Grid>
      <Grid.Col span={{ base: 12, md: 7 }}>
        <Paper withBorder radius="md" className="w-full h-full p-6  rounded-lg">
          <span className="text-sm font-semibold w-full">Titulo</span>
          <div>
            <Input
              name="title"
              value={newAdditionalTitle}
              onChange={(e) => setNewAdditionalTitle(e.target.value)}
              className="text-black"
            />
            <MantineProvider theme={theme}>
              <Checkbox
                mt={"md"}
                labelPosition="left"
                label={<div className="text-sm font-bold leading-snug">¿Es requerido?</div>}
                color={colors.main_app_color}
                checked={isRequired}
                size="sm"
                className="mb-4"
                onChange={handleIsRequired}
              />
            </MantineProvider>
            {isRequired ? (
              <>
                <span className="text-sm font-semibold w-full">Mínimo requerido</span>
                <Input
                  name="requiredMinimum"
                  value={minRequired}
                  onChange={(e) => setMinRequired(e.target.value)}
                  className="text-black"
                />
              </>
            ) : null}
          </div>
          <Paper withBorder radius="md" className="p-2 my-4 rounded-lg">
            {additionalItem?.map((item, index) => (
              <div key={index}>
                <div className="flex w-full gap-2 my-2 items-center justify-between">
                  <Input
                    name="name"
                    placeholder="Nombre"
                    value={item.name}
                    onChange={(e) => handleInputChange(index, "name", e.target.value)}
                    className="text-black w-full"
                  />
                  <Input
                    name="price"
                    placeholder="Precio"
                    value={item.price}
                    disabled={item.isFree}
                    onChange={(e) => handleInputChange(index, "price", e.target.value)}
                    className="text-black w-full"
                  />

                  <div
                    className="cursor-pointer flex items-center text-red-500 transition ease-in-out duration-200 rounded-full hover:bg-red-500 hover:text-white p-1"
                    onClick={() => handleDeleteItem(index)}>
                    <IconX size={20} />
                  </div>
                </div>
                <Checkbox
                  mt={"md"}
                  labelPosition="left"
                  label={<div className="text-sm font-bold leading-snug">¿Es gratuito?</div>}
                  color={colors.main_app_color}
                  checked={item.isFree}
                  size="sm"
                  className="mb-4"
                  onChange={(e) => {
                    handleIsFree(index, e.target.checked)
                    item.isFree ? handleInputChange(index, "price", "0.00") : handleInputChange(index, "price", "")
                  }}
                />
              </div>
            ))}
            <Button className="my-2" color={colors.main_app_color} leftSection={<IconPlus size={14} />} onClick={handleAddItem}>
              Nuevo
            </Button>
          </Paper>
          <div className="w-full flex items-center justify-end">
            <Button className="" color={colors.main_app_color} leftSection={<IconPlus size={14} />} onClick={handleNewCategory}>
              Añadir adicional
            </Button>
          </div>
        </Paper>
      </Grid.Col>

      <Grid.Col span={{ base: 12, md: 5 }}>
        <Paper withBorder radius="md" className="w-full h-full p-6 rounded-lg ">
          <span className="text-sm font-semibold">Adicionales del platillo:</span>
          <ScrollArea w={"100%"} h={360}>
            <ul>
              {additional?.length > 0 ? (
                additional?.map((category, index) => (
                  <Paper
                    key={index}
                    withBorder
                    radius="md"
                    className="p-2 my-4 rounded-lg flex flex-row justify-between items-center">
                    <article className="w-full">
                      <div className="flex items-center justify-between mb-1">
                        <h3 className="font-bold text-md">
                          {category.name} {category.requiredMinimum ? `(min: ${category.requiredMinimum})` : null}:
                        </h3>
                        <span
                          onClick={() => handleDeleteAdditional(index)}
                          className="cursor-pointer text-red-500 transition ease-in-out duration-200 rounded-full hover:bg-red-500 hover:text-white p-1">
                          <IconX size={20} />
                        </span>
                      </div>

                      <ul className="space-y-2">
                        {category?.additionalsDetails?.map((item, i) => (
                          <li key={i} className="flex flex-row gap-1 items-center">
                            <span>{item.name}</span>
                            <IconArrowNarrowRight />
                            <span className="italic">{item.price == "0.00" ? "Gratis" : getFormattedHNL(item.price)}</span>
                          </li>
                        ))}
                      </ul>
                    </article>
                  </Paper>
                ))
              ) : (
                <Text c="dimmed">Los adicionales se mostrarán aquí</Text>
              )}
            </ul>
          </ScrollArea>
        </Paper>
      </Grid.Col>
    </Grid>
  )
}
