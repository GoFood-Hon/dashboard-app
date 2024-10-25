import React from "react"
import { useParams } from "react-router-dom"
import BackButton from "../Dishes/components/BackButton"
import { Container, Flex } from "@mantine/core"
import { colors } from "../../theme/colors"
import { Title, SimpleGrid, Text, Button, ThemeIcon, Grid, rem } from "@mantine/core"
import { IconReceiptOff, IconFlame, IconCircleDotted, IconFileCode } from "@tabler/icons-react"
import classes from "./Reservations.module.css"

export const ReservationDetails = () => {
  const { reservationId } = useParams()
  const features = [
    {
      icon: IconReceiptOff,
      title: "Free and open source",
      description: "All packages are published under MIT license, you can use Mantine in any project"
    },
    {
      icon: IconFileCode,
      title: "TypeScript based",
      description: "Build type safe applications, all components and hooks export types"
    },
    {
      icon: IconCircleDotted,
      title: "No annoying focus ring",
      description: "With new :focus-visible selector focus ring will appear only when user navigates with keyboard"
    },
    {
      icon: IconFlame,
      title: "Flexible",
      description: "Customize colors, spacing, shadows, fonts and many other settings with global theme object"
    }
  ]

  const items = features.map((feature) => (
    <div key={feature.title}>
      <ThemeIcon size={44} radius="md" variant="gradient" gradient={{ deg: 133, from: "blue", to: "cyan" }}>
        <feature.icon style={{ width: rem(26), height: rem(26) }} stroke={1.5} />
      </ThemeIcon>
      <Text fz="lg" mt="sm" fw={500}>
        {feature.title}
      </Text>
      <Text c="dimmed" fz="sm">
        {feature.description}
      </Text>
    </div>
  ))

  return (
    <>
      <section className="flex items-center justify-between w-full p-2">
        <div className="flex flex-row justify-between items-center">
          <BackButton title={reservationId} show />
        </div>
        <div className="space-x-2">
          <Button variant="outline" color={colors.main_app_color}>
            Cancelar
          </Button>
          <Button color={colors.main_app_color}>Aprobar</Button>
        </div>
      </section>
    </>
    // <div className={classes.wrapper}>
    //   <Grid gutter={80}>
    //     <Grid.Col span={{ base: 12, md: 5 }}>
    //       <Title className={classes.title} order={2}>
    //         A fully featured React components library for your next project
    //       </Title>
    //       <Text c="dimmed">
    //         Build fully functional accessible web applications faster than ever – Mantine includes more than 120 customizable
    //         components and hooks to cover you in any situation
    //       </Text>

    //       <Button variant="gradient" gradient={{ deg: 133, from: "blue", to: "cyan" }} size="lg" radius="md" mt="xl">
    //         Get started
    //       </Button>
    //     </Grid.Col>
    //     <Grid.Col span={{ base: 12, md: 7 }}>
    //       <SimpleGrid cols={{ base: 1, md: 2 }} spacing={30}>
    //         {items}
    //       </SimpleGrid>
    //     </Grid.Col>
    //   </Grid>
    // </div>
  )
}
