import React, { useEffect } from "react"
import { useParams } from "react-router-dom"
import BackButton from "../Dishes/components/BackButton"
import { colors } from "../../theme/colors"
import {
  Text,
  Button,
  Group,
  Stack,
  Grid,
  Paper,
  Badge,
  Card,
  Modal,
  Textarea,
  Avatar,
  Title,
  Divider,
  Flex,
  Space,
  Box,
  Tooltip
} from "@mantine/core"
import {
  addCommentsToReservation,
  approveReservation,
  cancelReservation,
  fetchReservationDetails
} from "../../store/features/reservationsSlice"
import { useDispatch, useSelector } from "react-redux"
import classes from "./Reservations.module.css"
import { useDisclosure } from "@mantine/hooks"
import { useState } from "react"
import { IconChairDirector } from "@tabler/icons-react"
import { dateTimeConverter, getFormattedHNL } from "../../utils"
import { IconCalendarStats } from "@tabler/icons-react"
import { IconId } from "@tabler/icons-react"
import { IconCreditCardFilled } from "@tabler/icons-react"
import { IconNote } from "@tabler/icons-react"
import { showNotification } from "@mantine/notifications"
import dayjs from "dayjs"
import relativeTime from "dayjs/plugin/relativeTime"
import "dayjs/locale/es"

dayjs.extend(relativeTime)
dayjs.locale("es")

export const ReservationDetails = () => {
  const { reservationId } = useParams()
  const user = useSelector((state) => state.user.value)
  const reservationDetails = useSelector((state) => state.reservations.reservationDetails)
  const dispatch = useDispatch()
  const [comment, setComment] = useState("")
  const [opened, { close, open }] = useDisclosure(false)
  const [cancelled, setCancelled] = useState(false)
  const [cancelComment, setCancelComment] = useState("")

  useEffect(() => {
    dispatch(fetchReservationDetails(reservationId))
  }, [dispatch, reservationId])

  const handleCreateComment = () => {
    if (comment.trim() !== "") {
      dispatch(addCommentsToReservation({ reservationId, params: { comment } })).then(() => {
        setComment("")
      })
    } else {
      showNotification({
        title: "Error",
        message: "Debes escribir un comentario primero",
        color: "red",
        duration: 7000
      })
    }
  }

  const handleCancelReservation = () => {
    dispatch(cancelReservation({ reservationId, params: { revisedBy: user?.id, comment: cancelComment } }))
  }

  const handleApproveReservation = () => {
    dispatch(approveReservation({ reservationId, revisedBy: user?.id }))
  }

  return (
    <>
      <section className="flex items-center justify-between w-full mb-3">
        <div className="flex flex-row justify-between items-center">
          <BackButton title={"Detalles de la reservación"} show />
        </div>
      </section>

      <Grid>
        <Grid.Col span={{ base: 12, lg: 8 }}>
          <Card withBorder radius="md" p="md" className={classes.card} mih={310}>
            <Stack>
              <Card.Section>
                <Text tt="uppercase" size="lg" p="md" fw={700}>
                  {reservationDetails?.Sucursal?.name}
                </Text>
              </Card.Section>
              <Flex align="center" gap={5}>
                <IconId size={25} />
                <Text size="sm" fw={500}>
                  ID: {reservationId}
                </Text>
              </Flex>
              <Flex align="center" gap={5}>
                <IconChairDirector size={25} />
                <Text size="sm">Sillas reservadas: {reservationDetails?.chairs}</Text>
              </Flex>
              <Flex align="center" gap={5}>
                <IconCalendarStats size={25} />
                <Text size="sm">Fecha de reserva: {dateTimeConverter(reservationDetails?.reservationDate)}</Text>
              </Flex>
              <Flex align="center" gap={5}>
                <IconCreditCardFilled size={25} />
                <Text size="sm">
                  {reservationDetails?.isPayed
                    ? `Se pagó el ${dateTimeConverter(reservationDetails?.paidDate)}`
                    : "No se ha realizado el pago"}
                </Text>
              </Flex>
              <Divider />
              <Card.Section className={classes.section}>
                <Flex align="center" gap={10} justify="end">
                  <Tooltip hidden={reservationDetails?.status === "pending"} label="No es posible modificar el estado">
                    <Button
                      className={classes.button}
                      variant="outline"
                      disabled={reservationDetails?.status !== "pending"}
                      color={colors.main_app_color}
                      onClick={() => {
                        open()
                        setCancelled(true)
                      }}>
                      Cancelar
                    </Button>
                  </Tooltip>
                  <Tooltip hidden={reservationDetails?.status === "pending"} label="No es posible modificar el estado">
                    <Button
                      className={classes.button}
                      disabled={reservationDetails?.status !== "pending"}
                      color={colors.main_app_color}
                      onClick={() => {
                        open()
                        setCancelled(false)
                      }}>
                      Aprobar
                    </Button>
                  </Tooltip>
                </Flex>
              </Card.Section>
            </Stack>
          </Card>
        </Grid.Col>
        <Grid.Col span={{ base: 12, lg: 4 }}>
          <Card withBorder radius="md" p="md" className={classes.card} mih={310}>
            <Stack align="stretch" h={277} justify="space-between">
              <Stack>
                <Flex align="center" gap={5}>
                  <Text>Estado de la reservación:</Text>
                  <Badge
                    size="md"
                    color={
                      reservationDetails?.status === "pending"
                        ? colors.yellow_logo
                        : reservationDetails?.status === "cancelled"
                          ? colors.main_app_color
                          : "green"
                    }>
                    {reservationDetails?.status === "pending"
                      ? "Pendiente"
                      : reservationDetails?.status === "cancelled"
                        ? "Cancelada"
                        : "Aprobada"}
                  </Badge>
                </Flex>
                <Flex align="center" gap={5}>
                  <IconCalendarStats size={25} />
                  <Text size="sm">Actualizado el {dateTimeConverter(reservationDetails?.updatedAt)}</Text>
                </Flex>
              </Stack>
              <Stack>
                <Card.Section className={classes.section}>
                  <Divider my="md" />

                  <Flex align="center" pt="xs" justify="space-between">
                    <Text fw={500}>Total:</Text>
                    <Text fw={500}>{getFormattedHNL(reservationDetails?.total)}</Text>
                  </Flex>
                </Card.Section>
              </Stack>
            </Stack>
          </Card>
        </Grid.Col>

        <Grid.Col>
          <Card withBorder radius="md" className={classes.comment}>
            <Title order={4}>Comentarios ({reservationDetails?.ReservationComments?.length || 0})</Title>
            <Space h="sm" />
            <Textarea placeholder="Escribe un comentario" onChange={(e) => setComment(e.target.value)} value={comment} />
            <Space h="sm" />
            <Flex justify="end">
              <Button color={colors.main_app_color} onClick={handleCreateComment}>
                Publicar
              </Button>
            </Flex>
          </Card>
          <Space h="xs" />
          {reservationDetails?.ReservationComments?.map((comment) =>
            comment?.AdminUser ? (
              <Paper key={comment?.id} withBorder radius="md" mb="xs" className={classes.comment}>
                <Group justify="flex-end" gap='xs'>
                  <Box>
                    <Text fz="sm" ta="end">
                      {comment?.AdminUser?.name}
                    </Text>
                    <Text fz="xs" c="dimmed" ta="end">
                      {dayjs(comment?.createdAt).fromNow()}
                    </Text>
                  </Box>
                  <Avatar
                    src={comment?.AdminUser?.photo}
                    alt="it's me"
                    name={comment?.AdminUser?.name
                      ?.split(" ")
                      .filter((_, i, arr) => i === 0 || i === arr.length - 1)
                      .map((word) => word.charAt(0))
                      .join("")
                      .toUpperCase()}
                  />
                </Group>
                <Text pr={50} pt="sm" size="sm" ta="right">
                  {comment?.comment}
                </Text>
              </Paper>
            ) : (
              <Paper key={comment?.id} withBorder radius="md" mb="xs" className={classes.comment}>
                <Group gap='xs'>
                  <Box>
                    <Text fz="sm">{comment?.User?.name}</Text>
                    <Text fz="xs" c="dimmed">
                      {dayjs(comment?.createdAt).fromNow()}
                    </Text>
                  </Box>
                  <Avatar
                    src={comment?.User?.photo}
                    alt="it's me"
                    name={comment?.User?.name
                      ?.split(" ")
                      .filter((_, i, arr) => i === 0 || i === arr.length - 1)
                      .map((word) => word.charAt(0))
                      .join("")
                      .toUpperCase()}
                  />
                </Group>
                <Text pl={54} pt="sm" size="sm">
                  {comment?.comment}
                </Text>
              </Paper>
            )
          )}
        </Grid.Col>
      </Grid>

      <Modal
        opened={opened}
        radius="md"
        onClose={close}
        withCloseButton={false}
        closeOnEscape
        size="md"
        overlayProps={{
          backgroundOpacity: 0.55,
          blur: 3
        }}
        title={`${cancelled ? "¿Estás seguro que deseas cancelar esta reservación?" : "¿Estás seguro que deseas aprobar esta reservación?"}`}>
        <Text size="md" hidden={cancelled}>
          La reservación se marcará como {cancelled ? "cancelada" : "aprobada"}
        </Text>
        {cancelled ? (
          <Textarea
            placeholder="Ingresa el motivo de la cancelación"
            value={cancelComment}
            onChange={(e) => setCancelComment(e.target.value)}
            autosize
            minRows={2}
            maxRows={4}
          />
        ) : (
          ""
        )}

        <Group mt="sm" justify="end">
          <Button
            color={colors.main_app_color}
            variant="outline"
            onClick={() => {
              close()
              setCancelled(false)
            }}>
            Cancelar
          </Button>
          <Button
            color={colors.main_app_color}
            onClick={() => {
              if (cancelled && cancelComment !== "") {
                handleCancelReservation()
                close()
              } else if (!cancelled) {
                handleApproveReservation()
                close()
              } else {
                showNotification({
                  title: "Error",
                  message: "Debes escribir un comentario antes de cancelar",
                  color: "red",
                  duration: 7000
                })
              }
            }}>
            Confirmar
          </Button>
        </Group>
      </Modal>
    </>
  )
}
