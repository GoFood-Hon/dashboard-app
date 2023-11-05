import { Image } from "@mantine/core"
import React from "react"
import { UserLoveIcon } from "../assets/icons/UserLoveIcon"
import { UserSearchIcon } from "../assets/icons/UserSearchIcon"
import { UserPromotionIcon } from "../assets/icons/PromotionUserIcon"
import { getFormattedHNL } from "../utils"
import { useNavigate } from "react-router-dom"
import { NAVIGATION_ROUTES } from "../routes"

export default function ItemCard({ item, navigation }) {
  const { id, active = true, name, images, price, isUserSearch, isUserLove, isPromotion } = item
  const navigate = useNavigate()

  const handleClick = () => {
    if (navigation) {
      navigate(`${NAVIGATION_ROUTES.Menu.submenu.Dishes.path}/${id}`)
    }
  }

  return (
    <div
      className="w-full h-full px-6 py-3 bg-white rounded-2xl border border-blue-100 flex-col justify-between items-center inline-flex cursor-pointer"
      onClick={handleClick}>
      <div className="flex flex-col justify-between items-center">
        {active ? (
          <div className="text-emerald-400 px-4 py-1 rounded-2xl justify-center items-center bg-green-100 my-3">Habilitado</div>
        ) : (
          <div className="bg-rose-100 text-red-400 px-4 py-1 rounded-2xl justify-center items-center my-3">Deshabilitado</div>
        )}
      </div>
      {images && <Image h={"auto"} w="full" fit="contain" src={images[0]?.location} alt={name} radius={"xl"} />}
      <div className="flex flex-row justify-between w-full">
        <div className="flex-col items-start gap-2 flex w-full pt-3">
          <div className="text-sky-950 text-base font-bold">{name}</div>
          <div className="text-right text-sky-950 text-base font-medium">{getFormattedHNL(price)}</div>
        </div>
        <div className="flex flex-row w-full items-center justify-end gap-2">
          {isUserLove && <UserLoveIcon width={"25px"} height={"25px"} />}
          {isUserSearch && <UserSearchIcon width={"25px"} height={"25px"} />}
          {isPromotion && <UserPromotionIcon width={"25px"} height={"25px"} />}
        </div>
      </div>
    </div>
  )
}
