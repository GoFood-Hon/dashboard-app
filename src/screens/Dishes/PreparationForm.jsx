import React from "react"
import { Grid } from "@mantine/core"

export default function PreparationForm({ errors, setValue }) {
  const preparationTime = [" 5 - 9 minutos", "10 - 19 minutos", "20 - 29 minutos", "+30 minutos"]

  return (
    <Grid className="bg-white rounded-2xl border border-blue-100 p-6">
      <div className="flex flex-row item-center w-full h-full flex-wrap"></div>
    </Grid>
  )
}
