"use client"

import { signIn, signOut, useSession } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Github, LogOut } from "lucide-react"
import { useState } from "react"

export default function SignIn() {
  const [isLoading, setIsLoading] = useState(false)
  const { data: session } = useSession()

  const handleSignIn = async () => {
    try {
      setIsLoading(true)
      // Use the full absolute URL for the callback to ensure it's correct
      const callbackUrl = typeof window !== 'undefined' 
        ? `${window.location.origin}/dashboard`
        : '/dashboard';
        
      await signIn("github", { 
        callbackUrl,
        redirect: true 
      })
    } catch (error) {
      console.error("Sign in error:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSignOut = async () => {
    try {
      setIsLoading(true)
      await signOut({ callbackUrl: "/" })
    } catch (error) {
      console.error("Sign out error:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="mx-auto max-w-sm space-y-6 p-6">
        <div className="space-y-2 text-center">
          <h1 className="text-2xl font-bold">Welcome</h1>
          <p className="text-gray-500 dark:text-gray-400">
            {session ? 'Manage your session' : 'Sign in with your GitHub account to continue'}
          </p>
        </div>
        <div className="flex gap-4">
          {!session ? (
            <Button
              className="w-full"
              onClick={handleSignIn}
              disabled={isLoading}
            >
              <Github className="mr-2 h-4 w-4" />
              {isLoading ? "Signing in..." : "Continue with GitHub"}
            </Button>
          ) : (
            <Button
              className="w-full"
              onClick={handleSignOut}
              disabled={isLoading}
              variant="destructive"
            >
              <LogOut className="mr-2 h-4 w-4" />
              {isLoading ? "Signing out..." : "Sign Out"}
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}