import React, { useEffect, useState } from "react"
import { useSelector, useDispatch } from "react-redux"
import TableViewLayout from "../TableViewLayout"
import { fetchAllReviews, setCurrentPage } from "../../store/features/reviewsSlice"
import { useDisclosure } from "@mantine/hooks"
import { Anchor, Card, Divider, Flex, Modal, Rating, Stack, Text, Title, Tooltip } from "@mantine/core"
import { IconMotorbike } from "@tabler/icons-react"
import { IconBurger } from "@tabler/icons-react"
import { IconBox } from "@tabler/icons-react"
import { useNavigate } from "react-router-dom"

export default function Reviews() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const user = useSelector((state) => state.user.value)
  const limit = useSelector((state) => state.reviews.itemsPerPage)
  const page = useSelector((state) => state.reviews.currentPage)
  const reviewsPerPage = useSelector((state) => state.reviews.reviewsPerPage)
  const totalReviews = useSelector((state) => state.reviews.totalReviews)
  const totalPageCount = useSelector((state) => state.reviews.totalPagesCount)
  const reviewsList = reviewsPerPage[page] || []
  const loadingReviews = useSelector((state) => state.reviews.loadingReviews)
  const rating = useSelector((state) => state.reviews.rating)

  const [opened, { open, close }] = useDisclosure(false)
  const [selectedReview, setSelectedReview] = useState(null)
  const reviewTotal = parseFloat(
    ((selectedReview?.driverRating + selectedReview?.foodRating + selectedReview?.suborderRating) / 3).toFixed(1)
  )

  const handleOpenModal = (reviewId) => {
    const review = reviewsList.find((r) => r.id === reviewId)
    setSelectedReview(review)
    open()
  }

  useEffect(() => {
    if (!reviewsPerPage[page]) {
      dispatch(fetchAllReviews({ restaurantId: user.restaurantId, limit, page, order: "DESC" }))
    }
  }, [dispatch, limit, page, reviewsPerPage, user.role])

  return (
    <>
      <TableViewLayout
        title="Reseñas"
        page={page}
        limit={limit}
        totalElements={totalReviews}
        items={reviewsList.map((review) => ({
          ...review,
          name: review?.User?.name,
          email: review?.User?.email,
          phoneNumber: review?.User?.phoneNumber,
          date: review?.createdAt
        }))}
        tableStructure="reviewsScreen"
        totalItems={totalPageCount}
        loading={loadingReviews}
        setPage={(newPage) => dispatch(setCurrentPage(newPage))}
        noSearch
        openModal={handleOpenModal}
        rankingAverage={rating}
      />

      <Modal radius="md" opened={opened} onClose={close} title="Detalle de la reseña" centered>
        {selectedReview && (
          <Stack gap="xs">
            <Flex direction="row" gap="xs" align="center">
              <Card bg={reviewTotal < 2.8 ? "red" : reviewTotal < 3.8 ? "yellow" : "green"} p="xs" radius="md">
                <Text size="55px" fw={900}>
                  {reviewTotal.toFixed(1)}
                </Text>
              </Card>
              <Flex direction="column" gap={5}>
                <Text size="sm">{selectedReview?.User?.name}</Text>
                <Text size="sm" c="dimmed">
                  {selectedReview?.User?.email}
                </Text>
                <Tooltip label="Ir al pedido" withArrow position="bottom">
                  <Anchor onClick={() => navigate(`/orders/${selectedReview?.suborderId}`)} c="gray">
                    <Text size="sm">{selectedReview?.Suborder?.Order?.id}</Text>
                  </Anchor>
                </Tooltip>
              </Flex>
            </Flex>
            <Divider my="xs" />
            <Flex align="center" gap={5}>
              <IconMotorbike />
              <Text size="sm">Repartidor:</Text>
              <Rating defaultValue={selectedReview?.driverRating || 0} readOnly />
              <Text size="sm">({selectedReview?.driverRating || 0})</Text>
            </Flex>
            <Card radius="md">
              <Text size="sm">{selectedReview?.driverComment || "No hay comentario"}</Text>
            </Card>
            <Flex align="center" gap={5}>
              <IconBurger />
              <Text size="sm">Producto:</Text>
              <Rating defaultValue={selectedReview?.foodRating || 0} readOnly />
              <Text size="sm">({selectedReview?.foodRating || 0})</Text>
            </Flex>
            <Card radius="md">
              <Text size="sm">{selectedReview?.foodComment || "No hay comentario"}</Text>
            </Card>
            <Flex align="center" gap={5}>
              <IconBox />
              <Text size="sm">Orden:</Text>
              <Rating defaultValue={selectedReview?.suborderRating || 0} readOnly />
              <Text size="sm">({selectedReview?.suborderRating || 0})</Text>
            </Flex>
            <Card radius="md">
              <Text size="sm">{selectedReview?.suborderComment || "No hay comentario"}</Text>
            </Card>
          </Stack>
        )}
      </Modal>
    </>
  )
}
