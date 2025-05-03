import Link from "next/link"
import { Button } from "@/components/ui/button"
import { CheckCircle, Users, Bell, Search, Shield, Clock } from "lucide-react"

export function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="px-4 lg:px-6 h-16 flex items-center">
        <Link href="/" className="flex items-center justify-center">
          <CheckCircle className="h-6 w-6 text-primary" />
          <span className="ml-2 text-xl font-bold">TaskFlow</span>
        </Link>
        <nav className="ml-auto flex gap-4 sm:gap-6">
          <Link href="/signin" className="text-sm font-medium hover:underline underline-offset-4">
            Sign In
          </Link>
          <Link href="/signup" className="text-sm font-medium hover:underline underline-offset-4">
            Sign Up
          </Link>
        </nav>
      </header>
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 xl:grid-cols-2">
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-2">
                  <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">
                    Manage Tasks, Boost Productivity
                  </h1>
                  <p className="max-w-[600px] text-gray-500 md:text-xl dark:text-gray-400">
                    TaskFlow helps your team stay organized, meet deadlines, and collaborate effectively.
                  </p>
                </div>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <Link href="/signup">
                    <Button size="lg">Get Started</Button>
                  </Link>
                  <Link href="/signin">
                    <Button size="lg" variant="outline">
                      Sign In
                    </Button>
                  </Link>
                </div>
              </div>
              <div className="flex items-center justify-center">
                <div className="relative w-full max-w-md">
                  <div className="p-4 bg-background border rounded-lg shadow-lg">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-medium">My Tasks</h3>
                      <span className="text-sm text-muted-foreground">Today</span>
                    </div>
                    <div className="space-y-3">
                      {[
                        { title: "Design new dashboard", priority: "High", completed: false },
                        { title: "Review project proposal", priority: "Medium", completed: true },
                        { title: "Team meeting", priority: "Low", completed: false },
                      ].map((task, i) => (
                        <div key={i} className="flex items-center p-2 border rounded-md">
                          <div
                            className={`w-3 h-3 rounded-full mr-3 ${
                              task.priority === "High"
                                ? "bg-red-500"
                                : task.priority === "Medium"
                                  ? "bg-yellow-500"
                                  : "bg-green-500"
                            }`}
                          />
                          <span className={task.completed ? "line-through text-muted-foreground" : ""}>
                            {task.title}
                          </span>
                          <span className="ml-auto text-xs text-muted-foreground">{task.priority}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32 bg-muted">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">Key Features</h2>
                <p className="max-w-[900px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
                  Everything you need to manage tasks and boost team productivity
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 py-12 md:grid-cols-2 lg:grid-cols-3">
              <div className="flex flex-col items-center space-y-2 rounded-lg border p-6 shadow-sm">
                <CheckCircle className="h-12 w-12 text-primary" />
                <h3 className="text-xl font-bold">Task Management</h3>
                <p className="text-center text-sm text-gray-500 dark:text-gray-400">
                  Create, assign, and track tasks with ease. Set priorities, due dates, and statuses.
                </p>
              </div>
              <div className="flex flex-col items-center space-y-2 rounded-lg border p-6 shadow-sm">
                <Users className="h-12 w-12 text-primary" />
                <h3 className="text-xl font-bold">Team Collaboration</h3>
                <p className="text-center text-sm text-gray-500 dark:text-gray-400">
                  Assign tasks to team members and collaborate effectively on projects.
                </p>
              </div>
              <div className="flex flex-col items-center space-y-2 rounded-lg border p-6 shadow-sm">
                <Bell className="h-12 w-12 text-primary" />
                <h3 className="text-xl font-bold">Notifications</h3>
                <p className="text-center text-sm text-gray-500 dark:text-gray-400">
                  Get notified when tasks are assigned to you or when there are updates.
                </p>
              </div>
              <div className="flex flex-col items-center space-y-2 rounded-lg border p-6 shadow-sm">
                <Search className="h-12 w-12 text-primary" />
                <h3 className="text-xl font-bold">Search & Filter</h3>
                <p className="text-center text-sm text-gray-500 dark:text-gray-400">
                  Quickly find tasks with powerful search and filtering capabilities.
                </p>
              </div>
              <div className="flex flex-col items-center space-y-2 rounded-lg border p-6 shadow-sm">
                <Shield className="h-12 w-12 text-primary" />
                <h3 className="text-xl font-bold">Role-Based Access</h3>
                <p className="text-center text-sm text-gray-500 dark:text-gray-400">
                  Control who can view, create, and manage tasks with different user roles.
                </p>
              </div>
              <div className="flex flex-col items-center space-y-2 rounded-lg border p-6 shadow-sm">
                <Clock className="h-12 w-12 text-primary" />
                <h3 className="text-xl font-bold">Deadline Tracking</h3>
                <p className="text-center text-sm text-gray-500 dark:text-gray-400">
                  Never miss a deadline with clear due date tracking and reminders.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full border-t px-4 md:px-6">
        <p className="text-xs text-gray-500 dark:text-gray-400">© 2024 TaskFlow. All rights reserved.</p>
        <nav className="sm:ml-auto flex gap-4 sm:gap-6">
          <Link className="text-xs hover:underline underline-offset-4" href="#">
            Terms of Service
          </Link>
          <Link className="text-xs hover:underline underline-offset-4" href="#">
            Privacy
          </Link>
        </nav>
      </footer>
    </div>
  )
}
