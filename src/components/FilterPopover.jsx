import { Input, NumberInput, Popover, RangeSlider, Select } from "@mantine/core"
import React, { useEffect, useState } from "react"
import { DatePickerInput } from "@mantine/dates"
import { Icon } from "./Icon"
import { colors } from "../theme/colors"
import Button from "./Button"
import { useForm } from "react-hook-form"
import { ErrorMessage } from "./Form/ErrorMessage"
import { useDispatch, useSelector } from "react-redux"
import { setFilters } from "../store/features/DishesSlice"
import toast from "react-hot-toast"

export default function FilterPopover({ onFiltersChange, refreshPage }) {
  const marks = [
    { value: 10, label: "100 HNL" },
    { value: 50, label: "500 HNL" },
    { value: 90, label: "900 HNL" }
  ]
  const MAX_NUMBER_INPUT = 1000

  const dispatch = useDispatch()
  const filters = useSelector((state) => state.dishes.filters)

  const {
    handleSubmit,
    setValue,
    reset,

    formState: { errors, isSubmitSuccessful }
  } = useForm({
    defaultValues: filters
  })

  const [price, setPrice] = useState({ startPrice: 100, endPrice: 700 })

  const onSubmit = (data) => {
    if (isSubmitSuccessful) {
      onFiltersChange(data)
    }
  }

  const handleRangeSliderChange = (val) => {
    setPrice({ startPrice: val[0] * 10, endPrice: val[1] * 10 })
    setValue("startPrice", val[0] * 10)
    setValue("endPrice", val[1] * 10)
  }

  const handleResetFilters = () => {
    refreshPage()
    toast.success("Filtros borrados!")
    reset({ startDate: null, endDate: null, status: "Todos", startPrice: 0, endPrice: 100 })
    dispatch(setFilters({}))
  }

  return (
    <React.Fragment>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Popover width={300} position="bottom" withArrow shadow="md" radius={20} offset={{ mainAxis: 2, crossAxis: -100 }}>
          <Popover.Target>
            <span className="cursor-pointer">
              <Icon icon="setting" size={20} />
            </span>
          </Popover.Target>
          <Popover.Dropdown className="p-0" p={0}>
            <h1 className="p-3 text-sky-950 font-bold pb-3 border-b-[0.50px] border-blue-100">Filtros</h1>
            <section className="border-b-[0.50px] border-blue-100">
              <div className="flex flex-row justify-between p-4 text-sm">
                <p>Rango de fechas</p>
              </div>
              <div className="flex flex-row justify-between text-xs gap-2 p-4 pt-0 border-b-[0.50px] border-blue-100">
                <div className="flex flex-col">
                  <DatePickerInput
                    size="xs"
                    label="Desde"
                    placeholder="Seleccionar fecha"
                    popoverProps={{ withinPortal: false }}
                    onChange={(val) => setValue("startDate", val)}
                  />
                  <ErrorMessage message={errors?.startDate?.message} />
                </div>
                <div className="flex flex-col">
                  <DatePickerInput
                    size="xs"
                    label="Hasta"
                    placeholder="Seleccionar fecha"
                    popoverProps={{ withinPortal: false }}
                    onChange={(val) => setValue("endDate", val)}
                  />
                  <ErrorMessage message={errors?.endDate?.message} />
                </div>
              </div>
            </section>
            <section className="border-b-[0.50px] border-blue-100">
              <div className="flex flex-row justify-between p-4 pb-1 text-sm">
                <p>Estados</p>
              </div>
              <div className="flex flex-col px-4 pt-0">
                <Select
                  size="xs"
                  placeholder="Seleccione estado"
                  comboboxProps={{ withinPortal: false }}
                  data={["Todos", "Habilitado", "Deshabilitado"]}
                  onChange={(val) => setValue("status", val)}
                />
                <ErrorMessage message={errors?.status?.message} />
              </div>
            </section>
            <section className="border-b-[0.50px] border-blue-100">
              <div className="flex flex-row justify-between p-4 pb-1 text-sm">
                <p>Total venta</p>
              </div>
              <div className="p-4 pt-0">
                <div className="flex flex-row gap-2 pb-3">
                  <Input.Wrapper label="Desde" size="12px">
                    <NumberInput
                      max={MAX_NUMBER_INPUT}
                      min={1}
                      value={price.startPrice}
                      placeholder="120.00"
                      allowNegative={false}
                      prefix="L. "
                      leftSection={<Icon icon="money" size={16} />}
                      onChange={(val) => {
                        setValue("startPrice", val)
                        setPrice((prevPrice) => ({ ...prevPrice, startPrice: val }))
                      }}
                    />

                    <ErrorMessage message={errors?.startPrice?.message} />
                  </Input.Wrapper>
                  <Input.Wrapper label="Hasta" size="12px">
                    <NumberInput
                      max={MAX_NUMBER_INPUT}
                      min={10}
                      value={price.endPrice}
                      allowNegative={false}
                      prefix="L. "
                      thousandSeparator
                      placeholder="500.00"
                      leftSection={<Icon icon="money" size={16} />}
                      onChange={(val) => {
                        setValue("endPrice", val)
                        setPrice((prevPrice) => ({ ...prevPrice, endPrice: val }))
                      }}
                    />

                    <ErrorMessage message={errors?.endPrice?.message} />
                  </Input.Wrapper>
                </div>
                <div className="pt-2 pb-4">
                  <RangeSlider
                    label={(value) => `${value * 10} HNL`}
                    defaultValue={[20, 70]}
                    marks={marks}
                    color={colors.primary_button}
                    onChangeEnd={(val) => handleRangeSliderChange(val)}
                  />
                </div>
              </div>
            </section>
            <section>
              <div className="flex flex-row gap-2 p-4">
                <Button
                  text="Borrar Filtros"
                  className="rounded border border-sky-950 justify-center items-center gap-2.5 inline-flex"
                  onClick={() => handleResetFilters()}
                />
                <Button
                  text="Aplicar Filtros"
                  type="submit"
                  className={
                    "bg-primary_button text-white flex h-10 w-full items-center justify-center space-x-3 rounded-md text-sm shadow-sm transition-all duration-700 focus:outline-none dark:bg-slate-900"
                  }
                  onClick={handleSubmit(onSubmit)}
                />
              </div>
            </section>
          </Popover.Dropdown>
        </Popover>
      </form>
    </React.Fragment>
  )
}
