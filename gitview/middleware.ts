import { withAuth } from "next-auth/middleware"
import { NextResponse } from "next/server"

export default withAuth(
  function middleware(req) {
    // Handle root path based on authentication state
    if (req.nextUrl.pathname === "/") {
      return NextResponse.next()
    }
  },
  {
    callbacks: {
      authorized: ({ req, token }) => {
        // Protect dashboard and visualize routes
        if (req.nextUrl.pathname.startsWith("/dashboard") || 
            req.nextUrl.pathname.startsWith("/visualize")) {
          return token !== null
        }
        // Allow access to other routes
        return true
      },
    },
  }
)

export const config = {
  matcher: ["/", "/dashboard/:path*", "/visualize/:path*"]
}