import { navLinks } from "@/config"
import { Navbar } from "./Navbar"

const meta = {
  title: "Components/Navbar",
  component: Navbar,
  // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/7.0/react/writing-docs/docs-page
  tags: ["autodocs"],
  parameters: {
    // More on how to position stories at: https://storybook.js.org/docs/7.0/react/configure/story-layout
    layout: "fullscreen"
  }
}

export default meta

export const Default = {
  render: () => <Navbar data={navLinks} />
}
