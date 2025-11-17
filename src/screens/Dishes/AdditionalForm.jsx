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
  Stack,
  Group,
  Flex
} from "@mantine/core"
import toast from "react-hot-toast"
import { colors } from "../../theme/colors"
import { convertToDecimal, getFormattedHNL } from "../../utils"
import { IconArrowNarrowRight } from "@tabler/icons-react"
import { additionalSchema } from "../../utils/validationSchemas"

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
  const [errors, setErrors] = useState({})

  const theme = createTheme({
    cursorType: "pointer"
  })

  const handleNewCategory = () => {
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

    const validation = additionalSchema.safeParse(newItemObject)

    if (!validation.success) {
      const fieldErrors = {}
      validation.error.errors.forEach((err) => {
        const field = err.path.join(".")
        fieldErrors[field] = err.message
      })
      setErrors(fieldErrors)
      return
    }

    setErrors({})
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
            <Input.Wrapper label="Titulo" error={errors.name}>
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
              <Input.Wrapper label="Cantidad requerida" error={errors.requiredMinimum}>
                <Input name="requiredMinimum" value={minRequired} onChange={(e) => setMinRequired(e.target.value)} />
              </Input.Wrapper>
            ) : null}
          </div>

          <Paper withBorder radius="md" className="p-2 my-4 rounded-lg">
            {additionalItem?.map((item, index) => (
              <div key={index}>
                <div className="flex w-full gap-2 my-2 items-start justify-between">
                  <div className="w-full gap-2">
                    <Input.Wrapper error={errors[`additionalsDetails.${index}.name`]}>
                      <Input
                        name="name"
                        placeholder="Nombre"
                        value={item.name}
                        disabled={item.isFree}
                        onChange={(e) => handleInputChange(index, "name", e.target.value)}
                      />
                    </Input.Wrapper>
                  </div>

                  <div className="w-full">
                    <Input.Wrapper error={errors[`additionalsDetails.${index}.price`]}>
                      <Input
                        placeholder="Precio"
                        name="price"
                        value={item.price}
                        disabled={item.isFree}
                        onChange={(e) => handleInputChange(index, "price", e.target.value)}
                      />
                    </Input.Wrapper>
                  </div>

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
            {errors.additionalsDetails && (
              <Text c={colors.main_app_color} size="xs">
                {errors.additionalsDetails}
              </Text>
            )}
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
        <Paper withBorder radius="md" p="md" h="100%">
          {additional.length > 0 ? (
            <ScrollArea w="100%" h={435}>
              <Stack gap="xs">
                {additional.map((category, index) => (
                  <Paper key={index} withBorder radius="md" p="md">
                    <Stack gap={5}>
                      <Group justify="space-between" mb="xs">
                        <Text fw={600} size="md">
                          {category.name} {category.requiredMinimum ? `(requiere ${category.requiredMinimum})` : null}
                        </Text>
                        <CloseButton onClick={() => handleDeleteAdditional(index)} />
                      </Group>

                      <Stack gap={5} component="ul">
                        {category.additionalsDetails.map((item, i) => (
                          <Group key={i} component="li" gap={5}>
                            <Text size="sm">{item.name}</Text>
                            <IconArrowNarrowRight size={16} />
                            <Text size="sm" c="dimmed" italic>
                              {item.price === "0.00" ? "Gratis" : getFormattedHNL(item.price)}
                            </Text>
                          </Group>
                        ))}
                      </Stack>
                    </Stack>
                  </Paper>
                ))}
              </Stack>
            </ScrollArea>
          ) : (
            <Flex direction="column" justify="center" align="center" h="100%" w="100%" mih={435} p="md">
              <Text c="dimmed" ta="center">
                Los adicionales se mostrarán aquí
              </Text>
            </Flex>
          )}
        </Paper>
      </Grid.Col>
    </Grid>
  )
}
