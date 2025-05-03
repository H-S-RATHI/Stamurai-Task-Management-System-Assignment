"use client"

import { useEffect, useState, use } from "react"
import { useRouter } from "next/navigation"
import { TaskDetail } from "@/components/tasks/task-detail"
import { toast } from "@/components/ui/use-toast"

export default function TaskDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter()
  const [task, setTask] = useState(null)
  const [users, setUsers] = useState([])
  const [currentUser, setCurrentUser] = useState(null)
  const [loading, setLoading] = useState(true)

  // Unwrap params using React.use()
  const unwrappedParams = use(params)
  const { id } = unwrappedParams

  console.log('[TaskDetailPage] Params:', params)
  console.log('[TaskDetailPage] Unwrapped Params:', unwrappedParams)
  console.log('[TaskDetailPage] Task ID:', id)

  useEffect(() => {
    console.log('[TaskDetailPage] useEffect triggered')
    console.log('[TaskDetailPage] Current ID:', id)
    
    const token = localStorage.getItem("token")
    console.log('[TaskDetailPage] Token:', token ? 'Present' : 'Not present')
    
    if (!token) {
      console.log('[TaskDetailPage] No token, redirecting to signin')
      router.push("/signin")
      return
    }

    const fetchData = async () => {
      try {
        console.log('[TaskDetailPage] Fetching task details')
        // Fetch task details
        const taskRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/tasks/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        })
        console.log('[TaskDetailPage] Task response status:', taskRes.status)
        
        if (taskRes.status === 404) {
          console.log('[TaskDetailPage] Task not found')
          toast({
            title: "Error",
            description: "Task not found",
            variant: "destructive"
          })
          router.push("/dashboard/tasks")
          return
        }
        if (!taskRes.ok) {
          console.log('[TaskDetailPage] Task fetch error')
          const error = await taskRes.json()
          console.error('[TaskDetailPage] Task fetch error details:', error)
          throw new Error(error.message || "Failed to fetch task")
        }
        
        const taskData = await taskRes.json()
        console.log('[TaskDetailPage] Task data:', taskData)
        setTask(taskData)

        // Fetch users
        console.log('[TaskDetailPage] Fetching users')
        const usersRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/users`, {
          headers: { Authorization: `Bearer ${token}` }
        })
        if (!usersRes.ok) {
          console.log('[TaskDetailPage] Users fetch error')
          const error = await usersRes.json()
          console.error('[TaskDetailPage] Users fetch error details:', error)
          throw new Error(error.message || "Failed to fetch users")
        }
        const usersData = await usersRes.json()
        console.log('[TaskDetailPage] Users data:', usersData)
        setUsers(usersData)

        // Fetch current user
        console.log('[TaskDetailPage] Fetching current user')
        const userRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/me`, {
          headers: { Authorization: `Bearer ${token}` }
        })
        if (!userRes.ok) {
          console.log('[TaskDetailPage] Current user fetch error')
          const error = await userRes.json()
          console.error('[TaskDetailPage] Current user fetch error details:', error)
          throw new Error(error.message || "Failed to fetch current user")
        }
        const userData = await userRes.json()
        console.log('[TaskDetailPage] Current user data:', userData)
        setCurrentUser(userData)
      } catch (e) {
        console.error('[TaskDetailPage] Error:', e)
        toast({
          title: "Error",
          description: e instanceof Error ? e.message : "An error occurred",
          variant: "destructive"
        })
        localStorage.removeItem("token")
        router.push("/signin")
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [router, id])

  if (loading) return <div className="flex items-center justify-center min-h-screen">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
  </div>
  
  if (!task) return <div className="flex items-center justify-center min-h-screen">
    <div className="text-center">
      <p className="text-xl font-semibold">Task not found</p>
      <p className="text-muted-foreground">The task you're looking for doesn't exist or has been deleted.</p>
      <Button onClick={() => router.push('/dashboard/tasks')} className="mt-4">
        Go back to tasks
      </Button>
    </div>
  </div>

  return (
    <TaskDetail 
      task={task} 
      users={users} 
      currentUser={currentUser || { id: '', name: '', email: '', image: '' }} 
    />
  )
}
