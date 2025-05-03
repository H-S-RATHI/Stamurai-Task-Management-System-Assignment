"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { LandingPage } from "@/components/landing-page"

export default function Home() {
  const router = useRouter()

  useEffect(() => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("token")
      if (token) {
        router.replace("/dashboard")
      }
    }
  }, [router])

  return <LandingPage />
}
