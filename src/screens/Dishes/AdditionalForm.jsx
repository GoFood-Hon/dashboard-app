import React, { useState } from "react"
import { MantineProvider, createTheme, Button, Checkbox, Grid, Input, ScrollArea } from "@mantine/core"
import { IconPlus, IconX } from "@tabler/icons-react"
import toast from "react-hot-toast"
import { colors } from "../../theme/colors"
import { convertToDecimal } from "../../utils"

export const AdditionalForm = ({ additional, setAdditional }) => {
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
      toast.error("Complete todos los campos.")
    } else {
      const newItemObject = {
        name: newAdditionalTitle,
        required: isRequired,
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

  const handleDeleteAdditional = (index) => {
    const updatedCategories = [...additional]
    updatedCategories.splice(index, 1)
    setAdditional(updatedCategories)
  }

  const handleAddItem = () => {
    setAdditionalItem([...additionalItem, { name: "", price: "", isFree: "" }])
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
        <div className="w-full h-full p-6 bg-white rounded-lg border border-blue-100">
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
                label={<div className="text-sky-950 text-sm font-bold leading-snug">¿Es requerido?</div>}
                color={colors.primary_button}
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
          <div className="p-2 my-4 bg-white rounded-lg border border-blue-100">
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
                  label={<div className="text-sky-950 text-sm font-bold leading-snug ">¿Es gratuito?</div>}
                  color={colors.primary_button}
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
            <Button className="my-2" color={colors.primary_button} leftSection={<IconPlus size={14} />} onClick={handleAddItem}>
              Nuevo
            </Button>
          </div>
          <br />
          <div className="w-full flex items-center justify-end">
            <Button className="" color={colors.primary_button} leftSection={<IconPlus size={14} />} onClick={handleNewCategory}>
              Añadir adicional
            </Button>
          </div>
        </div>
      </Grid.Col>

      <Grid.Col span={{ base: 12, md: 5 }}>
        <div className="w-full h-full p-6 bg-white rounded-lg border border-blue-100">
          <span className="text-sm font-semibold">Adicionales del platillo:</span>
          <ScrollArea w={"100%"} h={360}>
            <ul>
              {additional.length > 0 ? (
                additional?.map((category, index) => (
                  <li
                    key={index}
                    className="p-2 my-4 bg-white rounded-lg border border-blue-100 flex flex-row justify-between items-center">
                    <article>
                      <h3 className="font-bold text-lg">
                        {category.name} {category.requiredMinimum ? `(min: ${category.requiredMinimum})` : null}:
                      </h3>

                      <ul>
                        {category?.additionalsDetails?.map((item, i) => (
                          <li key={i} className="flex flex-row gap-6">
                            <span>{item.name}</span>
                            <span className="italic">{item.price} Lps</span>
                          </li>
                        ))}
                      </ul>
                    </article>
                    <span
                      onClick={() => handleDeleteAdditional(additional)}
                      className="cursor-pointer text-red-500 transition ease-in-out duration-200 rounded-full hover:bg-red-500 hover:text-white p-1">
                      <IconX size={20} />
                    </span>
                  </li>
                ))
              ) : (
                <li className="mt-4 text-gray-300">Los adicionales se mostrarán aquí</li>
              )}
            </ul>
          </ScrollArea>
        </div>
      </Grid.Col>
    </Grid>
  )
}
