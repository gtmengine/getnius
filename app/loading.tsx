export default function Loading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center">
      <div className="text-center space-y-4">
        <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Loading Getnius</h2>
          <p className="text-gray-600">Please wait while we prepare your market intelligence platform...</p>
        </div>
      </div>
    </div>
  )
}

