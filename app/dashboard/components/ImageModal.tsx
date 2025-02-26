import { Dialog, DialogContent } from "@/components/ui/dialog"
import Image from "next/image"

type ImageModalProps = {
  imageUrl: string
  onClose: () => void
}

export function ImageModal({ imageUrl, onClose }: ImageModalProps) {
  return (
    <Dialog open={true} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[425px]">
        <div className="relative aspect-square">
          <Image src={imageUrl || "/placeholder.svg"} alt="Attachment" fill className="object-contain" />
        </div>
      </DialogContent>
    </Dialog>
  )
}

