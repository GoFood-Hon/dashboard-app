import React, { useState } from "react"
import { Button, Checkbox, Grid, Input } from "@mantine/core"
import { IconPlus, IconX } from "@tabler/icons-react"
import toast from "react-hot-toast"

import { colors } from "../../theme/colors"
import { convertToDecimal, getFormattedHNL } from "../../utils"
import extrasApi from "../../api/extrasApi"

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

  const handleNewCategory = () => {
    if (newAdditionalTitle === "") {
      toast.error("Complete todos los campos.")
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

  const handleDeleteAdditional = async (index, category) => {
    const additionalId = category?.id

    try {
      const response = await extrasApi.deleteExtra(additionalId)
      if (response.status === 204) {
        toast.success("Adicional eliminado exitosamente!")
        const updatedCategories = [...additional]
        updatedCategories.splice(index, 1)
        setAdditional(updatedCategories)
      } else {
        throw new Error("Error ocurrido durante la eliminación del adicional.")
      }
    } catch (error) {
      toast.error("Se produjo un error al intentar eliminar el adicional. Inténtelo nuevamente.")
    }
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
        <div className="w-full h-full p-6 bg-white rounded-lg border border-blue-100">
          <span className="text-sm font-semibold w-full">Titulo</span>
          <div>
            <Input
              name="title"
              value={newAdditionalTitle}
              onChange={(e) => setNewAdditionalTitle(e.target.value)}
              className="text-black"
            />
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
                <div className="flex flex-row w-full gap-4 my-2 items-center justify-center">
                  <div className="w-2/5">
                    <span className="text-sm font-semibold w-full">Nombre</span>
                    <div>
                      <Input
                        name="name"
                        value={item.name}
                        onChange={(e) => handleInputChange(index, "name", e.target.value)}
                        className="text-black"
                      />
                    </div>
                  </div>
                  <div className="w-2/5">
                    <span className="text-sm font-semibold w-full">Precio</span>
                    <div>
                      <Input
                        name="price"
                        value={item.price}
                        onChange={(e) => handleInputChange(index, "price", e.target.value)}
                        className="text-black"
                      />
                    </div>
                  </div>
                  <div
                    className="w-1/5 cursor-pointer text-red-500 text-center text-md font-semibold"
                    onClick={() => handleDeleteItem(index)}>
                    Eliminar
                  </div>
                </div>
                <Checkbox
                  mt={"md"}
                  labelPosition="left"
                  label={<div className="text-sky-950 text-sm font-bold leading-snug">¿Es gratuito?</div>}
                  color={colors.primary_button}
                  checked={item.isFree}
                  size="sm"
                  className="mb-4"
                  onChange={(e) => handleIsFree(index, e.target.checked)}
                />
              </div>
            ))}
            <Button className="my-2" color={colors.primary_button} leftSection={<IconPlus size={14} />} onClick={handleAddItem}>
              Agregar
            </Button>
          </div>
          <br />
          <Button className="my-2" color={colors.primary_button} leftSection={<IconPlus size={14} />} onClick={handleNewCategory}>
            Crear adicional
          </Button>
        </div>
      </Grid.Col>

      <Grid.Col span={{ base: 12, md: 5 }}>
        <div className="w-full h-full p-6 bg-white rounded-lg border border-blue-100">
          <span className="text-sm font-semibold">Adicionales del platillo:</span>
          <ul>
            {additional?.length > 0 ? (
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
                          <span className="italic">{getFormattedHNL(item.price)} Lps</span>
                        </li>
                      ))}
                    </ul>
                  </article>
                  <span onClick={() => handleDeleteAdditional(index, category)} className="cursor-pointer">
                    <IconX />
                  </span>
                </li>
              ))
            ) : (
              <li className="mt-4 text-gray-300">Sin adicionales</li>
            )}
          </ul>
        </div>
      </Grid.Col>
    </Grid>
  )
}
