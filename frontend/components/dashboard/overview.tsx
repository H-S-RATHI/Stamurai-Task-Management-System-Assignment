"use client"

import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { AlertCircle, CheckCircle, Clock, ListTodo, Plus } from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import { useState } from "react"
import { CreateTaskDialog } from "@/components/tasks/create-task-dialog"

interface Task {
  id: string
  title: string
  description: string
  status: string
  priority: string
  dueDate: Date
  creatorId: string
  assigneeId: string
  creator?: {
    name?: string | null
    image?: string | null
  }
  assignee?: {
    name?: string | null
    image?: string | null
  }
}

interface OverviewProps {
  assignedTasks: Task[]
  createdTasks: Task[]
  overdueTasks: Task[]
  user: {
    id: string
    name?: string | null
    email?: string | null
    image?: string | null
    role?: string | null
  }
}

export function DashboardOverview({ assignedTasks, createdTasks, overdueTasks, user }: OverviewProps) {
  const [createTaskOpen, setCreateTaskOpen] = useState(false)

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
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <Button onClick={() => setCreateTaskOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Create Task
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row w-full items-center justify-center space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Tasks</CardTitle>
            <ListTodo className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{assignedTasks.length + createdTasks.length}</div>
            <p className="text-xs text-muted-foreground">{assignedTasks.length} assigned to you</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {assignedTasks.filter((task) => task.status === "COMPLETED").length}
            </div>
            <p className="text-xs text-muted-foreground">
              {Math.round(
                (assignedTasks.filter((task) => task.status === "COMPLETED").length / (assignedTasks.length || 1)) *
                  100,
              )}
              % completion rate
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">In Progress</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {assignedTasks.filter((task) => task.status === "IN_PROGRESS").length}
            </div>
            <p className="text-xs text-muted-foreground">
              {assignedTasks.filter((task) => task.status === "TODO").length} tasks not started
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Overdue</CardTitle>
            <AlertCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{overdueTasks.length}</div>
            <p className="text-xs text-muted-foreground">
              {overdueTasks.filter((task) => task.priority === "HIGH").length} high priority
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Tasks Assigned to You</CardTitle>
            <CardDescription>Your current tasks and their status</CardDescription>
          </CardHeader>
          <CardContent>
            {assignedTasks.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <ListTodo className="h-10 w-10 text-muted-foreground mb-2" />
                <p className="text-muted-foreground">No tasks assigned to you yet</p>
                <Button variant="outline" className="mt-4" onClick={() => setCreateTaskOpen(true)}>
                  Create a task
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {assignedTasks.slice(0, 5).map((task) => (
                  <div key={task.id} className="flex items-center justify-between space-x-4">
                    <div className="flex items-start space-x-4">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={task.creator?.image || ""} alt={task.creator?.name || ""} />
                        <AvatarFallback>{task.creator?.name?.charAt(0) || "U"}</AvatarFallback>
                      </Avatar>
                      <div>
                        <Link href={`/dashboard/tasks/${task.id}`} className="font-medium hover:underline">
                          {task.title}
                        </Link>
                        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                          <Badge variant="outline" className={getPriorityColor(task.priority)}>
                            {task.priority}
                          </Badge>
                          <span>•</span>
                          <span>Due {formatDistanceToNow(new Date(task.dueDate), { addSuffix: true })}</span>
                        </div>
                      </div>
                    </div>
                    <Badge className={getStatusColor(task.status)}>{formatStatus(task.status)}</Badge>
                  </div>
                ))}
                {assignedTasks.length > 5 && (
                  <Button variant="link" asChild className="mt-2">
                    <Link href="/dashboard/my-tasks">View all tasks</Link>
                  </Button>
                )}
              </div>
            )}
          </CardContent>
        </Card>
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Overdue Tasks</CardTitle>
            <CardDescription>Tasks that need immediate attention</CardDescription>
          </CardHeader>
          <CardContent>
            {overdueTasks.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <CheckCircle className="h-10 w-10 text-green-500 mb-2" />
                <p className="text-muted-foreground">No overdue tasks. Great job!</p>
              </div>
            ) : (
              <div className="space-y-4">
                {overdueTasks.slice(0, 4).map((task) => (
                  <div key={task.id} className="flex items-center space-x-4">
                    <div className="w-1 h-10 rounded-full bg-red-500" />
                    <div className="flex-1 space-y-1">
                      <Link href={`/dashboard/tasks/${task.id}`} className="font-medium hover:underline">
                        {task.title}
                      </Link>
                      <div className="text-sm text-muted-foreground">
                        Due {formatDistanceToNow(new Date(task.dueDate), { addSuffix: true })}
                      </div>
                    </div>
                    <Badge variant="outline" className={getPriorityColor(task.priority)}>
                      {task.priority}
                    </Badge>
                  </div>
                ))}
                {overdueTasks.length > 4 && (
                  <Button variant="link" asChild className="mt-2">
                    <Link href="/dashboard/my-tasks?status=OVERDUE">View all overdue</Link>
                  </Button>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <CreateTaskDialog open={createTaskOpen} onOpenChange={setCreateTaskOpen} />
    </div>
  )
}
