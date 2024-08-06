import React, { useEffect, useState } from "react"
import { useSelector } from "react-redux"
import { useForm } from "react-hook-form"
import toast from "react-hot-toast"
import { useNavigate } from "react-router-dom"
import { CloseIcon, Grid, Group, Select, Text, rem } from "@mantine/core"
import { DatePickerInput } from "@mantine/dates"
import { Dropzone, IMAGE_MIME_TYPE } from "@mantine/dropzone"
import { IconPhoto } from "@tabler/icons-react"
import { yupResolver } from "@hookform/resolvers/yup"

import { couponsValidationFrom } from "../utils/inputRules"
import InputField from "./Form/InputField"
import { ErrorMessage } from "./Form/ErrorMessage"
import Button from "./Button"
import { SETTING_NAVIGATION_ROUTES } from "../routes"
import couponApi from "../api/couponApi"
import { bytesToMB, capitalizeFirstLetter, convertToDecimal } from "../utils"
import { CouponTypes, DEFAULT_CATEGORY, DEFAULT_COUPON_TYPE, DEFAULT_DISCOUNT_PERCENTAGE } from "../utils/constants"

export const CouponForm = ({ offerData, editing = false }) => {
  const navigate = useNavigate()
  const user = useSelector((state) => state.user.value)

  const initialDiscount = offerData?.percentage ? `${offerData.percentage}%` : DEFAULT_DISCOUNT_PERCENTAGE
  const initialCouponType = offerData?.couponType === "cantidad" ? CouponTypes.AMOUNT : CouponTypes.DATE
  const initialStartDate = offerData?.startDate ? new Date(offerData.startDate) : null
  const initialEndDate = offerData?.endDate ? new Date(offerData.endDate) : null

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

  const discountPercentage = []

  for (let i = 5; i <= 100; i += 5) {
    discountPercentage.push(`${i}%`)
  }

  useEffect(() => {
    setDateComponentMounted(couponType === DEFAULT_COUPON_TYPE)
  }, [couponType])

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors }
  } = useForm({
    defaultValues: offerData,
    resolver: yupResolver(couponsValidationFrom(dateComponentMounted))
  })

  const handleDateChange = (date, type) => {
    setDateRange((prevState) => ({
      ...prevState,
      [type]: date
    }))
    setValue(type === "initialDate" ? "startDate" : "endDate", date)
  }

  const onSubmit = async (data) => {
    if (!editing) {
      try {
        const formData = prepareFormData(data)
        const response = await couponApi.createCoupon(formData)

        handleResponse(response, data)

        return response.data
      } catch (error) {
        handleError(error)
      }
    } else {
      try {
        const formData = prepareFormData(data)
        const response = await couponApi.createCoupon(formData)

        handleResponse(response, data)

        return response.data
      } catch (error) {
        handleError(error)
      }
    }
  }

  const prepareFormData = (data) => {
    const formData = new FormData()

    formData.append("title", data.title)
    formData.append("code", data.code)

    if (discountType === "Porcentual") {
      formData.append("category", "porcentual")
      formData.append("percentage", parseInt(discount))
    } else {
      formData.append("category", "fijo")
      formData.append("amount", convertToDecimal(data.amount))
    }

    if (couponType === "Por fecha") {
      formData.append("couponType", "fecha")
      formData.append("startDate", data.startDate)
      formData.append("endDate", data.endDate)
    } else {
      formData.append("couponType", "cantidad")
      formData.append("timesToUse", data.timesToUse)
    }

    formData.append("restaurantId", user.restaurantId)

    return formData
  }

  const handleResponse = (response, data) => {
    if (response.error) {
      toast.error(`Fallo al crear el cupón. Por favor intente de nuevo. ${response.message}`, {
        duration: 7000
      })
    } else {
      addImage(response.data.id, data)
      navigate(SETTING_NAVIGATION_ROUTES.General.path)
      toast.success("Cupón creado exitosamente", {
        duration: 7000
      })
    }
  }

  const addImage = async (couponId, data) => {
    try {
      const formDataImage = new FormData()
      formDataImage.append("files", data.files[0])
      const addImageResponse = await couponApi.addImage(couponId, formDataImage)

      if (addImageResponse.error) {
        throw new Error(`Fallo al subir la imagen. Por favor intente de nuevo. ${addImageResponse.message}`)
      }
    } catch (error) {
      handleError(error)
    }
  }

  const handleError = (error) => {
    toast.error(`Error. Por favor intente de nuevo. ${error}`, {
      duration: 7000
    })
  }

  const handleDrop = (acceptedFiles) => {
    if (acceptedFiles.length > 0) {
      const [file] = acceptedFiles
      setFileInformation(file)
      setImages(acceptedFiles)
      setValue("files", acceptedFiles)
      toast.success("Archivos aceptados 👍", { duration: 7000 })
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
          <label className="text-sky-950 text-sm font-bold leading-snug">Seleccione una imagen</label>
          <div className="flex flex-col justify-center items-center w-full h-full bg-white rounded-2xl border border-blue-100 p-4 mb-8">
            {previews.length > 0 ? (
              <div className="w-full">
                <Text size="lg" inline className="text-left mb-5">
                  Imagen seleccionada:
                </Text>
                <div className="flex flex-row justify-center items-center rounded-2xl w-full border border-slate-200 my-3">
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
                      Seleccione una imagen destacada
                    </Text>
                    <Text size="sm" c="dimmed" inline mt={7} className="text-center leading-10">
                      Haga click o arrastre una imagen que sera usada junto con la sucursal
                    </Text>
                  </div>
                </Group>
              </Dropzone>
            )}
            {errors.files && <p className="text-red-500 text-center w-full">* Imagen es requerida.</p>}
          </div>
        </Grid.Col>
        <Grid.Col mt={20} span={{ sm: 12 }}>
          <InputField label="Código de cupón" name="code" register={register} errors={errors} />
        </Grid.Col>
        <Grid.Col span={{ sm: 12, md: 6 }}>
          <span className="text-sky-950 text-sm font-bold leading-snug">Tipo de descuento</span>
          <div className="mt-1">
            <Select
              data={["Fijo", "Porcentual"]}
              allowDeselect={false}
              size="md"
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
              <span className="text-sky-950 text-sm font-bold leading-snug">Tipo de descuento</span>
              <div className="mt-1">
                <Select data={discountPercentage} allowDeselect={false} size="md" value={discount} onChange={setDiscount} />
              </div>
            </>
          ) : null}
        </Grid.Col>
        <Grid.Col span={{ sm: 12 }}>
          <span className="text-sky-950 text-sm font-bold leading-snug">Tipo de cupón</span>
          <div className="mt-1">
            <Select
              data={["Por fecha", "Por cantidad de usos"]}
              allowDeselect={false}
              size="md"
              value={couponType}
              onChange={setCouponType}
            />
          </div>
        </Grid.Col>

        {couponType === "Por cantidad de usos" ? (
          <Grid.Col span={{ sm: 12 }}>
            <InputField label="Veces para utilizar" name="timesToUse" register={register} errors={errors} />
          </Grid.Col>
        ) : null}

        {couponType === "Por fecha" && (
          <>
            <Grid.Col span={{ sm: 12, md: 6 }}>
              <DatePickerInput
                size="md"
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
                size="md"
                value={dateRange.endDate}
                label="Fecha final"
                placeholder="Seleccionar fecha"
                popoverProps={{ withinPortal: false }}
                onChange={(val) => handleDateChange(val, "endDate")}
              />
              <ErrorMessage message={errors?.endDate?.message} />
            </Grid.Col>
          </>
        )}
      </Grid>
      <div className="w-full flex flex-row gap-2 pt-4">
        <Button
          text={"Descartar"}
          className={"text-xs border border-red-400 text-red-400 bg-white"}
          onClick={() => navigate(SETTING_NAVIGATION_ROUTES.General.path)}
        />
        <Button
          text={"Guardar"}
          className="flex h-10 items-center justify-center px-4 rounded-md shadow-sm transition-all duration-700 focus:outline-none text-xs bg-sky-950 text-slate-50"
        />
      </div>
    </form>
  )
}
