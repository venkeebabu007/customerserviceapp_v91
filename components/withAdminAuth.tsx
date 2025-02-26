"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuthStore } from "@/lib/store"
import type React from "react" // Added import for React

export function withAdminAuth<T>(WrappedComponent: React.ComponentType<T>) {
  return function WithAdminAuth(props: T) {
    const router = useRouter()
    const userRole = useAuthStore((state) => state.userRole)

    useEffect(() => {
      if (userRole !== "admin") {
        router.push("/dashboard")
      }
    }, [userRole, router])

    if (userRole !== "admin") {
      return null // or a loading spinner
    }

    return <WrappedComponent {...props} />
  }
}

