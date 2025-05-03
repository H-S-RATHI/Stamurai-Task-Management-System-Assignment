"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { ChevronDown, Filter, Plus, Search, SlidersHorizontal } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { CreateTaskDialog } from "@/components/tasks/create-task-dialog"
import { formatDistanceToNow } from "date-fns"

interface User {
  id: string
  name?: string | null
  email?: string | null
  image?: string | null
}

interface Task {
  id: string
  title: string
  description: string
  status: string
  priority: string
  dueDate: Date
  creatorId: string
  assigneeId: string
  creator: {
    id: string
    name?: string | null
    image?: string | null
  }
  assignee: {
    id: string
    name?: string | null
    image?: string | null
  }
}

interface TaskListProps {
  tasks: Task[]
  users: User[]
  currentUser: User
  searchParams: { [key: string]: string | string[] | undefined }
  loading?: boolean
}

export function TaskList({ tasks, users, currentUser, searchParams, loading }: TaskListProps) {
  const router = useRouter()
  const urlSearchParams = useSearchParams()
  const [createTaskOpen, setCreateTaskOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState(urlSearchParams.get("search") || "")
  const [queryVersion, setQueryVersion] = useState(0)

  // Sync searchQuery with URL search param
  useEffect(() => {
    setSearchQuery(urlSearchParams.get("search") || "")
  }, [urlSearchParams])

  const statusFilter = urlSearchParams.get("status") || "ALL"
  const priorityFilter = urlSearchParams.get("priority") || "ALL"

  useEffect(() => {
    console.log("[DEBUG] statusFilter:", statusFilter)
    console.log("[DEBUG] priorityFilter:", priorityFilter)
  }, [statusFilter, priorityFilter])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()

    const params = new URLSearchParams(urlSearchParams.toString())

    if (searchQuery) {
      params.set("search", searchQuery)
    } else {
      params.delete("search")
    }

    router.push(`/dashboard/tasks?${params.toString()}`)
  }

  const handleStatusChange = (value: string) => {
    const params = new URLSearchParams(urlSearchParams.toString())

    if (value === "ALL") {
      params.delete("status")
    } else {
      params.set("status", value)
    }

    router.push(`/dashboard/tasks?${params.toString()}`)
  }

  const handlePriorityChange = (value: string) => {
    const params = new URLSearchParams(urlSearchParams.toString())

    if (value === "ALL") {
      params.delete("priority")
    } else {
      params.set("priority", value)
    }

    router.push(`/dashboard/tasks?${params.toString()}`)
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "HIGH":
        return "text-red-500 bg-red-100 dark:bg-red-900/20"
      case "MEDIUM":
        return "text-yellow-500 bg-yellow-100 dark:bg-yellow-900/20"
      case "LOW":
        return "text-green-500 bg-green-100 dark:bg-green-900/20"
      default:
        return "text-gray-500 bg-gray-100 dark:bg-gray-800"
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "TODO":
        return "text-blue-500 bg-blue-100 dark:bg-blue-900/20"
      case "IN_PROGRESS":
        return "text-purple-500 bg-purple-100 dark:bg-purple-900/20"
      case "COMPLETED":
        return "text-green-500 bg-green-100 dark:bg-green-900/20"
      default:
        return "text-gray-500 bg-gray-100 dark:bg-gray-800"
    }
  }

  const formatStatus = (status: string) => {
    switch (status) {
      case "TODO":
        return "To Do"
      case "IN_PROGRESS":
        return "In Progress"
      case "COMPLETED":
        return "Completed"
      default:
        return status
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Tasks</h1>
        <Button onClick={() => setCreateTaskOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Create Task
        </Button>
      </div>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <form onSubmit={handleSearch} className="flex items-center gap-2 sm:w-96">
          <Input
            placeholder="Search tasks..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="h-9"
          />
          <Button type="submit" size="sm" variant="ghost">
            <Search className="h-4 w-4" />
            <span className="sr-only">Search</span>
          </Button>
        </form>

        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="h-9">
                <Filter className="mr-2 h-4 w-4" />
                Status
                <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-40">
              <DropdownMenuLabel>Filter by Status</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuCheckboxItem
                checked={statusFilter === "ALL"}
                onCheckedChange={() => handleStatusChange("ALL")}
              >
                All
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={statusFilter === "TODO"}
                onCheckedChange={() => handleStatusChange("TODO")}
              >
                To Do
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={statusFilter === "IN_PROGRESS"}
                onCheckedChange={() => handleStatusChange("IN_PROGRESS")}
              >
                In Progress
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={statusFilter === "COMPLETED"}
                onCheckedChange={() => handleStatusChange("COMPLETED")}
              >
                Completed
              </DropdownMenuCheckboxItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="h-9">
                <SlidersHorizontal className="mr-2 h-4 w-4" />
                Priority
                <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-40">
              <DropdownMenuLabel>Filter by Priority</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuCheckboxItem
                checked={priorityFilter === "ALL"}
                onCheckedChange={() => handlePriorityChange("ALL")}
              >
                All
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={priorityFilter === "HIGH"}
                onCheckedChange={() => handlePriorityChange("HIGH")}
              >
                High
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={priorityFilter === "MEDIUM"}
                onCheckedChange={() => handlePriorityChange("MEDIUM")}
              >
                Medium
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={priorityFilter === "LOW"}
                onCheckedChange={() => handlePriorityChange("LOW")}
              >
                Low
              </DropdownMenuCheckboxItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-10">
          <span>Loading...</span>
        </div>
      ) : tasks.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center">
          <div className="mx-auto flex max-w-[420px] flex-col items-center justify-center text-center">
            <Filter className="h-10 w-10 text-muted-foreground mb-2" />
            <h3 className="mt-4 text-lg font-semibold">No tasks found</h3>
            <p className="mb-4 mt-2 text-sm text-muted-foreground">
              {searchQuery
                ? "No tasks match your search criteria. Try adjusting your search or filters."
                : "You don't have any tasks yet. Create your first task to get started."}
            </p>
            <Button onClick={() => setCreateTaskOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Create Task
            </Button>
          </div>
        </div>
      ) : (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Priority</TableHead>
                <TableHead>Assignee</TableHead>
                <TableHead>Due Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tasks.map((task) => (
                <TableRow key={task.id}>
                  <TableCell>
                    <Link href={`/dashboard/tasks/${task.id}`} className="font-medium hover:underline">
                      {task.title}
                    </Link>
                  </TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(task.status)}>{formatStatus(task.status)}</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className={getPriorityColor(task.priority)}>
                      {task.priority}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Avatar className="h-6 w-6">
                        <AvatarImage src={task.assignee?.image || ""} alt={task.assignee?.name || ""} />
                        <AvatarFallback>{task.assignee?.name?.charAt(0) || "U"}</AvatarFallback>
                      </Avatar>
                      <span className="text-sm">{task.assignee?.name || "Unassigned"}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span
                      className={
                        new Date(task.dueDate) < new Date() && task.status !== "COMPLETED"
                          ? "text-red-500 font-medium"
                          : ""
                      }
                    >
                      {formatDistanceToNow(new Date(task.dueDate), { addSuffix: true })}
                    </span>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      <CreateTaskDialog open={createTaskOpen} onOpenChange={setCreateTaskOpen} users={users} />
    </div>
  )
}
