"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { formatDistanceToNow, format } from "date-fns"
import { AlertCircle, Calendar, Clock, Edit, MessageSquare, MoreHorizontal, Trash } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Textarea } from "@/components/ui/textarea"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { EditTaskDialog } from "@/components/tasks/edit-task-dialog"
import { toast } from "@/components/ui/use-toast"

interface Comment {
  id: string
  content: string
  createdAt: Date
  user: {
    id: string
    name?: string | null
    image?: string | null
  }
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
    email?: string | null
    image?: string | null
  }
  assignee: {
    id: string
    name?: string | null
    email?: string | null
    image?: string | null
  }
  comments: Comment[]
}

interface TaskDetailProps {
  task: Task
  users: {
    id: string
    name?: string | null
    email?: string | null
    image?: string | null
  }[]
  currentUser: {
    id: string
    name?: string | null
    email?: string | null
    image?: string | null
    role?: string
  }
}

export function TaskDetail({ task, users, currentUser }: TaskDetailProps) {
  const router = useRouter()
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [comment, setComment] = useState("")
  const [isSubmittingComment, setIsSubmittingComment] = useState(false)

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

  const canEdit =
    currentUser.id === task.creatorId || currentUser.id === task.assigneeId || currentUser.role === "ADMIN"

  const canDelete = currentUser.id === task.creatorId || currentUser.role === "ADMIN"

  const handleDeleteTask = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/tasks/${task.id}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        throw new Error("Failed to delete task")
      }

      toast({
        title: "Task deleted",
        description: "The task has been deleted successfully.",
      })

      router.push("/dashboard/tasks")
      router.refresh()
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete the task. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!comment.trim()) return

    setIsSubmittingComment(true)

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/tasks/${task.id}/comments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          content: comment,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to add comment")
      }

      setComment("")
      toast({
        title: "Comment added",
        description: "Your comment has been added successfully.",
      })

      router.refresh()
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add comment. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmittingComment(false)
    }
  }

  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold tracking-tight">{task.title}</h1>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span>Created by {task.creator.name}</span>
            <span>•</span>
            <span>{formatDistanceToNow(new Date(task.dueDate), { addSuffix: true })}</span>
          </div>
        </div>

        {(canEdit || canDelete) && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <MoreHorizontal className="h-4 w-4" />
                <span className="sr-only">Actions</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {canEdit && (
                <DropdownMenuItem onClick={() => setEditDialogOpen(true)}>
                  <Edit className="mr-2 h-4 w-4" />
                  Edit task
                </DropdownMenuItem>
              )}
              {canDelete && (
                <>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={() => setDeleteDialogOpen(true)}
                    className="text-red-600 dark:text-red-400"
                  >
                    <Trash className="mr-2 h-4 w-4" />
                    Delete task
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Description</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="prose dark:prose-invert max-w-none">
                {task.description || <p className="text-muted-foreground italic">No description provided</p>}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Comments</CardTitle>
              <Badge variant="outline">
                <MessageSquare className="mr-1 h-3 w-3" />
                {task.comments.length}
              </Badge>
            </CardHeader>
            <CardContent className="space-y-4">
              <form onSubmit={handleSubmitComment} className="space-y-2">
                <Textarea
                  placeholder="Add a comment..."
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  className="min-h-[100px]"
                />
                <div className="flex justify-end">
                  <Button type="submit" disabled={isSubmittingComment}>
                    {isSubmittingComment ? "Posting..." : "Post Comment"}
                  </Button>
                </div>
              </form>

              {task.comments.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <MessageSquare className="h-10 w-10 text-muted-foreground mb-2" />
                  <p className="text-muted-foreground">No comments yet</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {task.comments.map((comment) => (
                    <div key={comment.id} className="flex gap-4">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={comment.user.image || ""} alt={comment.user.name || ""} />
                        <AvatarFallback>{comment.user.name?.charAt(0) || "U"}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1 space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{comment.user.name}</span>
                          <span className="text-xs text-muted-foreground">
                            {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}
                          </span>
                        </div>
                        <p className="text-sm">{comment.content}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Status</span>
                <Badge className={getStatusColor(task.status)}>{formatStatus(task.status)}</Badge>
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Priority</span>
                <Badge variant="outline" className={getPriorityColor(task.priority)}>
                  {task.priority}
                </Badge>
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Due Date</span>
                <div className="flex items-center text-sm">
                  <Calendar className="mr-1 h-3 w-3" />
                  {format(new Date(task.dueDate), "MMM d, yyyy")}
                </div>
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Time Remaining</span>
                <div className="flex items-center text-sm">
                  <Clock className="mr-1 h-3 w-3" />
                  {new Date(task.dueDate) < new Date() && task.status !== "COMPLETED" ? (
                    <span className="text-red-500 font-medium">Overdue</span>
                  ) : (
                    formatDistanceToNow(new Date(task.dueDate), { addSuffix: true })
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>People</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Assignee</span>
                <div className="flex items-center gap-2">
                  <Avatar className="h-6 w-6">
                    <AvatarImage src={task.assignee?.image || ""} alt={task.assignee?.name || ""} />
                    <AvatarFallback>{task.assignee?.name?.charAt(0) || "U"}</AvatarFallback>
                  </Avatar>
                  <span className="text-sm">{task.assignee?.name}</span>
                </div>
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Created by</span>
                <div className="flex items-center gap-2">
                  <Avatar className="h-6 w-6">
                    <AvatarImage src={task.creator?.image || ""} alt={task.creator?.name || ""} />
                    <AvatarFallback>{task.creator?.name?.charAt(0) || "U"}</AvatarFallback>
                  </Avatar>
                  <span className="text-sm">{task.creator?.name}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {task.status !== "COMPLETED" && task.assigneeId === currentUser.id && (
            <Card>
              <CardHeader>
                <CardTitle>Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button
                  className="w-full"
                  onClick={() => {
                    setEditDialogOpen(true)
                  }}
                >
                  Mark as {task.status === "TODO" ? "In Progress" : "Completed"}
                </Button>
                {new Date(task.dueDate) < new Date() && (
                  <div className="flex items-center gap-2 mt-2 p-2 rounded-md bg-red-100 dark:bg-red-900/20">
                    <AlertCircle className="h-4 w-4 text-red-500" />
                    <span className="text-xs text-red-500">This task is overdue</span>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      <EditTaskDialog task={task} users={users} open={editDialogOpen} onOpenChange={setEditDialogOpen} />

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the task and all associated comments.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteTask} className="bg-red-600 hover:bg-red-700">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
