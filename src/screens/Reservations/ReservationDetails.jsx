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
  Tooltip,
  Loader
} from "@mantine/core"
import {
  addCommentsToReservation,
  approveReservation,
  cancelReservation,
  fetchReservationDetails,
  setReservationComment
} from "../../store/features/reservationsSlice"
import { useDispatch, useSelector } from "react-redux"
import classes from "./Reservations.module.css"
import { useDisclosure } from "@mantine/hooks"
import { useState } from "react"
import { IconChairDirector, IconCalendarStats, IconId, IconCreditCardFilled, IconPhone } from "@tabler/icons-react"
import { formatTime, getFormattedHNL } from "../../utils"
import { showNotification } from "@mantine/notifications"
import dayjs from "dayjs"
import relativeTime from "dayjs/plugin/relativeTime"
import "dayjs/locale/es"

dayjs.extend(relativeTime)
dayjs.locale("es")

export const ReservationDetails = () => {
  const { reservationId } = useParams()
  const user = useSelector((state) => state.user.value)
  const {
    reservationDetails,
    loadingReservationsDetails,
    reservationComment,
    addingComment,
    cancellingReservation,
    approvingReservation
  } = useSelector((state) => state.reservations)
  const dispatch = useDispatch()
  const [opened, { close, open }] = useDisclosure(false)
  const [cancelled, setCancelled] = useState(false)
  const [cancelComment, setCancelComment] = useState("")

  useEffect(() => {
    dispatch(fetchReservationDetails(reservationId))
  }, [dispatch, reservationId])

  const handleCreateComment = () => {
    if (reservationComment.trim() !== "") {
      dispatch(addCommentsToReservation({ reservationId, params: { comment: reservationComment } })).then(() => {
        dispatch(setReservationComment(""))
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
      {loadingReservationsDetails ? (
        <div className="h-[calc(100vh-150px)] w-full flex justify-center items-center">
          <Loader color={colors.main_app_color} />
        </div>
      ) : (
        <Stack gap="xs">
          <Group>
            <Flex align="center" justify="space-between" gap="xs">
              <BackButton title="Detalles de reservación" show />
            </Flex>
          </Group>

          <Grid gutter="sm">
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
                      ID: {reservationId?.split('-')[4]?.substring(0, 6)?.toUpperCase()}
                    </Text>
                  </Flex>
                  <Flex align="center" gap={5}>
                    <IconChairDirector size={25} />
                    <Text size="sm">Sillas reservadas: {reservationDetails?.chairs}</Text>
                  </Flex>
                  <Flex align="center" gap={5}>
                    <IconCalendarStats size={25} />
                    <Text size="sm">Fecha y hora de reserva: {formatTime(reservationDetails?.reservationDate)}</Text>
                  </Flex>
                  <Flex align="center" gap={5}>
                    <IconCreditCardFilled size={25} />
                    <Text size="sm">
                      {reservationDetails?.isPayed
                        ? `Se pagó el ${formatTime(reservationDetails?.paidDate)}`
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
                          loading={cancellingReservation}
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
                          loading={approvingReservation}
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
                      <Text size="sm">
                        {reservationDetails?.createdAt === reservationDetails?.updatedAt ? "Creado" : "Actualizado"} el{" "}
                        {formatTime(reservationDetails?.updatedAt)}
                      </Text>
                    </Flex>
                    <Flex align="center" gap={5}>
                      <Avatar src={reservationDetails?.UserThatReserved?.photo} />
                      <Text size="sm">{reservationDetails?.UserThatReserved?.name}</Text>
                    </Flex>
                    <Flex align="center" gap={5}>
                      <IconId size={25} />
                      <Text size="sm">{reservationDetails?.UserThatReserved?.identityNumber}</Text>
                    </Flex>
                    <Flex align="center" gap={5}>
                      <IconPhone size={25} />
                      <Text size="sm">{reservationDetails?.UserThatReserved?.phoneNumber}</Text>
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
                <Textarea
                  classNames={{
                    input: "focus:border-gray-600"
                  }}
                  placeholder="Escribe un comentario"
                  onChange={(e) => dispatch(setReservationComment(e.target.value))}
                  value={reservationComment}
                />
                <Space h="sm" />
                <Flex justify="end">
                  <Button
                    className={classes.button}
                    loading={addingComment}
                    disabled={reservationComment.length === 0}
                    color={colors.main_app_color}
                    onClick={handleCreateComment}>
                    Publicar
                  </Button>
                </Flex>
              </Card>
              <Space h="sm" />
              {reservationDetails?.ReservationComments?.map((comment) =>
                comment?.AdminUser ? (
                  <Paper key={comment?.id} withBorder radius="md" mb="sm" className={classes.comment}>
                    <Group justify="flex-end" gap="xs">
                      <Box>
                        <Text fz="sm" ta="end">
                          {comment?.AdminUser?.name}
                        </Text>
                        <Text fz="xs" c="dimmed" ta="end">
                          {dayjs(comment?.createdAt).fromNow()}
                        </Text>
                      </Box>
                      <Avatar
                        src={comment?.AdminUser?.images?.[0]?.location}
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
                  <Paper key={comment?.id} withBorder radius="md" mb="sm" className={classes.comment}>
                    <Group justify="flex-start" gap="xs">
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
                      <Box>
                        <Text fz="sm">{comment?.User?.name}</Text>
                        <Text fz="xs" c="dimmed">
                          {dayjs(comment?.createdAt).fromNow()}
                        </Text>
                      </Box>
                    </Group>
                    <Text pl={50} pt="sm" size="sm" ta="left">
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
                classNames={{
                  input: "focus:border-gray-600"
                }}
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
        </Stack>
      )}
    </>
  )
}
