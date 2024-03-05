import React, { useState } from "react"
import { Button, Grid, Input } from "@mantine/core"
import { IconPlus, IconX } from "@tabler/icons-react"
import toast from "react-hot-toast"

import { colors } from "../../theme/colors"

export const CategoriesForm = () => {
  const [categories, setCategories] = useState([])
  const [newCategoryName, setNewCategoryName] = useState("")

  const handleNewCategory = () => {
    if (newCategoryName !== "") {
      setCategories([...categories, newCategoryName])
    } else {
      toast.error("Agregue un nombre a la categoría.")
    }
    setNewCategoryName("")
  }

  const handleDeleteCategory = (index) => {
    const updatedCategories = [...categories]
    updatedCategories.splice(index, 1)
    setCategories(updatedCategories)
  }

  return (
    <Grid>
      <Grid.Col span={{ base: 12, md: 7 }}>
        <div className="w-full h-full p-6 bg-white rounded-lg border border-blue-100">
          <span className="text-sm font-semibold w-full">Agregar categorías:</span>
          <div className="my-4">
            <Input
              label="Nombre"
              name="name"
              value={newCategoryName}
              onChange={(e) => setNewCategoryName(e.target.value)}
              className="text-black"
            />
          </div>

          <Button color={colors.primary_button} leftSection={<IconPlus size={14} />} onClick={handleNewCategory}>
            Agregar categoría
          </Button>
        </div>
      </Grid.Col>

      <Grid.Col span={{ base: 12, md: 5 }}>
        <div className="w-full h-full p-6 bg-white rounded-lg border border-blue-100">
          <span className="text-sm font-semibold">Categorías del platillo:</span>
          <ul>
            {categories.length > 0 ? (
              categories.map((item, index) => (
                <li
                  className="flex flex-row w-full  justify-between my-2 p-2 pl-6 bg-white rounded-lg border border-blue-100"
                  key={index}>
                  {item}
                  <span onClick={() => handleDeleteCategory(index)} className="cursor-pointer">
                    <IconX />
                  </span>
                </li>
              ))
            ) : (
              <li className="mt-4 text-gray-300">Sin categorías</li>
            )}
          </ul>
        </div>
      </Grid.Col>
    </Grid>
  )
}
