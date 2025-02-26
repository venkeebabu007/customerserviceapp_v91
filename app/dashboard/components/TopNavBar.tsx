"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/utils/supabase/client"
import type { User } from "@/lib/mockData"
import { Button } from "@/components/ui/button"
import { useTheme } from "@/components/ThemeProvider"
import { Moon, Sun, Bell } from "lucide-react"

export const TopNavBar = ({ user }: { user: User }) => {
  const [isLoggingOut, setIsLoggingOut] = useState(false)
  const router = useRouter()
  const { theme, setTheme } = useTheme()

  const handleLogout = async () => {
    setIsLoggingOut(true)
    const supabase = createClient()

    try {
      await supabase.auth.signOut()
      router.push("/login")
    } catch (error) {
      console.error("Error during logout:", error)
    } finally {
      setIsLoggingOut(false)
    }
  }

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light")
  }

  return (
    <nav className="bg-white dark:bg-gray-800 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <span className="text-xl font-semibold text-gray-900 dark:text-white">Welcome, {user.name}</span>
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="icon" aria-label="Toggle Theme" onClick={toggleTheme}>
              {theme === "light" ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
            </Button>
            <Button variant="ghost" size="icon" aria-label="Notifications">
              <Bell className="h-5 w-5" />
            </Button>
            <Button
              onClick={handleLogout}
              disabled={isLoggingOut}
              className="bg-pink-600 hover:bg-pink-700 text-white text-sm px-3 py-1"
            >
              {isLoggingOut ? "Logging out..." : "Logout"}
            </Button>
          </div>
        </div>
      </div>
    </nav>
  )
}

export default TopNavBar

