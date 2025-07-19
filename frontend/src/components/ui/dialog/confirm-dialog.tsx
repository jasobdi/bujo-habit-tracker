'use client'

import { Dialog, DialogContent, DialogHeader, DialogFooter, DialogTitle } from "./dialog"
import { BaseButton } from "../button/base-button/base-button"
import { useState } from "react"

export function ConfirmDialog({
    title = "Are you sure?",
    description,
    onConfirm,
    trigger,
}: {
    title?: string
    description?: string
    onConfirm: () => void
    trigger: React.ReactNode
}) {
    const [open, setOpen] = useState(false)

    return (
        <>
            <span onClick={() => setOpen(true)}>{trigger}</span>

            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent className="rounded-radius border-[2px] border-black backdrop-blur-sm max-w-sm">
                    <DialogHeader>
                        <DialogTitle>{title}</DialogTitle>
                        {description && <p>{description}</p>}
                    </DialogHeader>
                    <DialogFooter className="mt-4 flex justify-end gap-2">
                        <BaseButton type="button" variant="text" onClick={() => setOpen(false)}>
                            Cancel
                        </BaseButton>
                        <BaseButton
                            type="button"
                            variant="text"
                            className="bg-tertiary text-white"
                            onClick={() => {
                                onConfirm()
                                setOpen(false)
                            }}
                        >
                            Confirm
                        </BaseButton>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    )
}
