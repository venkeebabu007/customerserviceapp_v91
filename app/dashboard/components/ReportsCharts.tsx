"use client"

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"

interface AgentPerformance {
  agentId: string
  agentName: string
  ticketsResolved: number
  averageResolutionTime: number
}

interface ChartData {
  date: string
  newTickets: number
  resolvedTickets: number
}

interface ReportsChartsProps {
  chartData: ChartData[]
  agentPerformance: AgentPerformance[]
  unresolvedTickets: number
}

export default function ReportsCharts({ chartData, agentPerformance, unresolvedTickets }: ReportsChartsProps) {
  return (
    <div className="space-y-6">
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4">Ticket Trends</h2>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="newTickets" fill="#8884d8" name="New Tickets" />
              <Bar dataKey="resolvedTickets" fill="#82ca9d" name="Resolved Tickets" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4">Agent Performance</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white">
            <thead>
              <tr className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
                <th className="py-3 px-6 text-left">Agent Name</th>
                <th className="py-3 px-6 text-left">Tickets Resolved</th>
                <th className="py-3 px-6 text-left">Avg. Resolution Time (hours)</th>
              </tr>
            </thead>
            <tbody className="text-gray-600 text-sm font-light">
              {agentPerformance.map((agent) => (
                <tr key={agent.agentId} className="border-b border-gray-200 hover:bg-gray-100">
                  <td className="py-3 px-6">{agent.agentName}</td>
                  <td className="py-3 px-6">{agent.ticketsResolved}</td>
                  <td className="py-3 px-6">{agent.averageResolutionTime.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div>
        <h2 className="text-2xl font-bold mb-4">Unresolved Tickets</h2>
        <p className="text-4xl font-bold text-red-500">{unresolvedTickets}</p>
      </div>
    </div>
  )
}

