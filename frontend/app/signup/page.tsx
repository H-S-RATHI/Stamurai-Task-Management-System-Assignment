"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { SignUpForm } from "@/components/auth/signup-form"

export default function SignInPage() {
  const router = useRouter()

  useEffect(() => {
    // Check for token in localStorage
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("token")
      if (token) {
        router.replace("/dashboard")
      }
    }
  }, [router])

  return (
    <div className="flex min-h-screen w-full items-center justify-center">
      <SignUpForm />
    </div>
  )
}
