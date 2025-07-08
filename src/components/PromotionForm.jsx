import React, { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useForm } from "react-hook-form"
import toast from "react-hot-toast"
import { useNavigate } from "react-router-dom"
import { CloseIcon, Flex, Grid, Group, MultiSelect, Paper, Select, Text, rem, Button } from "@mantine/core"
import { DatePickerInput } from "@mantine/dates"
import { Dropzone, IMAGE_MIME_TYPE } from "@mantine/dropzone"
import { IconPhoto } from "@tabler/icons-react"
import { yupResolver } from "@hookform/resolvers/yup"
import InputField from "./Form/InputField"
import { ErrorMessage } from "./Form/ErrorMessage"
import { promotionValidationFrom } from "../utils/inputRules"
import { fetchDishes, selectAllDishes } from "../store/features/dishesSlice"
import promotionApi from "../api/promotionApi"
import { bytesToMB, capitalizeFirstLetter, convertToDecimal } from "../utils"
import { SETTING_NAVIGATION_ROUTES } from "../routes"
import { CouponTypes, DEFAULT_CATEGORY, DEFAULT_COUPON_TYPE, DEFAULT_DISCOUNT_PERCENTAGE } from "../utils/constants"
import { colors } from "../theme/colors"

export const PromotionForm = ({ offerData }) => {
  const user = useSelector((state) => state.user.value)
  const navigate = useNavigate()
  const dishes = useSelector(selectAllDishes)
  const dispatch = useDispatch()

  const filters = useSelector((state) => state.dishes.filters)
  const limit = useSelector((state) => state.dishes.itemsPerPage)
  const page = useSelector((state) => state.dishes.currentPage)

  const initialDiscount = offerData?.percentage ? `${offerData.percentage}%` : DEFAULT_DISCOUNT_PERCENTAGE
  const initialCouponType = offerData?.couponType === "cantidad" ? CouponTypes.AMOUNT : CouponTypes.DATE
  const initialStartDate = offerData?.startDate ? new Date(offerData.startDate) : null
  const initialEndDate = offerData?.endDate ? new Date(offerData.endDate) : null

  const [availabilityDiscount, setAvailabilityDiscount] = useState("En todos los productos")
  const [dishesAdded, setDishesAdded] = useState([])
  const [discountType, setDiscountType] = useState(
    offerData?.category ? capitalizeFirstLetter(offerData.category) : DEFAULT_CATEGORY
  )
  const [discount, setDiscount] = useState(initialDiscount)
  const [couponType, setCouponType] = useState(initialCouponType)
  const [dateComponentMounted, setDateComponentMounted] = useState(false)
  const [images, setImages] = useState([])
  const [fileInformation, setFileInformation] = useState(null)
  const [dateRange, setDateRange] = useState({
    initialDate: initialStartDate || new Date(),
    endDate: initialEndDate || new Date()
  })
  const [isLoading, setIsLoading] = useState(false)
  const discountPercentage = []

  for (let i = 5; i <= 100; i += 5) {
    discountPercentage.push(`${i}%`)
  }

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors }
  } = useForm({
    defaultValues: offerData,
    resolver: yupResolver(promotionValidationFrom(true))
  })

  useEffect(() => {
    setDateComponentMounted(couponType === DEFAULT_COUPON_TYPE)
  }, [couponType])

  const handleDateChange = (date, type) => {
    setDateRange((prevState) => ({
      ...prevState,
      [type]: date
    }))
    setValue(type === "initialDate" ? "startDate" : "endDate", date)
  }

  const buildPromotionFormData = (data, discountType, availabilityDiscount, user) => {
    const formData = new FormData()
    formData.append("title", data.title)

    if (discountType === "Porcentual") {
      formData.append("category", "porcentual")
      formData.append("percentage", parseInt(discount))
    } else {
      formData.append("category", "fijo")
      formData.append("amount", convertToDecimal(data.amount))
    }

    formData.append("startDate", data.startDate)
    formData.append("endDate", data.endDate)

    formData.append("minPurchase", convertToDecimal(data.minPurchase))
    formData.append("allDishes", availabilityDiscount === "En todos los productos")

    formData.append("restaurantId", user.restaurantId)

    return formData
  }

  const buildDishesFormData = (dishesAdded) => {
    const dishesFormData = new FormData()
    dishesAdded?.forEach((dishId) => {
      dishesFormData.append("dishes[]", dishId)
    })
    return dishesFormData
  }

  const onSubmit = async (data) => {
    setIsLoading(true)
    try {
      const promotionFormData = buildPromotionFormData(data, discountType, availabilityDiscount, user)
      const response = await promotionApi.createOffer(promotionFormData)

      if (response.error) {
        throw new Error(`Fallo al crear la promoción. Por favor intente de nuevo. ${response.message}`)
      }

      const formDataImage = new FormData()
      formDataImage.append("files", data.files[0])

      const addImageResponse = await promotionApi.addImage(response.data.id, formDataImage)

      if (addImageResponse.error) {
        throw new Error(`Fallo al subir la imagen. Por favor intente de nuevo. ${addImageResponse.message}`)
      }

      if (availabilityDiscount === "Seleccionar productos") {
        const dishesFormData = buildDishesFormData(dishesAdded)
        const res = await promotionApi.addDishesToOffer(dishesFormData, response.data.id)

        if (res.error) {
          throw new Error(`Fallo al agregar los productos a la promoción. Por favor intente de nuevo. ${response.message}`)
        }
      }

      navigate(SETTING_NAVIGATION_ROUTES.General.path)
      toast.success("Promoción creada exitosamente", {
        duration: 7000
      })

      setIsLoading(false)
      return response.data
    } catch (error) {
      toast.error(`Error. Por favor intente de nuevo. ${error}`, {
        duration: 7000
      })
      setIsLoading(false)
    }
  }

  useEffect(() => {
    dispatch(
      fetchDishes({
        limit,
        page,
        order: "DESC",
        restaurantId: user.restaurantId,
        filters
      })
    )
  }, [availabilityDiscount])

  const handleDrop = (acceptedFiles) => {
    if (acceptedFiles.length > 0) {
      const [file] = acceptedFiles
      setFileInformation(file)
      setImages(acceptedFiles)
      setValue("files", acceptedFiles)
    }
  }

  const deleteImage = () => {
    setFileInformation(null)
    setImages([])
  }

  const previews = images.map((file, index) => {
    const imageUrl = URL.createObjectURL(file)
    return (
      <img
        key={index}
        src={imageUrl}
        onLoad={() => URL.revokeObjectURL(imageUrl)}
        className="h-14 w-14 rounded-xl object-cover object-center border m-1"
      />
    )
  })

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Grid my={20}>
        <Grid.Col span={{ sm: 12 }}>
          <InputField label="Titulo" name="title" register={register} errors={errors} />
        </Grid.Col>
        <Grid.Col span={{ base: 12 }}>
          <label className="text-sm font-bold leading-snug">Seleccione una imagen</label>
          <Paper withBorder radius="md" p="md">
            {previews.length > 0 ? (
              <div className="w-full">
                <Text size="lg" inline className="text-left mb-5">
                  Imagen seleccionada:
                </Text>
                <div className="flex flex-row justify-center items-center rounded-2xl w-full my-3">
                  <div className="flex flex-row w-full items-center gap-2 flex-wrap p-2">
                    {previews}
                    <div className="flex flex-col">
                      <Text className="font-semibold italic">{fileInformation?.name}</Text>
                      <Text className="font-semibold" size="sm" c="dimmed" inline>
                        {bytesToMB(fileInformation?.size)} MB
                      </Text>
                    </div>
                  </div>
                  <button onClick={deleteImage} className="pr-3">
                    <CloseIcon size={24} />
                  </button>
                </div>
              </div>
            ) : (
              <Dropzone onDrop={handleDrop} accept={IMAGE_MIME_TYPE}>
                <Group justify="center" gap="xl" mih={220} style={{ pointerEvents: "none" }}>
                  <div className="flex items-center flex-col">
                    <IconPhoto style={{ width: rem(52), height: rem(52), color: "var(--mantine-color-dimmed)" }} stroke={1.5} />
                    <Text size="xl" inline className="text-center">
                      Seleccione una imagen
                    </Text>
                    <Text size="sm" c="dimmed" inline mt={7} className="text-center leading-10">
                      Haga click o arrastre la imagen de la promoción
                    </Text>
                  </div>
                </Group>
              </Dropzone>
            )}
            {errors.files && <p className="text-red-500 text-center w-full">* Imagen es requerida.</p>}
          </Paper>
        </Grid.Col>
        <Grid.Col mt={20} span={{ sm: 12 }}>
          <span className="text-sm font-bold leading-snug">Disponibilidad de la promoción</span>
          <Select
            data={["En todos los productos", "Seleccionar productos"]}
            allowDeselect={false}
            value={availabilityDiscount}
            onChange={setAvailabilityDiscount}
          />
        </Grid.Col>
        {availabilityDiscount === "Seleccionar productos" ? (
          <Grid.Col span={{ sm: 12 }}>
            <span className="text-sm font-bold leading-snug">Productos disponibles</span>
            <div className="mt-1">
              <MultiSelect
                placeholder="Seleccione los productos"
                value={dishesAdded}
                onChange={setDishesAdded}
                data={dishes.map((item) => ({ label: item.name, value: item.id }))}
              />
            </div>
          </Grid.Col>
        ) : null}
        <Grid.Col span={{ sm: 12, md: 6 }}>
          <span className="text-sm font-bold leading-snug">Tipo de descuento</span>
          <div className="mt-1">
            <Select
              data={["Fijo", "Porcentual"]}
              allowDeselect={false}
              value={discountType}
              onChange={setDiscountType}
            />
          </div>
        </Grid.Col>
        <Grid.Col span={{ sm: 12, md: 6 }}>
          {discountType === "Fijo" ? (
            <div className="">
              <InputField label="Valor del descuento" name="amount" register={register} errors={errors} />
            </div>
          ) : discountType === "Porcentual" ? (
            <>
              <span className="text-sm font-bold leading-snug">Tipo de descuento</span>
              <div className="mt-1">
                <Select data={discountPercentage} allowDeselect={false} value={discount} onChange={setDiscount} />
              </div>
            </>
          ) : null}
        </Grid.Col>
        <Grid.Col span={{ sm: 12, md: 6 }}>
          <DatePickerInput
            value={dateRange.initialDate}
            label="Fecha inicial"
            placeholder="Seleccionar fecha"
            popoverProps={{ withinPortal: false }}
            onChange={(val) => handleDateChange(val, "initialDate")}
          />
          <ErrorMessage message={errors?.startDate?.message} />
        </Grid.Col>
        <Grid.Col span={{ sm: 12, md: 6 }}>
          <DatePickerInput
            value={dateRange.endDate}
            label="Fecha final"
            placeholder="Seleccionar fecha"
            popoverProps={{ withinPortal: false }}
            onChange={(val) => handleDateChange(val, "endDate")}
          />
          <ErrorMessage message={errors?.startDate?.message} />
        </Grid.Col>

        <Grid.Col span={{ sm: 12 }}>
          <InputField label="Compra minima" name="minPurchase" register={register} errors={errors} />
          <ErrorMessage message={errors?.minPurchase?.message} />
        </Grid.Col>
      </Grid>
      <section className="mt-2">
        <Paper radius="md">
          <Flex justify="end" gap="xs">
            <Button
              color={colors.main_app_color}
              variant="outline"
              onClick={() => navigate(SETTING_NAVIGATION_ROUTES.General.path)}>
              Descartar
            </Button>
            <Button loading={isLoading} color={colors.main_app_color} type="submit">
              Guardar
            </Button>
          </Flex>
        </Paper>
      </section>
    </form>
  )
}
