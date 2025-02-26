"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/utils/supabase/client"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { toast } from "react-hot-toast"

export default function AddCommentForm({ ticketId }: { ticketId: string }) {
  const [comment, setComment] = useState("")
  const [isInternal, setIsInternal] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    const supabase = createClient()

    try {
      const {
        data: { session },
      } = await supabase.auth.getSession()

      if (!session) {
        throw new Error("No active session")
      }

      const { error } = await supabase.from("comments_csapp").insert({
        ticket_id: ticketId,
        user_id: session.user.id,
        comment,
        is_internal: isInternal,
      })

      if (error) throw error

      toast.success("Comment added successfully")
      setComment("")
      setIsInternal(false)
      router.refresh()
    } catch (error) {
      console.error("Error adding comment:", error)
      toast.error("Failed to add comment. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Textarea
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        placeholder="Add your comment here..."
        required
      />
      <div className="flex items-center space-x-2">
        <Checkbox id="internal" checked={isInternal} onCheckedChange={(checked) => setIsInternal(checked as boolean)} />
        <label htmlFor="internal" className="text-sm text-gray-700">
          Internal comment (only visible to staff)
        </label>
      </div>
      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Adding Comment..." : "Add Comment"}
      </Button>
    </form>
  )
}

