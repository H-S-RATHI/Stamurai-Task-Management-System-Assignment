"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { TaskList } from "@/components/tasks/task-list"

export default function TasksPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [tasks, setTasks] = useState([])
  const [users, setUsers] = useState([])
  const [currentUser, setCurrentUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem("token")
    if (!token) {
      router.push("/signin")
      return
    }

    const fetchData = async () => {
      try {
        // Build query params for search, status, priority
        const params = new URLSearchParams()
        const search = searchParams.get("search")
        const status = searchParams.get("status")
        const priority = searchParams.get("priority")
        if (search) params.append("search", search)
        if (status) params.append("status", status)
        if (priority) params.append("priority", priority)

        // Fetch tasks
        const tasksRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/tasks?${params.toString()}`, {
          headers: { Authorization: `Bearer ${token}` }
        })
        if (!tasksRes.ok) throw new Error("Auth error")
        setTasks(await tasksRes.json())

        // Fetch users
        const usersRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/users`, {
          headers: { Authorization: `Bearer ${token}` }
        })
        if (!usersRes.ok) throw new Error("Auth error")
        setUsers(await usersRes.json())

        // Fetch current user
        const userRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/me`, {
          headers: { Authorization: `Bearer ${token}` }
        })
        if (!userRes.ok) throw new Error("Auth error")
        setCurrentUser(await userRes.json())
      } catch (e) {
        localStorage.removeItem("token")
        router.push("/signin")
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [router, searchParams])

  if (loading) return <div>Loading...</div>

  return <TaskList tasks={tasks} users={users} currentUser={currentUser || { id: '', name: '', email: '', image: '' }} searchParams={Object.fromEntries(searchParams.entries())} />
}
