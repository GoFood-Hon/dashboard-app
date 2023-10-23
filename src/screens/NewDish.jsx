import React from "react"
import BaseLayout from "../components/BaseLayout"
import { Link } from "react-router-dom"
import { Breadcrumbs, Accordion, Grid, Group, Text, rem } from "@mantine/core"
import InputField from "../components/Form/InputField"
import { useForm } from "react-hook-form"
import { inputRequired } from "../utils/inputRules"
import InputTextAreaField from "../components/Form/InputTextAreaField"
import { IconUpload, IconPhoto, IconX } from "@tabler/icons-react"
import { Dropzone, IMAGE_MIME_TYPE } from "@mantine/dropzone"
export default function NewDish() {
  const breadcrumbItems = [
    { title: "Inicio", href: "/" },
    { title: "Menu", href: "/menu" },
    { title: "Platillos", href: "/menu/dishes" },
    { title: "Nuevo platillo", href: "/menu/dishes/newDish" }
  ].map((item, index) => (
    <Link to={item.href} key={index}>
      {item.title}
    </Link>
  ))

  const GeneralInformation = () => {
    return (
      <Grid>
        <Grid.Col span={{ base: 12, md: 6, lg: 6 }}>
          <div className="w-full h-full items-center justify-center flex bg-white rounded-2xl border border-blue-100 p-4">
            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col w-full">
              <InputField
                label="Nombre (Obligatorio)"
                name="dishName"
                register={register}
                rules={inputRequired}
                errors={errors}
                placeholder="Ej. Pollo con papas"
                className="text-black"
              />
              <InputTextAreaField
                label="Descripción (Obligatorio)"
                name="dishDescription"
                rules={inputRequired}
                register={register}
                errors={errors}
                placeholder="Ej. Rico pollo con papas, salsas..."
              />
            </form>
          </div>
        </Grid.Col>
        <Grid.Col span={{ base: 12, md: 6, lg: 6 }}>
          <div className="w-full h-full bg-white rounded-2xl border border-blue-100 p-4">
            <Dropzone
              onDrop={(files) => console.log("accepted files", files)}
              onReject={(files) => console.log("rejected files", files)}
              accept={IMAGE_MIME_TYPE}>
              <Group justify="center" gap="xl" mih={220} style={{ pointerEvents: "none" }}>
                <Dropzone.Accept>
                  <IconUpload style={{ width: rem(52), height: rem(52), color: "var(--mantine-color-blue-6)" }} stroke={1.5} />
                </Dropzone.Accept>
                <Dropzone.Reject>
                  <IconX style={{ width: rem(52), height: rem(52), color: "var(--mantine-color-red-6)" }} stroke={1.5} />
                </Dropzone.Reject>
                <Dropzone.Idle>
                  <IconPhoto style={{ width: rem(52), height: rem(52), color: "var(--mantine-color-dimmed)" }} stroke={1.5} />
                </Dropzone.Idle>

                <div>
                  <Text size="xl" inline>
                    Seleccione una imagen destacada
                  </Text>
                  <Text size="sm" c="dimmed" inline mt={7}>
                    Haga click o arrastre una imagen que sera usada junto con el platillo
                  </Text>
                </div>
              </Group>
            </Dropzone>
          </div>
        </Grid.Col>
      </Grid>
    )
  }
  const groceries = [
    {
      title: "Información general",
      requirement: "Obligatorio",
      description: <GeneralInformation />
    },
    {
      title: "Complementos",
      requirement: "Opcional",
      description:
        "Naturally sweet and potassium-rich fruit. Bananas are a popular choice for their energy-boosting properties and can be enjoyed as a quick snack, added to smoothies, or used in baking."
    },
    {
      title: "Bebidas",
      requirement: "Opcional",
      description:
        "Nutrient-packed green vegetable. Broccoli is packed with vitamins, minerals, and fiber. It has a distinct flavor and can be enjoyed steamed, roasted, or added to stir-fries."
    },
    {
      title: "Extras",
      requirement: "Opcional",
      description:
        "Nutrient-packed green vegetable. Broccoli is packed with vitamins, minerals, and fiber. It has a distinct flavor and can be enjoyed steamed, roasted, or added to stir-fries."
    },
    {
      title: "Pagos",
      requirement: "Obligatorio",
      description:
        "Nutrient-packed green vegetable. Broccoli is packed with vitamins, minerals, and fiber. It has a distinct flavor and can be enjoyed steamed, roasted, or added to stir-fries."
    }
  ]

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm()

  const onSubmit = async () => {}

  const items = groceries.map((item, key) => (
    <Accordion.Item key={key} value={item.title}>
      <Accordion.Control>
        <div className="w-full rounded-lg  flex-row flex items-center bg-white">
          <div className="text-slate-50 text-base font-bold bg-sky-950 rounded-full p-2 w-8 h-8 flex items-center justify-center">
            {key + 1}
          </div>
          <span className="text-sky-950 text-base font-bold  leading-normal ml-4">{item.title}</span>
          <span className="text-sky-950 text-base font-normal ml-1">({item?.requirement})</span>
        </div>
      </Accordion.Control>
      <Accordion.Panel>{item.description}</Accordion.Panel>
    </Accordion.Item>
  ))

  return (
    <BaseLayout>
      <section>
        <div className="flex flex-row justify-between items-center pb-6">
          <div className="flex flex-row gap-x-3 items-center">
            <h1 className="text-white-200 text-2xl font-semibold">Nuevo Platillo</h1>
          </div>
          <div>
            <Breadcrumbs>{breadcrumbItems}</Breadcrumbs>
          </div>
        </div>
      </section>
      <section className="mt-6">
        <Accordion
          variant="separated"
          multiple
          defaultValue={["Información general", "Pagos"]}
          classNames={{
            label: "bg-white fill-white"
          }}>
          {items}
        </Accordion>
      </section>
    </BaseLayout>
  )
}
