import { createClient } from "@/utils/supabase/server"
import { DashboardCard } from "./components/DashboardCard"
import TicketTable from "./components/TicketTable"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export const dynamic = "force-dynamic"

async function getTicketCounts() {
  const supabase = createClient()

  const { data: tickets, error } = await supabase.from("tickets_csapp").select("status")

  if (error) {
    console.error("Error fetching tickets:", error)
    return { openTickets: 0, inProgressTickets: 0, resolvedTickets: 0 }
  }

  const openTickets = tickets.filter((ticket) => ticket.status === "Open").length
  const inProgressTickets = tickets.filter((ticket) => ticket.status === "InProgress").length
  const resolvedTickets = tickets.filter((ticket) => ticket.status === "Resolved").length

  return { openTickets, inProgressTickets, resolvedTickets }
}

async function getCurrentUser() {
  const supabase = createClient()
  const {
    data: { session },
  } = await supabase.auth.getSession()
  if (!session) return null

  const { data: user, error } = await supabase
    .from("users_csapp")
    .select("name, role")
    .eq("auth_user_id", session.user.id)
    .single()

  if (error) {
    console.error("Error fetching current user:", error)
    return null
  }

  return user
}

async function getAllTickets() {
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
    return []
  }

  return tickets
}

export default async function DashboardPage() {
  console.log("Rendering DashboardPage")
  const { openTickets, inProgressTickets, resolvedTickets } = await getTicketCounts()
  const currentUser = await getCurrentUser()
  const allTickets = await getAllTickets()

  const openTicketsList = allTickets.filter((ticket) => ticket.status === "Open")
  const inProgressTicketsList = allTickets.filter((ticket) => ticket.status === "InProgress")
  const resolvedTicketsList = allTickets.filter((ticket) => ticket.status === "Resolved")

  return (
    <div className="space-y-6 w-full">
      <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <DashboardCard title="Open Tickets" count={openTickets} link="/dashboard/tickets?status=open" />
        <DashboardCard title="In Progress" count={inProgressTickets} link="/dashboard/tickets?status=in-progress" />
        <DashboardCard title="Resolved Tickets" count={resolvedTickets} link="/dashboard/tickets?status=resolved" />
      </div>

      {currentUser?.role === "manager" && (
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-2xl font-bold mb-4">Manager-Specific Features</h2>
          <ul className="list-disc pl-5 space-y-2">
            <li>View team performance metrics</li>
            <li>Assign tickets to agents</li>
            <li>Generate reports</li>
          </ul>
        </div>
      )}

      {currentUser?.role === "admin" && (
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-2xl font-bold mb-4">Admin-Specific Features</h2>
          <ul className="list-disc pl-5 space-y-2">
            <li>Manage user accounts</li>
            <li>Configure system settings</li>
            <li>View system logs</li>
          </ul>
        </div>
      )}

      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-2xl font-bold mb-4">Tickets</h2>
        <Tabs defaultValue="open">
          <TabsList>
            <TabsTrigger value="open">Open</TabsTrigger>
            <TabsTrigger value="inProgress">In Progress</TabsTrigger>
            <TabsTrigger value="resolved">Resolved</TabsTrigger>
          </TabsList>
          <TabsContent value="open">
            <TicketTable tickets={openTicketsList} showCreateButton={false} />
          </TabsContent>
          <TabsContent value="inProgress">
            <TicketTable tickets={inProgressTicketsList} showCreateButton={false} />
          </TabsContent>
          <TabsContent value="resolved">
            <TicketTable tickets={resolvedTicketsList} showCreateButton={false} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

