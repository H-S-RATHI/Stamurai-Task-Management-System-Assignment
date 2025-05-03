"use client"

import type React from "react"

import { SidebarProvider as Provider } from "@/components/ui/sidebar"

export function SidebarProvider({ children }: { children: React.ReactNode }) {
  return <Provider>{children}</Provider>
}
