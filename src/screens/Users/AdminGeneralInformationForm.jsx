import { Grid } from "@mantine/core"
import React, { useEffect, useState } from "react"
import toast from "react-hot-toast"
import InputSearchCombobox from "../../components/Form/InputSearchCombobox"
import InputField from "../../components/Form/InputField"
import { colors } from "../../theme/colors"
import restaurantsApi from "../../api/restaurantApi"

export const AdminGeneralInformationForm = ({ register, errors, setValue }) => {
  const [restaurant, setRestaurant] = useState([])
  useEffect(() => {
    ;(async () => {
      try {
        const response = await restaurantsApi.getAllRestaurants()

        if (response.error) {
          toast.error(`Fallo al crear la sucursal. Por favor intente de nuevo. ${response.message}`, {
            duration: 7000
          })
        } else {
          setRestaurant(response?.data)
        }
      } catch (e) {
        toast.error(`Error. Por favor intente de nuevo. ${e}`, {
          duration: 7000
        })
      }
    })()
  }, [])

  return (
    <div className="rounded-2xl border border-blue-100 bg-white p-4 mx-28">
      <Grid justify="center" align="center">
        <Grid.Col span={{ base: 12, md: 6 }}>
          <InputField label="Nombre" name="name" register={register} errors={errors} className="text-black" />
        </Grid.Col>
        <Grid.Col span={{ base: 12, md: 6 }}>
          <InputField label="Email" name="email" register={register} errors={errors} className="text-black" />
        </Grid.Col>
        <Grid.Col span={{ base: 12, md: 12 }}>
          <InputField label="Numero de teléfono" name="phoneNumber" register={register} errors={errors} className="text-black" />
        </Grid.Col>
        <Grid.Col span={{ base: 12 }}>
          <InputSearchCombobox
            label="Asignar a un restaurante"
            name={"restaurantId"}
            placeholder="Buscar restaurante"
            emptyMessage="Sin restaurantes"
            items={restaurant}
            register={register}
            errors={errors}
            setValue={setValue}
            color={colors.primary_button}
          />
        </Grid.Col>
      </Grid>
    </div>
  )
}
