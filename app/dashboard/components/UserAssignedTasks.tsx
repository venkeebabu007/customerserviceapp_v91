"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/utils/supabase/client"
import Link from "next/link"

type Ticket = {
  id: string
  title: string
  status: string
  priority: string
}

export default function UserAssignedTasks() {
  const [assignedTickets, setAssignedTickets] = useState<Ticket[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchAssignedTickets = async () => {
      const supabase = createClient()
      const {
        data: { session },
      } = await supabase.auth.getSession()

      if (session) {
        const { data: userData, error: userError } = await supabase
          .from("users_csapp")
          .select("id")
          .eq("auth_user_id", session.user.id)
          .single()

        if (userError) {
          console.error("Error fetching user data:", userError)
          setIsLoading(false)
          return
        }

        const { data: tickets, error: ticketsError } = await supabase
          .from("tickets_csapp")
          .select("id, title, status, priority")
          .eq("assigned_agent_id", userData.id)
          .order("created_at", { ascending: false })
          .limit(5)

        if (ticketsError) {
          console.error("Error fetching assigned tickets:", ticketsError)
        } else {
          setAssignedTickets(tickets || [])
        }
      }
      setIsLoading(false)
    }

    fetchAssignedTickets()
  }, [])

  if (isLoading) {
    return <div>Loading assigned tasks...</div>
  }

  if (assignedTickets.length === 0) {
    return <div>No tasks currently assigned to you.</div>
  }

  return (
    <div className="bg-white shadow-md rounded-lg p-6 mb-6">
      <h2 className="text-2xl font-bold mb-4">Your Assigned Tasks</h2>
      <ul className="space-y-2">
        {assignedTickets.map((ticket) => (
          <li key={ticket.id} className="flex justify-between items-center border-b pb-2">
            <Link href={`/dashboard/tickets/${ticket.id}`} className="text-blue-600 hover:underline">
              {ticket.title}
            </Link>
            <div className="flex space-x-2">
              <span className={`px-2 py-1 rounded text-xs ${getStatusColor(ticket.status)}`}>{ticket.status}</span>
              <span className={`px-2 py-1 rounded text-xs ${getPriorityColor(ticket.priority)}`}>
                {ticket.priority}
              </span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}

function getStatusColor(status: string) {
  switch (status) {
    case "Open":
      return "bg-yellow-200 text-yellow-800"
    case "InProgress":
      return "bg-blue-200 text-blue-800"
    case "Resolved":
      return "bg-green-200 text-green-800"
    default:
      return "bg-gray-200 text-gray-800"
  }
}

function getPriorityColor(priority: string) {
  switch (priority) {
    case "High":
      return "bg-red-200 text-red-800"
    case "Medium":
      return "bg-orange-200 text-orange-800"
    case "Low":
      return "bg-green-200 text-green-800"
    default:
      return "bg-gray-200 text-gray-800"
  }
}

