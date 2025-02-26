"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { createClient } from "@/utils/supabase/client"
import { useAuthStore } from "@/lib/store"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarHeader,
  SidebarFooter,
} from "@/components/ui/sidebar"
import {
  Home,
  TicketIcon,
  BarChartIcon as ChartBarIcon,
  CogIcon as Cog6ToothIcon,
  ClipboardListIcon as ClipboardDocumentListIcon,
  UserPlusIcon,
} from "lucide-react"
import Image from "next/image"

export function AppSidebar() {
  const [userRole, setUserRole] = useState<string | null>(null)
  const pathname = usePathname()
  const authUserRole = useAuthStore((state) => state.userRole)

  useEffect(() => {
    const fetchUserRole = async () => {
      const supabase = createClient()
      const {
        data: { session },
      } = await supabase.auth.getSession()
      if (session) {
        const { data: userData, error } = await supabase
          .from("users_csapp")
          .select("role")
          .eq("auth_user_id", session.user.id)
          .single()

        if (error) {
          console.error("Error fetching user role:", error)
        } else {
          setUserRole(userData?.role)
        }
      }
    }

    fetchUserRole()
  }, [])

  const isLinkActive = (href: string) => {
    return pathname === href || pathname.startsWith(`${href}/`)
  }

  return (
    <Sidebar className="bg-white text-gray-800">
      <SidebarHeader className="p-4">
        <Image
          src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Gold%20Hetafu%20Logo%20(1)-LVzImrJyeWCPCHebJaQbx0pPE27uch.png"
          alt="Hetafu Logo"
          width={100}
          height={60}
          className="object-contain"
        />
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup className="pt-6">
          <SidebarGroupContent>
            <SidebarMenu className="bg-gray-100">
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link
                    href="/dashboard"
                    className={`${isLinkActive("/dashboard") ? "bg-blue-100 text-blue-800" : "text-gray-700 hover:bg-gray-200"} font-medium transition-colors duration-200 ease-in-out hover:text-blue-600`}
                  >
                    <Home className="mr-2" />
                    Dashboard
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link
                    href="/dashboard/tickets"
                    className={`${
                      isLinkActive("/dashboard/tickets")
                        ? "bg-blue-100 text-blue-800"
                        : "text-gray-700 hover:bg-gray-200"
                    } font-medium transition-colors duration-200 ease-in-out hover:text-blue-600`}
                  >
                    <TicketIcon className="mr-2" />
                    Tickets
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              {(userRole === "manager" ||
                userRole === "admin" ||
                authUserRole === "manager" ||
                authUserRole === "admin") && (
                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <Link
                      href="/dashboard/reports"
                      className={`${isLinkActive("/dashboard/reports") ? "bg-blue-100 text-blue-800" : "text-gray-700 hover:bg-gray-200"} font-medium transition-colors duration-200 ease-in-out hover:text-blue-600`}
                    >
                      <ChartBarIcon className="mr-2" />
                      Reports
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              )}
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link
                    href="/dashboard/settings"
                    className={`${isLinkActive("/dashboard/settings") ? "bg-blue-100 text-blue-800" : "text-gray-700 hover:bg-gray-200"} font-medium transition-colors duration-200 ease-in-out hover:text-blue-600`}
                  >
                    <Cog6ToothIcon className="mr-2" />
                    Settings
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              {(userRole === "admin" || authUserRole === "admin") && (
                <>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild>
                      <Link
                        href="/dashboard/audit"
                        className={`${isLinkActive("/dashboard/audit") ? "bg-blue-100 text-blue-800" : "text-gray-700 hover:bg-gray-200"} font-medium transition-colors duration-200 ease-in-out hover:text-blue-600`}
                      >
                        <ClipboardDocumentListIcon className="mr-2" />
                        Audit Logs
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild>
                      <Link
                        href="/dashboard/add-users"
                        className={`${isLinkActive("/dashboard/add-users") ? "bg-blue-100 text-blue-800" : "text-gray-700 hover:bg-gray-200"} font-medium transition-colors duration-200 ease-in-out hover:text-blue-600`}
                      >
                        <UserPlusIcon className="mr-2" />
                        Add Users
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </>
              )}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="p-4">
        <p className="text-sm text-gray-500">© 2024 Hetafu. All rights reserved.</p>
      </SidebarFooter>
    </Sidebar>
  )
}

