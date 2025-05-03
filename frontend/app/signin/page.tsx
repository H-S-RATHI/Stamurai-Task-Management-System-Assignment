"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { SignInForm } from "@/components/auth/signin-form"

export default function SignInPage() {
  const router = useRouter()

  useEffect(() => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("token")
      if (token) {
        router.replace("/dashboard")
      }
    }
  }, [router])

  return (
    <div className="flex min-h-screen w-full items-center justify-center">
      <SignInForm />
    </div>
  )
}
