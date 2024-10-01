import { Box, Collapse, Group, ThemeIcon, UnstyledButton, useDirection } from "@mantine/core"
import { IconChevronLeft, IconChevronRight } from "@tabler/icons-react"
import { Link } from "react-router-dom"
import { useState } from "react"
import classes from "./NavLinksGroup.module.css"
import { useLocation } from "react-router-dom"

export function NavLinksGroup({ icon: Icon, label, link, initiallyOpened, links }) {
  const { pathname } = useLocation()
  const { dir } = useDirection()

  const hasLinks = Array.isArray(links)
  const [opened, setOpened] = useState(initiallyOpened || false)
  const ChevronIcon = dir === "ltr" ? IconChevronRight : IconChevronLeft
  const items = (hasLinks ? links : []).map((link) => {
    return (
      <Link to={link.link} key={link.label} className={`${classes.link} ${link.link === pathname && classes.activeLink}`}>
        {link.label}
      </Link>
    )
  })

  const handleClick = () => {
    if (hasLinks) {
      setOpened((prev) => !prev)
    }
  }

  return (
    <>
      {link ? (
        // Si el item tiene un link (y no rutas anidadas), renderiza el Link.
        <Link to={link} className={`${classes.control} ${link === pathname && classes.activeControl}`}>
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
        // Si el item tiene rutas anidadas, maneja el clic para expandir/colapsar.
        <div onClick={handleClick} className={classes.control}>
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
                  transform: opened ? `rotate(${dir === "rtl" ? -90 : 90}deg)` : "none"
                }}
              />
            )}
          </Group>
        </div>
      )}
      {hasLinks ? <Collapse in={opened}>{items}</Collapse> : null}
    </>
  )
}
