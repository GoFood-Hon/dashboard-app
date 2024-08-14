import { Checkbox, Image } from "@mantine/core"
import React from "react"
import { UserLoveIcon } from "../assets/icons/UserLoveIcon"
import { UserSearchIcon } from "../assets/icons/UserSearchIcon"
import { UserPromotionIcon } from "../assets/icons/PromotionUserIcon"
import { getFormattedHNL } from "../utils"
import { colors } from "../theme/colors"

export default function ItemCard({ item, cardsSelected, handleChangeSelected, handleClick }) {
  const { id, isActive, active, name, images, price, isUserSearch, isUserLove, isPromotion, description } = item

  const checked = cardsSelected.includes(id)

  return (
    <div
      className={`w-full h-full px-6 py-3 rounded-2xl border border-blue-100 flex-col justify-start items-center inline-flex `}
      style={{ backgroundColor: `${checked ? colors.selected_card : colors.light_bg_child}` }}>
      <div className="flex flex-row justify-end w-full">
        <Checkbox checked={checked} size="sm" onChange={() => handleChangeSelected(id)} />
      </div>
      <div onClick={() => handleClick(id)} className="cursor-pointer w-full flex flex-col items-center justify-between h-full">
        {isActive || active ? (
          <div className="text-emerald-400 px-4 py-1 rounded-2xl justify-center items-center bg-green-100 my-3">Habilitado</div>
        ) : (
          <div className="bg-rose-100 text-red-400 px-4 py-1 rounded-2xl justify-center items-center my-3">Deshabilitado</div>
        )}

        <Image
          h={"auto"}
          w={"full"}
          fit="contain"
          src={images?.[0]?.location}
          alt={name}
          radius={"xl"}
          fallbackSrc="https://placehold.co/600x400?text=Imagen+no+disponible"
        />

        <div className="flex flex-row justify-between w-full">
          <div className="flex-col items-start gap-2 flex w-full pt-3">
            <div className="text-sky-950 text-base font-bold">{name}</div>
            <div className="text-right text-sky-950 text-base font-medium">{price ? getFormattedHNL(price) : ""}</div>
          </div>
          <div className="flex flex-row w-full items-center justify-end gap-2">
            {isUserLove && <UserLoveIcon width={"25px"} height={"25px"} />}
            {isUserSearch && <UserSearchIcon width={"25px"} height={"25px"} />}
            {isPromotion && <UserPromotionIcon width={"25px"} height={"25px"} />}
          </div>
        </div>
      </div>
    </div>
  )
}
