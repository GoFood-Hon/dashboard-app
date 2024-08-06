import { ScrollArea } from "@mantine/core"
import { UserButton } from "../UserButton/UserButton"
import { NavLinksGroup } from "./NavLinksGroup"
import classes from "./Navbar.module.css"

export function Navbar({ data }) {
  const links = data.map((item) => NavLinksGroup({ key: item.label, ...item }))

  return (
    <>
      <ScrollArea className={classes.links}>
        <div className={classes.linksInner}>{links}</div>
      </ScrollArea>

      <div className={classes.footer}>
        <UserButton
          image="https://tkdmymipjaevgekdbsgz.supabase.co/storage/v1/object/public/clients/841129a5-a45a-4e12-9bcb-3ce56dd8d6dc/profile/JxtxK_Fcu_26S426gmdh"
          name="Victor"
          email="vicalregu@gmail.com"
        />
      </div>
    </>
  )
}
