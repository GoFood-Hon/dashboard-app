import { ActionIcon, Box, TextInput, Image } from "@mantine/core"
import { IconSearch, IconSun, IconMoon } from "@tabler/icons-react"
import classes from "./AdminHeader.module.css"
import { useMantineColorScheme } from "@mantine/core";

export function AdminHeader({ burger }) {
  const { colorScheme, setColorScheme } = useMantineColorScheme()

  const toggleColorScheme = () => {
    setColorScheme(colorScheme === "dark" ? "light" : "dark")
  }

  return (
    <header className={classes.header}>
      {burger && burger}
      <Image
        src="https://tkdmymipjaevgekdbsgz.supabase.co/storage/v1/object/public/user_profiles/goFood.png?t=2024-07-30T01%3A25%3A16.174Z"
        w={90}
        fit="contain"
        fallbackSrc="https://placehold.co/600x400?text=Imagen+no+disponible"
      />
      <Box style={{ flex: 1 }} />
      <TextInput placeholder="Buscar" variant="filled" leftSection={<IconSearch size="0.8rem" />} style={{}} />
      <ActionIcon
        onClick={() => {
          toggleColorScheme()
        }}
        variant="subtle"
        color="rgb(253,190,65)">
        {colorScheme === "dark" ? <IconSun size="1.25rem" /> : <IconMoon size="1.25rem" />}
      </ActionIcon>
    </header>
  )
}
