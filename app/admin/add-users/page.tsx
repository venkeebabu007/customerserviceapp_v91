"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/utils/supabase/client"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { User } from "@/lib/mockData"
import { useAuthStore } from "@/lib/store"

export default function AddUsersPage() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [role, setRole] = useState<"agent" | "manager">("agent")
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(false) // Added loading state
  const router = useRouter()
  const [isAdmin, setIsAdmin] = useState(false)
  const userRole = useAuthStore((state) => state.userRole)

  useEffect(() => {
    const userJson = localStorage.getItem("currentUser")
    if (userJson) {
      const user = JSON.parse(userJson)
      setCurrentUser(user)
    }

    if (userRole !== "admin") {
      router.push("/")
    } else {
      setIsAdmin(true)
    }
  }, [userRole, router])

  console.log("Rendering AddUsersPage, current user:", isAdmin)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setSuccess("")
    setIsLoading(true)

    try {
      const { data: authData, error: authError } = await createClient().auth.signUp({
        email,
        password,
      })

      if (authError) {
        if (authError.status === 422 && authError.message === "User already registered") {
          setError("A user with this email already exists. Please use a different email.")
        } else {
          throw authError
        }
        return
      }

      if (authData.user) {
        const { error: insertError } = await createClient().from("users_csapp").upsert({
          auth_user_id: authData.user.id,
          email: email,
          name: name,
          role: role,
          is_active: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })

        if (insertError) throw insertError

        setSuccess("User created successfully!")
        setName("")
        setEmail("")
        setPassword("")
        setRole("agent")
      }
    } catch (e) {
      console.error("Error during sign-up:", e)
      setError(e instanceof Error ? e.message : "An error occurred during sign-up")
    } finally {
      setIsLoading(false)
    }
  }

  if (!isAdmin) {
    return null
  }

  return (
    <div className="max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-4">Add New User</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="name">Name</Label>
          <Input id="name" value={name} onChange={(e) => setName(e.target.value)} required />
        </div>
        <div>
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </div>
        <div>
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <div>
          <Label htmlFor="role">Role</Label>
          <Select value={role} onValueChange={(value: "agent" | "manager") => setRole(value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select a role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="agent">Agent</SelectItem>
              <SelectItem value="manager">Manager</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Button type="submit" disabled={isLoading}>
          {" "}
          {/* Updated button with loading state */}
          {isLoading ? "Adding User..." : "Add User"}
        </Button>
      </form>
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mt-4" role="alert">
          <strong className="font-bold">Error: </strong>
          <span className="block sm:inline">{error}</span>
          <pre className="mt-2 text-xs">{JSON.stringify(error, null, 2)}</pre>
        </div>
      )}
      {success && (
        <div
          className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mt-4"
          role="alert"
        >
          <strong className="font-bold">Success: </strong>
          <span className="block sm:inline">{success}</span>
        </div>
      )}
    </div>
  )
}

