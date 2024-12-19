import React, { useState } from "react"
import {
  MantineProvider,
  createTheme,
  Button,
  Checkbox,
  Grid,
  Input,
  ScrollArea,
  Paper,
  Text,
  CloseButton,
  Stack
} from "@mantine/core"
import toast from "react-hot-toast"
import { colors } from "../../theme/colors"
import { convertToDecimal, getFormattedHNL } from "../../utils"
import { IconArrowNarrowRight } from "@tabler/icons-react"

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
        <Paper withBorder radius="md" className="w-full h-full p-6 rounded-lg">
          <div>
            <Input.Wrapper label="Titulo">
              <Input name="title" value={newAdditionalTitle} onChange={(e) => setNewAdditionalTitle(e.target.value)} />
            </Input.Wrapper>
            <MantineProvider theme={theme}>
              <Checkbox
                mt={"md"}
                labelPosition="left"
                label="¿Es requerido?"
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

                  <CloseButton onClick={() => handleDeleteItem(index)} />
                </div>
                <Checkbox
                  mt={"md"}
                  labelPosition="left"
                  label="¿Es gratuito?"
                  color={colors.main_app_color}
                  checked={item.isFree}
                  size="sm"
                  className="mb-4"
                  onChange={(e) => {
                    handleIsFree(index, e.target.checked)
                    e.target.checked ? handleInputChange(index, "price", "0.00") : handleInputChange(index, "price", "")
                  }}
                />
              </div>
            ))}
            <Button className="my-2" color={colors.main_app_color} onClick={handleAddItem}>
              Nuevo
            </Button>
          </Paper>
          <br />
          <div className="w-full flex items-center justify-end">
            <Button className="" color={colors.main_app_color} onClick={handleNewCategory}>
              Añadir adicional
            </Button>
          </div>
        </Paper>
      </Grid.Col>

      <Grid.Col span={{ base: 12, md: 5 }}>
        <Paper withBorder radius="md" h="100%" p="md">
          <span className="text-sm font-semibold">Adicionales del platillo:</span>
          <ScrollArea w={"100%"} h={360}>
            <Stack gap='xs'>
              {additional.length > 0 ? (
                additional?.map((category, index) => (
                  <Paper key={index} withBorder radius="md" h="100%" p="md">
                    <article className="w-full">
                      <div className="flex items-center justify-between mb-1">
                        <h3 className="font-bold text-md">
                          {category.name} {category.requiredMinimum ? `(min: ${category.requiredMinimum})` : null}:
                        </h3>
                        <CloseButton onClick={() => handleDeleteAdditional(index)} />
                      </div>

                      <ul className="space-y-2">
                        {category?.additionalsDetails?.map((item, i) => (
                          <li key={i} className="flex flex-row gap-1 items-center">
                            <span>{item.name}</span>
                            <IconArrowNarrowRight />
                            <Text c="dimmed" fs="italic">
                              {item.price == "0.00" ? "Gratis" : getFormattedHNL(item.price)}
                            </Text>
                          </li>
                        ))}
                      </ul>
                    </article>
                  </Paper>
                ))
              ) : (
                <Text c="dimmed">Los adicionales se mostrarán aquí</Text>
              )}
            </Stack>
          </ScrollArea>
        </Paper>
      </Grid.Col>
    </Grid>
  )
}
