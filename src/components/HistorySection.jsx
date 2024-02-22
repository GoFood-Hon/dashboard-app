import React, { useEffect, useState } from "react"
import { HistoryTable } from "./HistoryTable"
import couponApi from "../api/couponApi"
import toast from "react-hot-toast"
import LoadingCircle from "./LoadingCircle"
import promotionApi from "../api/promotionApi"

export const HistorySection = ({ section }) => {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    setLoading(true)

    const fetchData = async (fetchFunction) => {
      try {
        const res = await fetchFunction()
        setLoading(false)
        if (res.error) {
          toast.error(`Fallo al obtener la información. Por favor intente de nuevo. ${res.message}`, {
            duration: 7000
          })
        } else {
          setData(res.data)
        }
      } catch (error) {
        toast.error(`Fallo al obtener la información. Por favor intente de nuevo. ${error.message}`, {
          duration: 7000
        })
        setLoading(false)
      }
    }

    const fetchCouponHistory = () => fetchData(couponApi.getCoupons)

    const fetchPromosHistory = () => fetchData(promotionApi.getPromotionByRestaurant)

    if (section === "coupons") {
      fetchCouponHistory()
    }

    if (section === "promos") {
      fetchPromosHistory()
    }
  }, [section])

  if (loading) {
    return <LoadingCircle />
  }

  return (
    <div className="w-full">
      {data.map((item, idx) => (
        <div key={idx}>
          <HistoryTable item={item} />
          <hr />
        </div>
      ))}
    </div>
  )
}
