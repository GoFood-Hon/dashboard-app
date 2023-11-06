import { useEffect, useRef, useState } from "react"
import { Combobox, useCombobox, Image } from "@mantine/core"
import { IconChevronDown } from "@tabler/icons-react"
import LoadingCircle from "./LoadingCircle"
import { useDispatch, useSelector } from "react-redux"
import { setRestaurant } from "../store/features/restaurantSlice"

export default function RestaurantPicker({ items }) {
  const dispatch = useDispatch()
  const restaurant = useSelector((state) => state.restaurant.value)

  const [selectedItem, setSelectedItem] = useState("")
  const [loading, setLoading] = useState(true)
  const restaurantIdRef = useRef(null)

  const combobox = useCombobox({
    onDropdownClose: () => combobox.resetSelectedOption()
  })

  const options = items.map((item) => (
    <Combobox.Option
      value={item}
      key={item.id}
      selected={restaurantIdRef.current === item}
      ref={() => {
        restaurantIdRef.current = item
      }}>
      {item.name}
    </Combobox.Option>
  ))
  useEffect(() => {
    if (items.length > 0) {
      setLoading(false)
      // si no hay store selecciona por defecto el primer restaurant
      if (Object.keys(restaurant).length === 0) {
        dispatch(setRestaurant(items?.[0]))
        setSelectedItem(items?.[0])
      } else {
        setSelectedItem(restaurant)
      }
    }
  }, [items])

  useEffect(() => {
    // console.log(restaurant, "Rest")
  }, [restaurant])

  const handleComboboxSubmit = (val) => {
    setSelectedItem(val)
    dispatch(setRestaurant(val))

    combobox.closeDropdown()
  }

  return (
    <>
      {loading ? (
        <LoadingCircle />
      ) : (
        <div className="flex flex-row items-center gap-2">
          <Image src={selectedItem.images[0].location} h={50} w={150} fit="contain" />
          <Combobox store={combobox} position="bottom-start" width={250} withArrow onOptionSubmit={handleComboboxSubmit}>
            <Combobox.Target>
              <button onClick={() => combobox.toggleDropdown()}>
                <IconChevronDown color="#d3d7dc" />
              </button>
            </Combobox.Target>
            <Combobox.Dropdown>
              <Combobox.Options>{options}</Combobox.Options>
            </Combobox.Dropdown>
          </Combobox>
        </div>
      )}
    </>
  )
}
