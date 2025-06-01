import type { Meta, StoryObj } from "@storybook/react"
import { BaseButton } from "./base-button"

const meta: Meta<typeof BaseButton> = {
    title: "Dev/BaseButton",
    component: BaseButton,
    args: {
        children: "Click me",
    },
}
export default meta

type Story = StoryObj<typeof BaseButton>

export const Default: Story = {
    args: {
        variant: "text",
    },
}

