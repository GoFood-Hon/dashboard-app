import React from "react"
import { CouponForm } from "./CouponForm"
import { PromotionForm } from "./PromotionForm"

export const EditOfferForm = ({ section, item }) => {
  return (
    <div>
      <section>
        <div className="flex flex-row justify-between items-center flex-wrap xs:gap-3">
          <div className="flex flex-row gap-x-3 items-center">
            <h1 className="text-white-200 md:text-2xl font-semibold">Editar {section}</h1>
          </div>
        </div>
      </section>
      {section === "Cupones" ? <CouponForm offerData={item} editing={true} /> : <PromotionForm offerData={item} editing={true} />}
    </div>
  )
}
