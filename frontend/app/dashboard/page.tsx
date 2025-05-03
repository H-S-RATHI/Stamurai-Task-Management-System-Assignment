"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { DashboardOverview } from "@/components/dashboard/overview"

export default function DashboardPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [assignedTasks, setAssignedTasks] = useState([])
  const [createdTasks, setCreatedTasks] = useState([])
  const [overdueTasks, setOverdueTasks] = useState([])
  const [user, setUser] = useState(null)

  useEffect(() => {
    const token = localStorage.getItem("token")
    if (!token) {
      router.push("/signin")
      return
    }

    // Optionally decode user info from token here, or fetch from backend
    // setUser(decodedUser)

    const fetchData = async () => {
      try {
        const [assignedRes, createdRes, overdueRes, userRes] = await Promise.all([
          fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/tasks/assigned`, { headers: { Authorization: `Bearer ${token}` } }),
          fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/tasks/created`, { headers: { Authorization: `Bearer ${token}` } }),
          fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/tasks/overdue`, { headers: { Authorization: `Bearer ${token}` } }),
          fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/me`, { headers: { Authorization: `Bearer ${token}` } }),
        ])
        if (!assignedRes.ok || !createdRes.ok || !overdueRes.ok || !userRes.ok) {
          throw new Error("Auth error")
        }
        setAssignedTasks(await assignedRes.json())
        setCreatedTasks(await createdRes.json())
        setOverdueTasks(await overdueRes.json())
        setUser(await userRes.json())
      } catch (e) {
        localStorage.removeItem("token")
        router.push("/signin")
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [router])

  if (loading) return <div>Loading...</div>

  return (
    <DashboardOverview
      assignedTasks={assignedTasks}
      createdTasks={createdTasks}
      overdueTasks={overdueTasks}
      user={user || { id: '', name: '', email: '', image: '', role: '' }}
    />
  )
}
