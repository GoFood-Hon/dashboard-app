import React, { useState } from "react"
import BaseLayout from "../components/BaseLayout"
import { Link } from "react-router-dom"
import { Breadcrumbs, Accordion, Grid, Group, Text, rem, Input, CloseButton } from "@mantine/core"
import InputField from "../components/Form/InputField"
import { useForm } from "react-hook-form"
import { inputRequired } from "../utils/inputRules"
import InputTextAreaField from "../components/Form/InputTextAreaField"
import { IconUpload, IconPhoto, IconX } from "@tabler/icons-react"
import { Dropzone, IMAGE_MIME_TYPE } from "@mantine/dropzone"
import Button from "../components/Button"

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

  const GeneralInformationForm = () => {
    return (
      <Grid>
        <Grid.Col span={{ base: 12, md: 8, lg: 8 }}>
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
        <Grid.Col span={{ base: 12, md: 4, lg: 4 }}>
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

                <div className="flex items-center flex-col">
                  <Text size="xl" inline className="text-center">
                    Seleccione una imagen destacada
                  </Text>
                  <Text size="sm" c="dimmed" inline mt={7} className="text-center">
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
  const ComplementsForm = () => {
    const [searchComplement, setSearchComplement] = useState("")

    return (
      <Grid>
        <Grid.Col span={{ base: 12, md: 7 }}>
          <div className="w-full h-full p-6 bg-white rounded-lg border border-blue-100">Draggable List</div>
        </Grid.Col>
        <Grid.Col span={{ base: 12, md: 5 }}>
          <div className="w-full h-full p-6 bg-white rounded-lg border border-blue-100">
            <span className="text-sm font-semibold ">Complementos disponibles </span>
            <span className="text-sm">(opcional)</span>
            <div className="my-2">
              <Input
                className="w-full"
                placeholder="Buscar complemento"
                value={searchComplement}
                onChange={(event) => setSearchComplement(event.currentTarget.value)}
                rightSectionPointerEvents="all"
                rightSection={
                  <CloseButton
                    aria-label="Clear input"
                    onClick={() => setSearchComplement("")}
                    style={{ display: searchComplement ? undefined : "none" }}
                  />
                }
              />
            </div>
            <div>
              <div className="w-full p-5 my-3 bg-white rounded-lg border border-blue-100 flex-row justify-between items-center flex text-sm">
                <div className="flex flex-row items-center w-1/2">
                  <img className="w-10 h-10" src="https://via.placeholder.com/40x40" />
                  <span className="text-sky-950 pl-3">Papas</span>
                </div>
                <div className="flex flex-row w-1/2 justify-end">
                  <span className="text-sky-950 pl-3">+ HND 120.00</span>
                </div>
              </div>
            </div>
            <div>
              <div className="w-full p-5 my-3 bg-white rounded-lg border border-blue-100 flex-row justify-between items-center flex text-sm">
                <div className="flex flex-row items-center w-1/2">
                  <img className="w-10 h-10" src="https://via.placeholder.com/40x40" />
                  <span className="text-sky-950 pl-3">Papas Supreme</span>
                </div>
                <div className="flex flex-row w-1/2 justify-end">
                  <span className="text-sky-950 pl-3">+ HND 10.03</span>
                </div>
              </div>
            </div>
            <div>
              <div className="w-full p-5 my-3 bg-white rounded-lg border border-blue-100 flex-row justify-between items-center flex text-sm">
                <div className="flex flex-row items-center w-1/2">
                  <img className="w-10 h-10" src="https://via.placeholder.com/40x40" />
                  <span className="text-sky-950 pl-3">Chilli Cheese</span>
                </div>
                <div className="flex flex-row w-1/2 justify-end">
                  <span className="text-sky-950 pl-3">+ HND 103.23</span>
                </div>
              </div>
            </div>
          </div>
        </Grid.Col>
      </Grid>
    )
  }

  const DrinksForm = () => {
    const [searchComplement, setSearchComplement] = useState("")

    return (
      <Grid>
        <Grid.Col span={{ base: 12, md: 7 }}>
          <div className="w-full h-full p-6 bg-white rounded-lg border border-blue-100">Draggable List</div>
        </Grid.Col>
        <Grid.Col span={{ base: 12, md: 5 }}>
          <div className="w-full h-full p-6 bg-white rounded-lg border border-blue-100">
            <span className="text-sm font-semibold ">Bebidas disponibles </span>
            <span className="text-sm">(opcional)</span>
            <div className="my-2">
              <Input
                className="w-full"
                placeholder="Buscar bebidas"
                value={searchComplement}
                onChange={(event) => setSearchComplement(event.currentTarget.value)}
                rightSectionPointerEvents="all"
                rightSection={
                  <CloseButton
                    aria-label="Clear input"
                    onClick={() => setSearchComplement("")}
                    style={{ display: searchComplement ? undefined : "none" }}
                  />
                }
              />
            </div>
            <div>
              <div className="w-full p-5 my-3 bg-white rounded-lg border border-blue-100 flex-row justify-between items-center flex text-sm">
                <div className="flex flex-row items-center w-1/2">
                  <img className="w-10 h-10" src="https://via.placeholder.com/40x40" />
                  <span className="text-sky-950 pl-3">Coca-cola</span>
                </div>
                <div className="flex flex-row w-1/2 justify-end">
                  <span className="text-sky-950 pl-3">+ HND 120.00</span>
                </div>
              </div>
            </div>
            <div>
              <div className="w-full p-5 my-3 bg-white rounded-lg border border-blue-100 flex-row justify-between items-center flex text-sm">
                <div className="flex flex-row items-center w-1/2">
                  <img className="w-10 h-10" src="https://via.placeholder.com/40x40" />
                  <span className="text-sky-950 pl-3">Lipton</span>
                </div>
                <div className="flex flex-row w-1/2 justify-end">
                  <span className="text-sky-950 pl-3">+ HND 130.03</span>
                </div>
              </div>
            </div>
            <div>
              <div className="w-full p-5 my-3 bg-white rounded-lg border border-blue-100 flex-row justify-between items-center flex text-sm">
                <div className="flex flex-row items-center w-1/2">
                  <img className="w-10 h-10" src="https://via.placeholder.com/40x40" />
                  <span className="text-sky-950 pl-3">Sprite</span>
                </div>
                <div className="flex flex-row w-1/2 justify-end">
                  <span className="text-sky-950 pl-3">+ HND 34.23</span>
                </div>
              </div>
            </div>
          </div>
        </Grid.Col>
      </Grid>
    )
  }

  const ExtrasForm = () => {
    const [searchComplement, setSearchComplement] = useState("")

    return (
      <Grid>
        <Grid.Col span={{ base: 12, md: 7 }}>
          <div className="w-full h-full p-6 bg-white rounded-lg border border-blue-100">Draggable List</div>
        </Grid.Col>
        <Grid.Col span={{ base: 12, md: 5 }}>
          <div className="w-full h-full p-6 bg-white rounded-lg border border-blue-100">
            <span className="text-sm font-semibold ">Extras disponibles </span>
            <span className="text-sm">(opcional)</span>
            <div className="my-2">
              <Input
                className="w-full"
                placeholder="Buscar bebidas"
                value={searchComplement}
                onChange={(event) => setSearchComplement(event.currentTarget.value)}
                rightSectionPointerEvents="all"
                rightSection={
                  <CloseButton
                    aria-label="Clear input"
                    onClick={() => setSearchComplement("")}
                    style={{ display: searchComplement ? undefined : "none" }}
                  />
                }
              />
            </div>
            <div>
              <div className="w-full p-5 my-3 bg-white rounded-lg border border-blue-100 flex-row justify-between items-center flex text-sm">
                <div className="flex flex-row items-center w-1/2">
                  <img className="w-10 h-10" src="https://via.placeholder.com/40x40" />
                  <span className="text-sky-950 pl-3">Salsa barbacoa</span>
                </div>
                <div className="flex flex-row w-1/2 justify-end">
                  <span className="text-sky-950 pl-3">+ HND 120.00</span>
                </div>
              </div>
            </div>
            <div>
              <div className="w-full p-5 my-3 bg-white rounded-lg border border-blue-100 flex-row justify-between items-center flex text-sm">
                <div className="flex flex-row items-center w-1/2">
                  <img className="w-10 h-10" src="https://via.placeholder.com/40x40" />
                  <span className="text-sky-950 pl-3">Salsa jalapeno</span>
                </div>
                <div className="flex flex-row w-1/2 justify-end">
                  <span className="text-sky-950 pl-3">+ HND 130.03</span>
                </div>
              </div>
            </div>
            <div>
              <div className="w-full p-5 my-3 bg-white rounded-lg border border-blue-100 flex-row justify-between items-center flex text-sm">
                <div className="flex flex-row items-center w-1/2">
                  <img className="w-10 h-10" src="https://via.placeholder.com/40x40" />
                  <span className="text-sky-950 pl-3">Slices</span>
                </div>
                <div className="flex flex-row w-1/2 justify-end">
                  <span className="text-sky-950 pl-3">+ HND 34.23</span>
                </div>
              </div>
            </div>
          </div>
        </Grid.Col>
      </Grid>
    )
  }

  const PaymentForm = () => {
    return (
      <Grid className="w-full h-full items-center justify-center flex bg-white rounded-2xl border border-blue-100 p-4">
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-row item-center w-full h-full">
          <Grid.Col span={{ base: 12, md: 6 }}>
            <InputField
              label="Precio inicial"
              name="initialPrice"
              register={register}
              rules={inputRequired}
              errors={errors}
              placeholder="Ej. HND 200.00"
              className="text-black"
            />
          </Grid.Col>
          <Grid.Col span={{ base: 12, md: 6 }}>
            <InputField
              label="Precio final"
              name="finalPrice"
              register={register}
              rules={inputRequired}
              errors={errors}
              placeholder="Ej. HND 150.00"
              className="text-black"
            />
          </Grid.Col>
        </form>
      </Grid>
    )
  }
  const groceries = [
    {
      title: "Información general",
      requirement: "Obligatorio",
      description: <GeneralInformationForm />
    },
    {
      title: "Complementos",
      requirement: "Opcional",
      description: <ComplementsForm />
    },
    {
      title: "Bebidas",
      requirement: "Opcional",
      description: <DrinksForm />
    },
    {
      title: "Extras",
      requirement: "Opcional",
      description: <ExtrasForm />
    },
    {
      title: "Pagos",
      requirement: "Obligatorio",
      description: <PaymentForm />
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
      <section>
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
      <section className="w-full flex flex-row justify-end mt-6 gap-3 rounded-lg bg-white px-4 py-8 border border-gray-100 shadow">
        <div className="w-2/3 flex flex-row gap-2">
          <Button text={"Descartar"} className={"text-xs border border-red-400 text-red-400 bg-white"} />
          <Button text={"Guardar como borrador"} className={"text-xs border bg-white border-sky-950 text-sky-950"} />
          <Button text={"Guardar platillo"} className={"text-xs bg-sky-950 text-slate-50 "} />
        </div>
      </section>
    </BaseLayout>
  )
}
