import { Grid } from "@mantine/core"
import React from "react"

export const CouponsHistory = () => {
  return (
    <div>
      <Grid my={20} align="center">
        <Grid.Col span={{ sm: 3 }}>
          <div className="flex flex-col">
            <span>NAVIDAD2023</span>
            <div className="flex flex-row gap-3">
              <span>13 julio, 2024</span>
              <span>23 agosto, 2024</span>
            </div>
          </div>
        </Grid.Col>
        <Grid.Col span={{ sm: 12, md: 3 }}>
          <span>6 Dias</span>
        </Grid.Col>
        <Grid.Col span={{ sm: 12, md: 3 }}>
          <div className="flex gap-2">
            <span>Cupón</span>
            <span>Activo</span>
          </div>
        </Grid.Col>
        <Grid.Col span={{ sm: 12, md: 3 }}>
          <div className="flex gap-2">
            <span>Ver detalles</span>
          </div>
        </Grid.Col>
      </Grid>
    </div>
  )
}
