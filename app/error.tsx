'use client'

import { useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { AlertTriangle, RefreshCw } from 'lucide-react'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error('Application error:', error)
  }, [error])

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-white/80 backdrop-blur-sm border-white/20 shadow-xl">
        <CardHeader className="text-center space-y-4">
          <div className="w-16 h-16 bg-red-100 rounded-2xl flex items-center justify-center mx-auto">
            <AlertTriangle className="w-8 h-8 text-red-600" />
          </div>
          <div>
            <CardTitle className="text-2xl font-bold text-gray-900">Something went wrong!</CardTitle>
            <p className="text-gray-600 mt-2">
              An error occurred while loading the application.
            </p>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-4">
          <Button 
            onClick={reset}
            className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Try again
          </Button>
          
          <p className="text-xs text-gray-500 text-center">
            If the problem persists, please refresh the page or contact support.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}

