"use client"

import { useEffect, useState, use } from "react"
import { useRouter } from "next/navigation"
import { TaskDetail } from "@/components/tasks/task-detail"

export default function TaskDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [task, setTask] = useState(null)
  const [users, setUsers] = useState([])
  const [currentUser, setCurrentUser] = useState(null)
  const [loading, setLoading] = useState(true)

  const { id } = params

  useEffect(() => {
    const token = localStorage.getItem("token")
    if (!token) {
      router.push("/signin")
      return
    }

    const fetchData = async () => {
      try {
        // Fetch task details
        const taskRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/tasks/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        })
        if (taskRes.status === 404) {
          router.push("/dashboard/tasks")
          return
        }
        if (!taskRes.ok) throw new Error("Auth error")
        setTask(await taskRes.json())

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
  }, [router, id])

  if (loading) return <div>Loading...</div>
  if (!task) return null

  return <TaskDetail task={task} users={users} currentUser={currentUser || { id: '', name: '', email: '', image: '' }} />
}
