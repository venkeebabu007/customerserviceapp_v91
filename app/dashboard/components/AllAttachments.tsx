"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/utils/supabase/client"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ImageModal } from "./ImageModal"

type Attachment = {
  id: string
  file_name: string
  file_url: string
  ticket_id: string
  uploaded_by: string
  created_at: string
}

export default function AllAttachments() {
  const [attachments, setAttachments] = useState<Attachment[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedImage, setSelectedImage] = useState<string | null>(null)

  useEffect(() => {
    const fetchAttachments = async () => {
      const supabase = createClient()
      const { data, error } = await supabase
        .from("attachments_csapp")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(10)

      if (error) {
        console.error("Error fetching attachments:", error)
      } else {
        setAttachments(data || [])
      }
      setIsLoading(false)
    }

    fetchAttachments()
  }, [])

  const handleImageClick = (imageUrl: string) => {
    setSelectedImage(imageUrl)
  }

  const handleCloseModal = () => {
    setSelectedImage(null)
  }

  if (isLoading) {
    return <div>Loading attachments...</div>
  }

  if (attachments.length === 0) {
    return <div>No attachments found.</div>
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {attachments.map((attachment) => (
          <div key={attachment.id} className="border rounded-lg p-4 flex flex-col">
            <p className="font-semibold mb-2 truncate">{attachment.file_name}</p>
            <p className="text-sm text-gray-500 mb-2">
              Ticket ID: <Link href={`/dashboard/tickets/${attachment.ticket_id}`}>{attachment.ticket_id}</Link>
            </p>
            <p className="text-sm text-gray-500 mb-4">
              Uploaded on: {new Date(attachment.created_at).toLocaleDateString()}
            </p>
            <div className="mt-auto">
              <Button onClick={() => handleImageClick(attachment.file_url)} className="w-full" variant="outline">
                View Image
              </Button>
            </div>
          </div>
        ))}
      </div>
      {selectedImage && <ImageModal imageUrl={selectedImage} onClose={handleCloseModal} />}
    </div>
  )
}

