"use client";
import * as React from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";

export function Dialog({ children, ...props }: React.ComponentProps<typeof DialogPrimitive.Root>) {
  return <DialogPrimitive.Root {...props}>{children}</DialogPrimitive.Root>;
}

export const DialogContent = DialogPrimitive.Content;
export const DialogHeader = DialogPrimitive.Title;
export const DialogTitle = DialogPrimitive.Title;
