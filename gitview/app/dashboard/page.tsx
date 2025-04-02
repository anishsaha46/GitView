"use client"

import { useEffect, useState } from "react"
import { useSession } from "next-auth/react"
import { redirect } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Skeleton } from "@/components/ui/skeleton"
import Link from "next/link"
import { Search } from "lucide-react"

interface Repository {
  id: number
  name: string
  description: string
  html_url: string
  updated_at: string
  language: string
}

export default function Dashboard() {
  const { data: session, status } = useSession()
  const [repositories, setRepositories] = useState<Repository[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")

  useEffect(() => {
    if (status === "unauthenticated") {
      redirect("/")
    }

    if (status === "authenticated" && session?.accessToken) {
      fetchRepositories(session.accessToken as string)
    }
  }, [status, session])

  const fetchRepositories = async (accessToken: string) => {
    try {
      const response = await fetch("https://api.github.com/user/repos?sort=updated&per_page=100", {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })

      if (response.ok) {
        const data = await response.json()
        setRepositories(data)
      } else {
        console.error("Failed to fetch repositories")
      }
    } catch (error) {
      console.error("Error fetching repositories:", error)
    } finally {
      setLoading(false)
    }
  }

  const filteredRepositories = repositories.filter(
    (repo) =>
      repo.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (repo.description && repo.description.toLowerCase().includes(searchQuery.toLowerCase())),
  )

  return (
    <div className="flex flex-col min-h-screen">
      <header className="border-b">
        <div className="container flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
          <h1 className="text-lg font-semibold">GitHub Code Visualizer</h1>
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground">{session?.user?.name}</span>
            <Link href="/api/auth/signout">
              <Button variant="outline" size="sm">
                Sign out
              </Button>
            </Link>
          </div>
        </div>
      </header>
      <main className="flex-1 container py-6 px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold tracking-tight mb-4">Select a Repository</h2>
          <p className="text-muted-foreground mb-6">Choose a repository to visualize its code relationships</p>
          <div className="relative max-w-md mb-6">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search repositories..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {loading ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {[...Array(6)].map((_, i) => (
              <Card key={i}>
                <CardHeader>
                  <Skeleton className="h-5 w-40" />
                  <Skeleton className="h-4 w-full" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-4 w-2/3" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredRepositories.length > 0 ? (
              filteredRepositories.map((repo) => (
                <Link key={repo.id} href={`/visualize/${repo.name}`}>
                  <Card className="h-full hover:bg-muted/50 transition-colors cursor-pointer">
                    <CardHeader>
                      <CardTitle>{repo.name}</CardTitle>
                      <CardDescription>Last updated: {new Date(repo.updated_at).toLocaleDateString()}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {repo.description || "No description available"}
                      </p>
                      {repo.language && (
                        <div className="mt-2 inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold">
                          {repo.language}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </Link>
              ))
            ) : (
              <div className="col-span-full text-center py-12">
                <h3 className="text-xl font-medium mb-2">No repositories found</h3>
                <p className="text-muted-foreground">Try adjusting your search query</p>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  )
}

