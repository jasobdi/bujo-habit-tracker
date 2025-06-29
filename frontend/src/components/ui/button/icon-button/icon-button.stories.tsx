import type { Meta, StoryObj } from "@storybook/react";
import { IconButton } from "./icon-button";
import { ArrowLeftIcon } from "@/components/icons/arrow-left-icon";
import { ArrowRightIcon } from "@/components/icons/arrow-right-icon";
import { BackIcon } from "@/components/icons/back-icon";
import { BookOpenIcon } from "@/components/icons/book-open-icon";
import { CheckboxIcon } from "@/components/icons/checkbox-icon";
import { EditIcon } from "@/components/icons/edit-icon";
import { EyeIcon } from "@/components/icons/eye-icon";
import { FilterIcon } from "@/components/icons/filter-icon";
import { PlusIcon } from "@/components/icons/plus-icon";
import { TrashIcon } from "@/components/icons/trash-icon";
import { UserIcon } from "@/components/icons/user-icon";

const iconOptions = {
    Left: <ArrowLeftIcon />,
    Right: <ArrowRightIcon />,
    Back: <BackIcon />,
    Book: <BookOpenIcon />,
    Checkbox: <CheckboxIcon />,
    Edit: <EditIcon />,
    Eye: <EyeIcon />,
    Filter: <FilterIcon />,
    Plus: <PlusIcon />,
    Trash: <TrashIcon />,
    User: <UserIcon />,
};

const colorOptions = {
    Primary: "bg-[var(--primary)]",
    Secondary: "bg-[var(--secondary)]",
    Tertiary: "bg-[var(--tertiary)]",
    Inactive: "bg-[var(--button-inactive)]",
}

const meta: Meta<typeof IconButton> = {
    title: "UI/Button/IconButton",
    component: IconButton,
    tags: ["autodocs"],
    argTypes: {
        bgColor: {
            control: {type: "select" },
            options: Object.keys(colorOptions),
            mapping: colorOptions,
            description: "Background color of the button",
        },
        icon: {
            control: "select",
            options: Object.keys(iconOptions),
            mapping: iconOptions,
        },
        className: {
            control: "text",
        },
    },
};

    export default meta;

    type Story = StoryObj<typeof IconButton>;

    export const Default: Story = {
        args: {
            icon: <BackIcon />,
            bgColor: "Primary",

        },
    };
