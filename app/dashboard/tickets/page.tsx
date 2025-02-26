import { createClient } from "@/utils/supabase/server"
import UserAssignedTasks from "../components/UserAssignedTasks"
import TicketTable from "../components/TicketTable"

export const dynamic = "force-dynamic"

export default async function TicketsPage() {
  const supabase = createClient()

  const { data: tickets, error } = await supabase
    .from("tickets_csapp")
    .select(`
    *,
    assigned_agent:users_csapp(name)
  `)
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching tickets:", error)
    return <div>Error loading tickets. Please try again later.</div>
  }

  return (
    <div className="bg-gray-100 min-h-screen p-8">
      <div className="max-w-7xl mx-auto bg-white rounded-lg shadow-md p-4 space-y-6">
        <div className="border-b pb-4">
          <h1 className="text-3xl font-bold text-gray-800">Ticket Management</h1>
        </div>

        <UserAssignedTasks />

        <TicketTable tickets={tickets} />
      </div>
    </div>
  )
}

