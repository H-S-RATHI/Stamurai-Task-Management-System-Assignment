"use client"

import { useEffect, useState, useCallback } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { TaskList } from "@/components/tasks/task-list"
import { CreateTaskDialog } from "@/components/tasks/create-task-dialog"
import { toast } from "@/components/ui/use-toast"
import type { Task, User } from "@/components/tasks/task-list"

export default function TasksPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [tasks, setTasks] = useState<Task[]>([])
  const [users, setUsers] = useState<User[]>([])
  const [currentUser, setCurrentUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [createTaskOpen, setCreateTaskOpen] = useState(false)

  const handleTaskCreated = async (newTask: Task) => {
    setTasks(prev => [...prev, newTask])
  }

  const fetchTasks = useCallback(async () => {
    setLoading(true)
    const token = localStorage.getItem("token")
    if (!token) {
      router.push("/signin")
      return
    }
    try {
      const params = new URLSearchParams()
      const search = searchParams.get("search")
      const status = searchParams.get("status")
      const priority = searchParams.get("priority")
      if (search) params.append("search", search)
      if (status) params.append("status", status)
      if (priority) params.append("priority", priority)

      const tasksRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/tasks?${params.toString()}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      if (!tasksRes.ok) {
        toast({ title: "Error", description: "Failed to fetch tasks", variant: "destructive" })
        console.error("Failed to fetch tasks", tasksRes.status, await tasksRes.text())
        throw new Error("Auth error")
      }
      const tasksData = await tasksRes.json()
      setTasks(tasksData)
      console.log("Fetched tasks:", tasksData)
      console.log("Tasks state after fetch:", tasksData)

      const usersRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/users`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      if (!usersRes.ok) {
        toast({ title: "Error", description: "Failed to fetch users", variant: "destructive" })
        console.error("Failed to fetch users", usersRes.status, await usersRes.text())
        throw new Error("Auth error")
      }
      const usersData = await usersRes.json()
      setUsers(usersData)
      console.log("Fetched users:", usersData)

      const userRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/me`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      if (!userRes.ok) {
        toast({ title: "Error", description: "Failed to fetch current user", variant: "destructive" })
        console.error("Failed to fetch current user", userRes.status, await userRes.text())
        throw new Error("Auth error")
      }
      const currentUserData = await userRes.json()
      setCurrentUser(currentUserData)
      console.log("Fetched current user:", currentUserData)
    } catch (e) {
      toast({ title: "Error", description: "An error occurred while fetching data", variant: "destructive" })
      console.error("Error in fetchTasks:", e)
      localStorage.removeItem("token")
      router.push("/signin")
    } finally {
      setLoading(false)
    }
  }, [router, searchParams])

  useEffect(() => {
    fetchTasks()
  }, [fetchTasks])

  return (
    <>
      <CreateTaskDialog
        open={createTaskOpen}
        onOpenChange={setCreateTaskOpen}
        onTaskCreated={handleTaskCreated}
        users={users}
      />
      <TaskList
        tasks={tasks}
        users={users}
        currentUser={currentUser || { id: '', name: '', email: '', image: '' }}
        searchParams={Object.fromEntries(searchParams.entries())}
        loading={loading}
        onTaskDeleted={(deletedId) => setTasks(tasks => tasks.filter(task => task.id !== deletedId))}
        onTaskCreated={handleTaskCreated}
      />
    </>
  )
}
