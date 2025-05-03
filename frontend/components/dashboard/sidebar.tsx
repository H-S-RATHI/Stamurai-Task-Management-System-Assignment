"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { BarChart3, CheckCircle2, Clock, Home, ListTodo, Plus, Settings, Users } from "lucide-react"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"
import { CreateTaskDialog } from "@/components/tasks/create-task-dialog"
import { useState } from "react"

interface SidebarProps {
  user: {
    id: string
    name?: string | null
    email?: string | null
    image?: string | null
    role?: string | null
  }
}

export function DashboardSidebar({ user }: SidebarProps) {
  const pathname = usePathname()
  const [createTaskOpen, setCreateTaskOpen] = useState(false)

  const isActive = (path: string) => {
    return pathname === path
  }

  return (
    <>
      <Sidebar>
        <SidebarHeader>
          <div className="flex items-center px-2">
            <Button onClick={() => setCreateTaskOpen(true)} className="w-full justify-start gap-2">
              <Plus className="h-4 w-4" />
              Create Task
            </Button>
          </div>
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>Dashboard</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild isActive={isActive("/dashboard")}>
                    <Link href="/dashboard">
                      <Home className="h-4 w-4" />
                      <span>Overview</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild isActive={isActive("/dashboard/tasks")}>
                    <Link href="/dashboard/tasks">
                      <ListTodo className="h-4 w-4" />
                      <span>All Tasks</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild isActive={isActive("/dashboard/my-tasks")}>
                    <Link href="/dashboard/my-tasks">
                      <CheckCircle2 className="h-4 w-4" />
                      <span>My Tasks</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild isActive={isActive("/dashboard/upcoming")}>
                    <Link href="/dashboard/upcoming">
                      <Clock className="h-4 w-4" />
                      <span>Upcoming</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>

          {(user.role === "ADMIN" || user.role === "MANAGER") && (
            <SidebarGroup>
              <SidebarGroupLabel>Management</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild isActive={isActive("/dashboard/team")}>
                      <Link href="/dashboard/team">
                        <Users className="h-4 w-4" />
                        <span>Team</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  {user.role === "ADMIN" && (
                    <SidebarMenuItem>
                      <SidebarMenuButton asChild isActive={isActive("/dashboard/analytics")}>
                        <Link href="/dashboard/analytics">
                          <BarChart3 className="h-4 w-4" />
                          <span>Analytics</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  )}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          )}
        </SidebarContent>
        <SidebarFooter>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton asChild isActive={isActive("/dashboard/settings")}>
                <Link href="/dashboard/settings">
                  <Settings className="h-4 w-4" />
                  <span>Settings</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
      </Sidebar>

      <CreateTaskDialog open={createTaskOpen} onOpenChange={setCreateTaskOpen} />
    </>
  )
}
