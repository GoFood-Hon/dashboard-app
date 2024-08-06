import { Box, Collapse, Group, ThemeIcon, UnstyledButton, useDirection } from "@mantine/core"
import { IconChevronLeft, IconChevronRight } from "@tabler/icons-react"
import { Link } from "react-router-dom"
import { useState } from "react"
import classes from "./NavLinksGroup.module.css"

export function NavLinksGroup({ icon: Icon, label, link, initiallyOpened, links }) {
  const pathname = "Hola"
  const { dir } = useDirection()

  const hasLinks = Array.isArray(links)
  const [opened, setOpened] = useState(initiallyOpened || false)
  const ChevronIcon = dir === "ltr" ? IconChevronRight : IconChevronLeft
  const items = (hasLinks ? links : []).map((link) => {
    return (
      <Link href={link.link} key={link.label} className={`${classes.link} ${link.link === pathname && classes.activeLink}`}>
        {link.label}
      </Link>
    )
  })

  return (
    <>
      {link ? (
        <Link href={link} className={`${classes.control} ${link === pathname && classes.activeControl}`}>
          <Group gap={0} justify="space-between">
            <Box style={{ display: "flex", alignItems: "center" }}>
              <ThemeIcon variant="light" color="rgb(253,190,65)" size={30}>
                <Icon size="1.1rem" />
              </ThemeIcon>
              <Box ml="md">{label}</Box>
            </Box>
          </Group>
        </Link>
      ) : (
        <UnstyledButton
          onClick={() => {
            if (hasLinks) {
              setOpened((o) => !o)
              return
            }
          }}
          className={classes.control}>
          <Group gap={0} justify="space-between">
            <Box style={{ display: "flex", alignItems: "center" }}>
              <ThemeIcon variant="light" color="rgb(253,190,65)" size={30}>
                <Icon size="1.1rem" />
              </ThemeIcon>
              <Box ml="md">{label}</Box>
            </Box>
            {hasLinks && (
              <ChevronIcon
                className={classes.chevron}
                size="1rem"
                stroke={1.5}
                style={{
                  transform: opened
                    ? `rotate(${dir === "rtl" ? -90 : 90}deg)`
                    : "none",
                }}
              />
            )}
          </Group>
        </UnstyledButton>
      )}
      {hasLinks ? <Collapse in={opened}>{items}</Collapse> : null}
    </>
  )
}
