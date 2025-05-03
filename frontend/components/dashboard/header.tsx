"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Bell, CheckCircle, LogOut, Menu, Settings, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { NotificationsPopover } from "@/components/notifications/notifications-popover"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { DashboardNav } from "@/components/dashboard/nav"

interface HeaderProps {
  user: {
    id: string
    name?: string | null
    email?: string | null
    image?: string | null
    role?: string | null
  }
}

export function DashboardHeader({ user }: HeaderProps) {
  const pathname = usePathname()
  const [isMounted, setIsMounted] = useState(false)
  const [notificationCount, setNotificationCount] = useState(0)

  useEffect(() => {
    setIsMounted(true)

    // Fetch notification count
    const fetchNotifications = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/notifications`)
        if (response.ok) {
          const data = await response.json()
          setNotificationCount(data.length)
        }
      } catch (error) {
        console.error("Error fetching notifications:", error)
      }
    }

    fetchNotifications()

    // Set up polling for notifications
    const interval = setInterval(fetchNotifications, 30000) // every 30 seconds

    return () => clearInterval(interval)
  }, [])

  // Prevent hydration errors
  if (!isMounted) {
    return null
  }

  const initials = user?.name
    ? user.name
        .split(" ")
        .map((n) => n[0])
        .join("")
    : "U"

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/signin";
  };

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6">
      <div className="flex items-center gap-2 md:hidden">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon" className="md:hidden">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle Menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-[240px] sm:w-[300px] pr-0">
            <nav className="grid gap-2 text-lg font-medium">
              <DashboardNav user={user} className="grid" />
            </nav>
          </SheetContent>
        </Sheet>
        <Link href="/" className="flex items-center gap-2 md:hidden">
          <CheckCircle className="h-6 w-6" />
          <span className="font-bold">TaskFlow</span>
        </Link>
      </div>
      <div className="hidden md:flex">
        <SidebarTrigger />
      </div>
      <div className="flex w-full items-center gap-2 md:ml-auto md:gap-4 lg:gap-6">
        <nav className="hidden flex-1 md:flex">
          <Link
            href="/dashboard"
            className={`flex items-center gap-2 text-lg font-semibold ${
              pathname === "/dashboard" ? "text-foreground" : "text-muted-foreground"
            }`}
          >
            <CheckCircle className="h-6 w-6" />
            <span>TaskFlow</span>
          </Link>
        </nav>
        <div className="ml-auto flex items-center gap-4">
          <NotificationsPopover>
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              {notificationCount > 0 && (
                <Badge
                  variant="destructive"
                  className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-[10px]"
                >
                  {notificationCount}
                </Badge>
              )}
              <span className="sr-only">Notifications</span>
            </Button>
          </NotificationsPopover>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-full">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={user?.image || ""} alt={user?.name || "User"} />
                  <AvatarFallback>{initials}</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">{user?.name}</p>
                  <p className="text-xs leading-none text-muted-foreground">{user?.email}</p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href="/dashboard/profile">
                  <User className="mr-2 h-4 w-4" />
                  <span>Profile</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/dashboard/settings">
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Settings</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={handleLogout}
                className="text-red-600 dark:text-red-400"
              >
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}
