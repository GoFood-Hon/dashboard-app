import React from "react"
import BaseLayout from "../components/BaseLayout"
import { useParams } from "react-router-dom"

export default function DishDetails() {
  const { dishId } = useParams()
  return (
    <BaseLayout>
      <div>DishDetails</div>
      <p>Dish ID: {dishId}</p>
    </BaseLayout>
  )
}
