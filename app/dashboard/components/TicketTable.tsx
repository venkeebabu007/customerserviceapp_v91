import Link from "next/link"
import { Button } from "@/components/ui/button"

type Ticket = {
  id: string
  title: string
  status: string
  priority: string
  category: string
  assigned_agent?: { name: string } | null
}

type TicketTableProps = {
  tickets: Ticket[]
  showCreateButton?: boolean
}

export default function TicketTable({ tickets, showCreateButton = true }: TicketTableProps) {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold text-gray-700">All Tickets</h2>
        {showCreateButton && (
          <Link href="/dashboard/tickets/create">
            <Button className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
              Create New Ticket
            </Button>
          </Link>
        )}
      </div>

      <div className="bg-white shadow-md rounded-lg border border-gray-200">
        <table className="min-w-full divide-y divide-gray-200 w-full table-fixed">
          <thead className="bg-gray-50">
            <tr>
              <th
                scope="col"
                className="w-1/7 px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider truncate overflow-hidden"
              >
                ID
              </th>
              <th
                scope="col"
                className="w-1/7 px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Title
              </th>
              <th
                scope="col"
                className="w-1/7 px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Status
              </th>
              <th
                scope="col"
                className="w-1/7 px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Priority
              </th>
              <th
                scope="col"
                className="w-1/7 px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Category
              </th>
              <th
                scope="col"
                className="w-1/7 px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Assigned To
              </th>
              <th
                scope="col"
                className="w-1/7 px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {tickets.map((ticket) => (
              <tr key={ticket.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 truncate overflow-hidden">
                  {ticket.id}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{ticket.title}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{ticket.status}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{ticket.priority}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{ticket.category}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {ticket.assigned_agent ? ticket.assigned_agent.name : "Unassigned"}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <Link href={`/dashboard/tickets/${ticket.id}`} className="text-pink-600 hover:text-pink-800 mr-2">
                    View
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

