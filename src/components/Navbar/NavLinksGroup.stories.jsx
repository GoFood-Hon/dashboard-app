import { IconCalendarStats } from "@tabler/icons-react"
import { NavLinksGroup } from "./NavLinksGroup"

const meta = {
  title: "Components/NavLinksGroup",
  component: NavLinksGroup,
  // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/7.0/react/writing-docs/docs-page
  tags: ["autodocs"],
  parameters: {
    // More on how to position stories at: https://storybook.js.org/docs/7.0/react/configure/story-layout
    layout: "fullscreen"
  }
}

export default meta

const hasLinks = {
  label: "Releases",
  icon: IconCalendarStats,
  links: [
    { label: "Upcoming releases", link: "/" },
    { label: "Previous releases", link: "/" },
    { label: "Releases schedule", link: "/" }
  ]
}

export const HasLinks = {
  render: () => <NavLinksGroup {...hasLinks} />
}

const noLinks = {
  label: "Releases",
  icon: IconCalendarStats,
  link: "/"
}

export const NoLinks = {
  render: () => <NavLinksGroup {...noLinks} />
}
