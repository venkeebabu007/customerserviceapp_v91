import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import AdminLoading from "./loading"
import { Suspense, type ReactNode } from "react"

export const dynamic = "force-dynamic"

export default async function AdminLayout({
  children,
}: {
  children: ReactNode
}) {
  const supabase = createServerComponentClient({ cookies })

  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    redirect("/login")
  }

  // Check if the user is an admin
  const { data: userData, error } = await supabase
    .from("users_csapp")
    .select("role")
    .eq("auth_user_id", session.user.id)
    .single()

  if (error || userData?.role !== "admin") {
    console.error("Error fetching user role or user is not an admin:", error)
    redirect("/dashboard")
  }

  return (
    <div className="admin-layout">
      <Suspense fallback={<AdminLoading />}>{children}</Suspense>
    </div>
  )
}

