"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/utils/supabase/client"
import { Button } from "@/components/ui/button"
import { ImageModal } from "./ImageModal"

type Attachment = {
  id: string
  file_name: string
  file_url: string
  created_at: string
}

export default function TicketAttachments({ ticketId }: { ticketId: string }) {
  const [attachments, setAttachments] = useState<Attachment[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedImage, setSelectedImage] = useState<string | null>(null)

  useEffect(() => {
    const fetchAttachments = async () => {
      const supabase = createClient()
      const { data, error } = await supabase
        .from("attachments_csapp")
        .select("*")
        .eq("ticket_id", ticketId)
        .order("created_at", { ascending: false })

      if (error) {
        console.error("Error fetching attachments:", error)
      } else {
        setAttachments(data || [])
      }
      setIsLoading(false)
    }

    fetchAttachments()
  }, [ticketId])

  const handleImageClick = (fileUrl: string) => {
    setSelectedImage(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/attachments/${fileUrl}`)
  }

  const handleCloseModal = () => {
    setSelectedImage(null)
  }

  if (isLoading) {
    return <div>Loading attachments...</div>
  }

  if (attachments.length === 0) {
    return <div>No attachments found for this ticket.</div>
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Attachments</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {attachments.map((attachment) => (
          <div key={attachment.id} className="border rounded-lg p-4 flex flex-col">
            <div className="relative w-full h-40 mb-2">
              {attachment.file_url ? (
                <img
                  src={`${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/attachments/${attachment.file_url}`}
                  alt={attachment.file_name}
                  className="absolute inset-0 w-full h-full object-cover rounded-md cursor-pointer"
                  onClick={() => handleImageClick(attachment.file_url)}
                  onError={(e) => {
                    e.currentTarget.src = "/placeholder.svg"
                    e.currentTarget.alt = "Image not available"
                  }}
                />
              ) : (
                <div className="absolute inset-0 w-full h-full flex items-center justify-center bg-gray-200 rounded-md">
                  <span className="text-gray-500">No image available</span>
                </div>
              )}
            </div>
            <p className="font-semibold mb-2 truncate">{attachment.file_name}</p>
            <p className="text-sm text-gray-500 mb-4">
              Uploaded on: {new Date(attachment.created_at).toLocaleDateString()}
            </p>
            <div className="mt-auto">
              <Button onClick={() => handleImageClick(attachment.file_url)} className="w-full" variant="outline">
                View Full Image
              </Button>
            </div>
          </div>
        ))}
      </div>
      {selectedImage && <ImageModal imageUrl={selectedImage} onClose={handleCloseModal} />}
    </div>
  )
}

