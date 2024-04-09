import React, { useEffect, useState } from "react"
import { CloseIcon, Grid, Group, Select, Text, rem } from "@mantine/core"
import { DatePickerInput } from "@mantine/dates"
import { useSelector } from "react-redux"
import { yupResolver } from "@hookform/resolvers/yup"
import { useForm } from "react-hook-form"
import toast from "react-hot-toast"
import { useNavigate } from "react-router-dom"

import { couponsValidationFrom } from "../utils/inputRules"
import InputField from "./Form/InputField"
import { ErrorMessage } from "./Form/ErrorMessage"
import Button from "./Button"
import { SETTING_NAVIGATION_ROUTES } from "../routes"
import couponApi from "../api/couponApi"
import { bytesToMB, convertToDecimal } from "../utils"
import { Dropzone, IMAGE_MIME_TYPE } from "@mantine/dropzone"
import { IconPhoto } from "@tabler/icons-react"

export const CouponForm = ({ offerData }) => {
  const navigate = useNavigate()
  const user = useSelector((state) => state.user.value)

  const initialDiscount = offerData && offerData?.percentage ? `${offerData.percentage.toString()}%` : "5%"
  const initialCouponType = offerData && offerData.couponType === "cantidad" ? "Por cantidad de usos" : "Por fecha"
  const initialStartDate = offerData && offerData.startDate ? new Date(offerData.startDate) : null
  const initialEndDate = offerData && offerData.endDate ? new Date(offerData.endDate) : null

  const [discountType, setDiscountType] = useState(
    offerData?.category ? offerData.category.charAt(0).toUpperCase() + offerData.category.slice(1) : "Porcentual"
  )
  const [discount, setDiscount] = useState(initialDiscount)
  const [couponType, setCouponType] = useState(initialCouponType)
  const [dateComponentMounted, setDateComponentMounted] = useState(false)
  const [images, setImages] = useState([])
  const [fileInformation, setFileInformation] = useState(null)
  const [initialDate, setInitialDate] = useState(initialStartDate || new Date())
  const [endDate, setEndDate] = useState(initialEndDate || new Date())

  const discountPercentage = []

  for (let i = 5; i <= 100; i += 5) {
    discountPercentage.push(`${i}%`)
  }

  useEffect(() => {
    setDateComponentMounted(couponType === "Por fecha")
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

  const onSubmit = async (data) => {
    try {
      const formData = new FormData()

      formData.append("title", data.title)
      formData.append("code", data.code)

      if (discountType === "Porcentual") {
        formData.append("category", "porcentual")
        formData.append("percentage", 10)
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

      const response = await couponApi.createCoupon(formData)

      if (response.error) {
        toast.error(`Fallo al crear el cupón. Por favor intente de nuevo. ${response.message}`, {
          duration: 7000
        })
      } else {
        const formDataImage = new FormData()
        formDataImage.append("files", data.files[0])

        const addImageResponse = await couponApi.addImage(response.data.id, formDataImage)

        if (addImageResponse.error) {
          throw new Error(`Fallo al subir la imagen. Por favor intente de nuevo. ${addImageResponse.message}`)
        }
        navigate(SETTING_NAVIGATION_ROUTES.General.path)

        toast.success("Cupón creado exitosamente", {
          duration: 7000
        })
      }
      return response.data
    } catch (error) {
      toast.error(`Error. Por favor intente de nuevo. ${error}`, {
        duration: 7000
      })
    }
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

        {couponType === "Por fecha" ? (
          <>
            <Grid.Col span={{ sm: 12, md: 6 }}>
              <DatePickerInput
                size="md"
                value={initialDate}
                label="Fecha inicial"
                placeholder="Seleccionar fecha"
                popoverProps={{ withinPortal: false }}
                onChange={(val) => {
                  setInitialDate(val)
                  setValue("startDate", val)
                }}
              />
              <ErrorMessage message={errors?.startDate?.message} />
            </Grid.Col>
            <Grid.Col span={{ sm: 12, md: 6 }}>
              <DatePickerInput
                size="md"
                value={endDate}
                label="Fecha final"
                placeholder="Seleccionar fecha"
                popoverProps={{ withinPortal: false }}
                onChange={(val) => {
                  setEndDate(val)
                  setValue("endDate", val)
                }}
              />
              <ErrorMessage message={errors?.startDate?.message} />
            </Grid.Col>
          </>
        ) : null}
      </Grid>
      <div className="w-full flex flex-row gap-2 pt-4">
        <Button
          text={"Descartar"}
          className={"text-xs border border-red-400 text-red-400 bg-white"}
          onClick={() => navigate(SETTING_NAVIGATION_ROUTES.General.path)}
        />
        <Button
          text={"Guardar Cambios"}
          className="flex h-10 w-full items-center justify-center px-4 rounded-md shadow-sm transition-all duration-700 focus:outline-none text-xs bg-sky-950 text-slate-50"
        />
      </div>
    </form>
  )
}
