import { UserButton } from "./UserButton"

const meta = {
  title: "Components/UserButton",
  component: UserButton,
  // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/7.0/react/writing-docs/docs-page
  tags: ["autodocs"],
  parameters: {
    // More on how to position stories at: https://storybook.js.org/docs/7.0/react/configure/story-layout
    layout: "centered"
  }
}

export default meta

export const Default = {
  render: () => (
    <UserButton
      image="https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=255&q=80"
      name="Harriette Spoonlicker"
      email="hspoonlicker@outlook.com"
    />
  )
}
