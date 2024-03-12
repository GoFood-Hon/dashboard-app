import React from "react"
import { InputComboboxSelected } from "../../components/Form/InputComboboxSelected"
import { preparationTime } from "../../utils/constants"

export default function PreparationForm({ setValue, register }) {
  return (
    <div className="bg-white rounded-2xl border border-blue-100 p-6">
      <InputComboboxSelected
        items={preparationTime}
        setValue={setValue}
        register={register}
        label={"Preparación"}
        name={"preparationTime"}
      />
    </div>
  )
}
