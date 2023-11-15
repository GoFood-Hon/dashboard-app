import React from "react"
import InputCombobox from "../../components/Form/InputCombobox"

export default function PreparationForm({ setValue, errors }) {
  const preparationTime = ["5 - 9 minutos", "10 - 19 minutos", "20 - 29 minutos", "+30 minutos"]

  return (
    <div className="bg-white rounded-2xl border border-blue-100 p-6">
      <div className="flex flex-row item-center w-full h-full flex-wrap">
        <InputCombobox
          items={preparationTime}
          placeholder="Seleccione el tiempo"
          setValue={setValue}
          errors={errors}
          label="Preparación"
          name="preparationTime"
        />
      </div>
    </div>
  )
}
