"use client"

import { useState, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"
import type { User } from "../../lib/mockData"
import { Toaster } from "react-hot-toast"
import { AppSidebar } from "@/app/dashboard/components/Sidebar"
import TopNavBar from "@/app/dashboard/components/TopNavBar"
import { SidebarProvider } from "@/components/ui/sidebar"
import { createClient } from "@/utils/supabase/client"
import { useAuthStore } from "@/lib/store"
import type React from "react"
import { ThemeProvider } from "@/components/ThemeProvider"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()
  const setUserRole = useAuthStore((state) => state.setUserRole)

  const checkUser = useCallback(async () => {
    const supabase = createClient()

    try {
      const {
        data: { session },
      } = await supabase.auth.getSession()

      if (session) {
        let { data: user, error: userError } = await supabase
          .from("users_csapp")
          .select("*")
          .eq("auth_user_id", session.user.id)
          .maybeSingle()

        if (userError) {
          console.error("Error fetching user data:", userError)
          throw userError
        }

        if (!user) {
          // If user doesn't exist in the database, create a new user record
          const { data: newUser, error: createError } = await supabase
            .from("users_csapp")
            .insert({
              auth_user_id: session.user.id,
              email: session.user.email,
              name: session.user.user_metadata.full_name || session.user.email,
              role: "agent", // Default role, adjust as needed
            })
            .single()

          if (createError) {
            console.error("Error creating new user:", createError)
            throw createError
          }

          user = newUser
        }

        setCurrentUser(user as User)
        setUserRole(user.role)
      } else {
        router.push("/login")
      }
    } catch (error) {
      console.error("Error checking user:", error)
      router.push("/login")
    } finally {
      setIsLoading(false)
    }
  }, [router, setUserRole])

  useEffect(() => {
    checkUser()

    const supabase = createClient()
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_OUT") {
        setCurrentUser(null)
        setUserRole(null)
        router.push("/login")
      } else if (event === "SIGNED_IN" && session) {
        checkUser()
      }
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [router, setUserRole, checkUser])

  if (isLoading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>
  }

  return (
    <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
      <SidebarProvider className="w-full">
        <Toaster position="top-right" />
        {currentUser ? (
          <div className="flex w-full min-h-screen">
            <AppSidebar />
            <div className="flex flex-col flex-grow overflow-hidden">
              <TopNavBar user={currentUser} />
              <main className="flex-grow overflow-x-hidden overflow-y-auto bg-gray-100 dark:bg-gray-900 p-4">
                <div className="w-full max-w-7xl mx-auto">{children}</div>
              </main>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900 w-full">
            {children}
          </div>
        )}
      </SidebarProvider>
    </ThemeProvider>
  )
}

