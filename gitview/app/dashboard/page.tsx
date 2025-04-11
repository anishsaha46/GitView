"use client"

import { useSession } from "next-auth/react"
import { useEffect, useState } from "react"
import { GitHubRepoResponse } from "../visualize/types"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Card } from "@/components/ui/card"
import { useRouter } from "next/navigation"
import { Navbar } from "@/components/navbar"

export default function Dashboard() {
  const { data: session } = useSession()
  const [repos, setRepos] = useState<GitHubRepoResponse[]>([])
  const router = useRouter()

  useEffect(() => {
    if (session?.accessToken) {
      fetch('https://api.github.com/user/repos', {
        headers: {
          Authorization: `Bearer ${session.accessToken}`,
        },
      })
        .then(res => res.json())
        .then(data => setRepos(data))
    }
  }, [session])

  const handleRepoSelect = (repo: GitHubRepoResponse) => {
    router.push(`/visualize/repo?owner=${repo.owner.login}&name=${repo.name}`)
  }

  if (!session) {
    return <div>Please sign in to view your repositories.</div>
  }

  return (
    <>
      <Navbar />
      <div className="container mx-auto py-8">
        <h1 className="text-3xl font-bold mb-6">Your Repositories</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {repos.map((repo) => (
            <Card key={repo.id} className="p-4 hover:shadow-lg transition-shadow">
              <h2 className="text-xl font-semibold mb-2">{repo.name}</h2>
              <p className="text-sm text-muted-foreground mb-4">by {repo.owner.login}</p>
              <Button onClick={() => handleRepoSelect(repo)}>
                Visualize Repository
              </Button>
            </Card>
          ))}
        </div>
      </div>
    </>
  )
}
