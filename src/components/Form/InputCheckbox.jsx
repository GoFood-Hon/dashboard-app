import React from "react"

export default function InputCheckbox({ label, name, register }) {
  return (
    <React.Fragment>
      <div className="flex flex-row justify-start">
        <label className="text-slate-400 mr-3">{label}</label>
        <input type="checkbox" {...register(name)} />
      </div>
    </React.Fragment>
  )
}
