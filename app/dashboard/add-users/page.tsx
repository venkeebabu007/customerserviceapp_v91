"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/utils/supabase/client"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useAuthStore } from "@/lib/store"
import { toast } from "react-hot-toast"

export default function AddUsersPage() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [role, setRole] = useState<"agent" | "manager">("agent")
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const userRole = useAuthStore((state) => state.userRole)

  useEffect(() => {
    if (userRole !== "admin") {
      router.push("/dashboard")
    }
  }, [userRole, router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const supabase = createClient()

      // Create user in Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
      })

      if (authError) throw authError

      if (authData.user) {
        // Insert user into users_csapp table
        const { error: insertError } = await supabase.from("users_csapp").insert({
          auth_user_id: authData.user.id,
          name,
          email,
          role,
          is_active: true,
        })

        if (insertError) throw insertError

        toast.success("User created successfully!")
        setName("")
        setEmail("")
        setPassword("")
        setRole("agent")
      }
    } catch (error) {
      console.error("Error creating user:", error)
      toast.error("Failed to create user. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  if (userRole !== "admin") {
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
          {isLoading ? "Adding User..." : "Add User"}
        </Button>
      </form>
    </div>
  )
}

