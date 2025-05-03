"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { BarChart3, CheckCircle2, Clock, Home, ListTodo, Settings, Users } from "lucide-react"
import { cn } from "@/lib/utils"

interface NavProps {
  user: {
    id: string
    name?: string | null
    email?: string | null
    image?: string | null
    role?: string | null
  }
  className?: string
}

export function DashboardNav({ user, className }: NavProps) {
  const pathname = usePathname()

  const isActive = (path: string) => {
    return pathname === path
  }

  return (
    <nav className={cn("grid gap-2", className)}>
      <Link
        href="/dashboard"
        className={cn(
          "flex items-center gap-2 rounded-lg px-3 py-2 text-sm transition-colors",
          isActive("/dashboard") ? "bg-accent text-accent-foreground" : "hover:bg-accent hover:text-accent-foreground",
        )}
      >
        <Home className="h-4 w-4" />
        <span>Overview</span>
      </Link>
      <Link
        href="/dashboard/tasks"
        className={cn(
          "flex items-center gap-2 rounded-lg px-3 py-2 text-sm transition-colors",
          isActive("/dashboard/tasks")
            ? "bg-accent text-accent-foreground"
            : "hover:bg-accent hover:text-accent-foreground",
        )}
      >
        <ListTodo className="h-4 w-4" />
        <span>All Tasks</span>
      </Link>
      <Link
        href="/dashboard/my-tasks"
        className={cn(
          "flex items-center gap-2 rounded-lg px-3 py-2 text-sm transition-colors",
          isActive("/dashboard/my-tasks")
            ? "bg-accent text-accent-foreground"
            : "hover:bg-accent hover:text-accent-foreground",
        )}
      >
        <CheckCircle2 className="h-4 w-4" />
        <span>My Tasks</span>
      </Link>
      <Link
        href="/dashboard/upcoming"
        className={cn(
          "flex items-center gap-2 rounded-lg px-3 py-2 text-sm transition-colors",
          isActive("/dashboard/upcoming")
            ? "bg-accent text-accent-foreground"
            : "hover:bg-accent hover:text-accent-foreground",
        )}
      >
        <Clock className="h-4 w-4" />
        <span>Upcoming</span>
      </Link>

      {(user.role === "ADMIN" || user.role === "MANAGER") && (
        <>
          <div className="my-1 border-t" />
          <Link
            href="/dashboard/team"
            className={cn(
              "flex items-center gap-2 rounded-lg px-3 py-2 text-sm transition-colors",
              isActive("/dashboard/team")
                ? "bg-accent text-accent-foreground"
                : "hover:bg-accent hover:text-accent-foreground",
            )}
          >
            <Users className="h-4 w-4" />
            <span>Team</span>
          </Link>
          {user.role === "ADMIN" && (
            <Link
              href="/dashboard/analytics"
              className={cn(
                "flex items-center gap-2 rounded-lg px-3 py-2 text-sm transition-colors",
                isActive("/dashboard/analytics")
                  ? "bg-accent text-accent-foreground"
                  : "hover:bg-accent hover:text-accent-foreground",
              )}
            >
              <BarChart3 className="h-4 w-4" />
              <span>Analytics</span>
            </Link>
          )}
        </>
      )}

      <div className="my-1 border-t" />
      <Link
        href="/dashboard/settings"
        className={cn(
          "flex items-center gap-2 rounded-lg px-3 py-2 text-sm transition-colors",
          isActive("/dashboard/settings")
            ? "bg-accent text-accent-foreground"
            : "hover:bg-accent hover:text-accent-foreground",
        )}
      >
        <Settings className="h-4 w-4" />
        <span>Settings</span>
      </Link>
    </nav>
  )
}
