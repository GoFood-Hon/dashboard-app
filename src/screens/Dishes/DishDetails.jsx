import React, { useEffect, useState } from "react"
import BaseLayout from "../../components/BaseLayout"
import { useLocation, useParams } from "react-router-dom"
import BreadCrumbNavigation from "../../components/BreadCrumbNavigation"
import { Breadcrumbs, Card, Grid, Image, Modal, Paper, Text } from "@mantine/core"
import dishesApi from "../../api/dishesApi"
import { getFormattedHNL } from "../../utils"
import { IconCamera, IconEdit } from "@tabler/icons-react"
import { useDisclosure } from "@mantine/hooks"
import DashboardCard from "../../components/DashboardCard"
import EditDishScreen from "./EditDishScreen"
import BackButton from "./components/BackButton"
import { useSelector } from "react-redux"
import { APP_ROLES, dashboardCards } from "../../utils/constants"
import { IconArrowNarrowRight } from "@tabler/icons-react"

export default function DishDetails() {
  const user = useSelector((state) => state.user.value)
  const { dishId } = useParams()
  const restaurant = useSelector((state) => state.restaurants.restaurants)
  const [imageModalOpened, { open: openImageModal, close: closeImageModal }] = useDisclosure(false)
  const [formModalOpened, { open: openFormModal, close: closeFormModal }] = useDisclosure(false)
  const [dishDetails, setDishDetails] = useState({})

  useEffect(() => {
    const fetchDish = async () => {
      try {
        const response = await dishesApi.getDish(dishId)
        const details = response?.data
        setDishDetails(details)
      } catch (error) {
        dispatch(setError("Error fetching dishes"))
        throw error
      }
    }
    fetchDish()
  }, [closeFormModal, formModalOpened])

  return (
    <>
      <section>
        <div className="flex flex-row justify-between items-center pb-6">
          <BackButton title={dishDetails?.name} show />
        </div>
      </section>
      <div className="flex flex-row w-full flex-wrap gap-2 xl:flex-nowrap ">
        <section className="w-full  rounded-lg">
          <div className="relative">
            <Image
              src={restaurant?.bannerDishes?.[0]?.location}
              h={"240px"}
              w={"100%"}
              fit="cover" 
            />
            <img
              className="w-44 h-44 rounded-full object-contain absolute top-[150px] left-[50px] "
              src={dishDetails?.images?.[0]?.location}
            />
          </div>
          <section>
            <div className="p-5 flex md:items-center lg:items-start flex-col space-y-3">
              <div className="flex w-full justify-between">
                <span className=" font-bold pt-20 pb-5 text-left text-2xl">{dishDetails?.name}</span>
                {user.role !== APP_ROLES.branchAdmin && user.role !== APP_ROLES.cashierUser ? (
                  <div
                    className="w-[34px] h-[34px] mt-20  rounded-full flex items-center justify-center cursor-pointer"
                    onClick={() => {
                      openFormModal()
                    }}>
                    <IconEdit color="white" size={18} />
                  </div>
                ) : null}
              </div>

              <div className="flex w-full flex-col">
                <div className="flex flex-row justify-between w-full">
                  <p className="text-zinc-500 text-sm font-medium h-full w-full mb-3">{dishDetails?.description}</p>
                </div>
              </div>
              <div className="w-[125px] h-px sm:w-full" />
              <div className=" text-sm font-medium py-2 leading-snug">Precio inicial</div>
              <div className=" text-sm font-bold leading-snug pb-2">{getFormattedHNL(dishDetails?.price)}</div>
              <div className=" text-sm font-medium leading-snug mb-2 mt-4">Preparación</div>
              <div className="w-[125px] h-px sm:w-full" />
              <div className=" text-sm font-medium leading-snug my-2">Tiempo estimado</div>
              <div className=" text-sm font-bold leading-snug mb-2">{dishDetails?.preparationTime} minutos</div>
              <div className="w-[125px] h-px sm:w-full" />
              <div className="flex flex-row justify-between mt-5">
                <span className=" text-base font-bold leading-normal">Adicionales ({dishDetails?.additionals?.length})</span>
              </div>
              {dishDetails?.additionals?.map((category, index) => {
                return (
                  <Paper key={index} withBorder radius="md" h="100%" w='100%' p="md">
                    <article className="w-full">
                      <div className="flex items-center justify-between mb-1">
                        <h3 className="font-bold text-md">
                          {category.name} {category.requiredMinimum ? `(min: ${category.requiredMinimum})` : null}:
                        </h3>
                      </div>

                      <ul className="space-y-2">
                        {category?.additionalsDetails?.map((item, i) => (
                          <li key={i} className="flex flex-row gap-1 items-center">
                            <span>{item.name}</span>
                            <IconArrowNarrowRight />
                            <Text c="dimmed" fs="italic">
                              {item.price == "0.00" ? "Gratis" : getFormattedHNL(item.price)}
                            </Text>
                          </li>
                        ))}
                      </ul>
                    </article>
                  </Paper>
                )
              })}
            </div>
          </section>
        </section>
        {/*  <section className="w-full xl:w-3/12 xl:pl-4 2xl:w-2/12">
          <Grid grow>
            {dashboardCards.map((item, key) => (
              <Grid.Col span={{ lg: 1 }} key={key}>
                <DashboardCard gutter={{ base: 5, xs: "md", md: "xl", xl: 50 }} data={item} />
              </Grid.Col>
            ))}
          </Grid>
        </section> */}
      </div>
      <Modal
        opened={imageModalOpened}
        onClose={closeImageModal}
        centered
        size={"2xl"}
        radius={"lg"}
        overlayProps={{
          backgroundOpacity: 0.55,
          blur: 3
        }}>
        <Image
          h={"auto"}
          w="full"
          fit="contain"
          src={dishDetails?.images?.[0]?.location}
          radius={"xl"}
          fallbackSrc="https://placehold.co/600x400?text=Imagen+no+disponible"
        />
      </Modal>

      <Modal
        opened={formModalOpened}
        onClose={closeFormModal}
        centered
        size={"2xl"}
        radius={"lg"}
        overlayProps={{
          backgroundOpacity: 0.55,
          blur: 3
        }}>
        <EditDishScreen close={closeFormModal} dishDetails={dishDetails} />
      </Modal>
    </>
  )
}
