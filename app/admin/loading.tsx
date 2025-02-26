import { Loader2 } from "lucide-react"

export default function AdminLoading() {
  return (
    <div className="flex items-center justify-center h-screen">
      <Loader2 className="w-8 h-8 animate-spin text-primary" />
      <span className="ml-2 text-lg font-medium">Loading admin panel...</span>
    </div>
  )
}

