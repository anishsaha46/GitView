"use client"

import { signOut } from "next-auth/react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Home, LogOut } from "lucide-react"

export function Navbar() {
  return (
    <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center justify-between">
        <Link href="/">
          <Button variant="ghost" size="sm" title="Home">
            <Home className="h-5 w-5" />
          </Button>
        </Link>
        <Button 
          variant="ghost" 
          size="sm"
          onClick={() => signOut({ callbackUrl: "/" })}
          title="Sign Out"
        >
          <LogOut className="h-5 w-5" />
        </Button>
      </div>
    </nav>
  )
}
