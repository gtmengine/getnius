import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Search, Home } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-white/80 backdrop-blur-sm border-white/20 shadow-xl">
        <CardHeader className="text-center space-y-4">
          <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center mx-auto">
            <Search className="w-8 h-8 text-white" />
          </div>
          <div>
            <CardTitle className="text-2xl font-bold text-gray-900">Page Not Found</CardTitle>
            <p className="text-gray-600 mt-2">
              The page you're looking for doesn't exist or has been moved.
            </p>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-4">
          <Link href="/">
            <Button className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white">
              <Home className="w-4 h-4 mr-2" />
              Return to Getnius
            </Button>
          </Link>
          
          <p className="text-xs text-gray-500 text-center">
            Go back to the market intelligence platform
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
