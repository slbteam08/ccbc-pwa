import React from 'react'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'

interface LogoutDialogProps {
  open: boolean
  onClose: () => void
  message?: string
}

/**
 * Logout dialog component that shows when token expires
 * Uses shadcn-ui AlertDialog for consistent styling
 */
const LogoutDialog: React.FC<LogoutDialogProps> = ({ 
  open, 
  onClose, 
  message = "Your session has expired. Please log in again." 
}) => {
  return (
    <AlertDialog open={open}>
      <AlertDialogContent className="bg-white/95 backdrop-blur-sm border border-white/20">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-red-600 flex items-center gap-2">
            🔒 Session Expired
          </AlertDialogTitle>
          <AlertDialogDescription className="text-gray-700">
            {message}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogAction 
            onClick={onClose}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            OK
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

export default LogoutDialog