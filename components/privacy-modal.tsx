"use client"
import { useRouter } from "next/navigation"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Shield, X } from "lucide-react"

interface PrivacyModalProps {
  isOpen: boolean
  onClose: () => void
}

export function PrivacyModal({ isOpen, onClose }: PrivacyModalProps) {
  const router = useRouter()

  const handleAccept = () => {
    onClose()
    router.push("/upload")
  }

  const handleDecline = () => {
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md animate-modal-in data-[state=closed]:animate-modal-out shadow-2xl border-border/50">
        <DialogHeader>
          <div className="flex items-center justify-center w-12 h-12 bg-primary/10 rounded-lg mx-auto mb-4 transition-colors duration-200">
            <Shield className="h-6 w-6 text-primary" />
          </div>
          <DialogTitle className="text-center">Privacy Notice</DialogTitle>
          <DialogDescription className="text-center text-pretty">
            Your uploaded resume will only be used for AI analysis. It will not be stored in any database or used for
            any other purpose.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="bg-secondary/50 p-4 rounded-lg border border-border/30 transition-colors duration-200">
            <h4 className="font-semibold text-sm text-foreground mb-2">What we do:</h4>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• Analyze your resume with AI for insights</li>
              <li>• Provide personalized recommendations</li>
              <li>• Process data securely and privately</li>
            </ul>
          </div>

          <div className="bg-secondary/50 p-4 rounded-lg border border-border/30 transition-colors duration-200">
            <h4 className="font-semibold text-sm text-foreground mb-2">What we don't do:</h4>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• Store your resume in our database</li>
              <li>• Share your data with third parties</li>
              <li>• Use your resume for training or other purposes</li>
            </ul>
          </div>
        </div>

        <DialogFooter className="flex-col sm:flex-row gap-2">
          <Button
            variant="outline"
            onClick={handleDecline}
            className="w-full sm:w-auto bg-transparent transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
          >
            <X className="mr-2 h-4 w-4" />
            Decline
          </Button>
          <Button
            onClick={handleAccept}
            className="w-full sm:w-auto transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
          >
            <Shield className="mr-2 h-4 w-4" />
            Accept & Continue
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
