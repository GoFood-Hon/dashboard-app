import React, { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { useDispatch, useSelector } from "react-redux"
import { useLocation, useNavigate } from "react-router-dom"
import { Accordion } from "@mantine/core"
import toast from "react-hot-toast"

import GeneralInformationForm from "./GeneralInformationForm"
import ComplementsForm from "../Dishes/ComplementsForm"
import dishesApi from "../../api/dishesApi"
import Button from "../../components/Button"
import { updateMenu } from "../../store/features/menuSlice"

export default function EditMenuScreen({ itemDetails, close }) {
  const {
    register,
    handleSubmit,
    setValue,
    control,
    reset,
    formState: { errors }
  } = useForm({
    defaultValues: itemDetails
  })

  const dispatch = useDispatch()
  const user = useSelector((state) => state.user.value)

  const restaurant = useSelector((state) => state?.restaurant?.value)
  const [isDataCleared, setIsDataCleared] = useState(false)

  const [dishes, setDishes] = useState([])

  useEffect(() => {
    async function getDishes() {
      try {
        const response = await dishesApi.getAllDishesByRestaurant({
          restaurantId: user.restaurantId
        })
        setDishes(response.data.data)

        return response
      } catch (error) {
        toast.error(`Hubo error obteniendo los extras, ${error}`)
        throw error
      }
    }
    getDishes()
  }, [restaurant])

  const accordionStructure = [
    {
      title: "Información general",
      requirement: "Obligatorio",
      form: (
        <GeneralInformationForm
          register={register}
          errors={errors}
          setValue={setValue}
          control={control}
          isDataCleared={isDataCleared}
        />
      )
    },
    {
      title: "Platillos",
      requirement: "Obligatorio",
      form: (
        <ComplementsForm
          setValue={setValue}
          isDataCleared={isDataCleared}
          defaultMessage="Por favor seleccione platillos para este menu"
          itemsAvailableLabel="Platillos disponibles"
          data={dishes}
          name={"dishes"}
        />
      )
    }
  ]

  const items = accordionStructure.map((item, key) => (
    <Accordion.Item key={key} value={item.title}>
      <Accordion.Control>
        <div className="w-full rounded-lg flex-row flex items-center bg-white">
          <div className="text-slate-50 text-base font-bold bg-sky-950 rounded-full p-2 w-8 h-8 flex items-center justify-center">
            {key + 1}
          </div>
          <span className="text-sky-950 text-base font-bold  leading-normal ml-4">{item.title}</span>
          <span className="text-sky-950 text-base font-normal ml-1">({item?.requirement})</span>
        </div>
      </Accordion.Control>
      <Accordion.Panel>{item.form}</Accordion.Panel>
    </Accordion.Item>
  ))

  const onSubmit = (data) => {
    console.log(data)
    dispatch(updateMenu({ data })).then((response) => {
      reset()
      close()
    })
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <section>
        <div className="flex flex-row justify-between items-center pb-6 flex-wrap xs:gap-3">
          <div className="flex flex-row gap-x-3 items-center">
            <h1 className="text-white-200 md:text-2xl font-semibold">Editar menú</h1>
          </div>
        </div>
      </section>
      <section>
        <Accordion
          variant="separated"
          multiple
          defaultValue={["Información general", "Platillos"]}
          classNames={{
            label: "bg-white fill-white"
          }}>
          {items}
        </Accordion>
      </section>
      <section>
        <div className="w-full flex md:justify-end mt-6 md:gap-3 rounded-md bg-white px-8 py-5 border border-gray-200">
          <div className="md:w-2/3 lg:1/3 sm:w-full flex flex-row justify-end gap-3 sm:flex-wrap md:flex-nowrap">
            <Button
              text={"Descartar"}
              className={"text-xs border border-red-400 text-red-400 bg-white"}
              onClick={() => {
                reset()
                close()
                toast.success("Cambios descartados")
              }}
            />
            <Button
              text={"Actualizar"}
              className="flex h-10 items-center justify-center px-4 rounded-md shadow-sm transition-all duration-700 focus:outline-none text-xs bg-sky-950 text-slate-50"
            />
          </div>
        </div>
      </section>
    </form>
  )
}
