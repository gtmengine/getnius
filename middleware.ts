import { withAuth } from "next-auth/middleware"
import { NextResponse } from "next/server"

export default withAuth(
  function middleware() {
    return NextResponse.next()
  },
  {
    pages: {
      signIn: "/login",
    },
    callbacks: {
      authorized: ({ token, req }) => {
        const { pathname } = req.nextUrl
        if (pathname.startsWith("/login") || pathname.startsWith("/api/auth")) {
          return true
        }
        return !!token
      },
    },
  }
)

export const config = {
  // Run on all routes; allow/deny is handled inside the authorized callback above
  matcher: ["/:path*"],
}

