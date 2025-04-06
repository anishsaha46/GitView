"use client"

import { useEffect, useState } from "react"
import { useSession } from "next-auth/react"
import { redirect } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Skeleton } from "@/components/ui/skeleton"
import Link from "next/link"
import { ArrowLeft, Download, FileCode, FolderTree, GitBranch, RefreshCw } from "lucide-react"
import CodeDependencyGraph from "@/components/code-dependency-graph"
import FileStructureTree from "@/components/file-structure-tree"
import { fetchRepositoryData } from "@/app/visualize/services/repository-service"
import type { FileNode, DependencyData } from "@/app/visualize/types"

export default function VisualizeRepo({ params }: { params: { repo: string } }) {
    const { data: session, status } = useSession()
    const [loading, setLoading] = useState(true)
    const [fileStructure, setFileStructure] = useState<FileNode[]>([])
    const [dependencies, setDependencies] = useState<DependencyData>({ nodes: [], links: [] })
    const [activeTab, setActiveTab] = useState("dependencies")
    const [error, setError] = useState<string | null>(null)
  
    useEffect(() => {
      if (status === "unauthenticated") {
        redirect("/")
      }
  
      if (status === "authenticated" && session?.accessToken) {
        loadRepositoryData(session.accessToken as string)
      }
    }, [status, session, params.repo])

    const loadRepositoryData = async (accessToken: string) => {
        setLoading(true)
        setError(null)
    
        try {
          const { fileStructure, dependencies } = await fetchRepositoryData(
            session?.user?.name || "",
            params.repo,
            accessToken,
          )
    
          setFileStructure(fileStructure)
          setDependencies(dependencies)
        } catch (error) {
          console.error("Error loading repository data:", error)
          setError(error instanceof Error ? error.message : "Failed to load repository data")
        } finally {
          setLoading(false)
        }
      }

      if (status === "loading") {
        return (
          <div className="flex flex-col min-h-screen items-center justify-center">
            <Skeleton className="h-8 w-64 mb-4" />
            <Skeleton className="h-4 w-48" />
          </div>
        )
      }
    
      return (
        <div className="flex flex-col min-h-screen">
          <header className="border-b">
            <div className="container flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
              <div className="flex items-center gap-4">
                <Link href="/dashboard">
                  <Button variant="ghost" size="icon">
                    <ArrowLeft className="h-4 w-4" />
                  </Button>
                </Link>
                <h1 className="text-lg font-semibold flex items-center gap-2">
                  <GitBranch className="h-5 w-5" />
                  {params.repo}
                </h1>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" onClick={() => loadRepositoryData(session?.accessToken as string)}>
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Refresh
                </Button>
                <Button variant="outline" size="sm">
                  <Download className="h-4 w-4 mr-2" />
                  Export
                </Button>
              </div>
            </div>
          </header>
          <main className="flex-1 container py-6 px-4 sm:px-6 lg:px-8">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="mb-6">
                <TabsTrigger value="dependencies">
                  <FileCode className="h-4 w-4 mr-2" />
                  Code Dependencies
                </TabsTrigger>
                <TabsTrigger value="structure">
                  <FolderTree className="h-4 w-4 mr-2" />
                  File Structure
                </TabsTrigger>
              </TabsList>
    
              {loading ? (
                <Card className="w-full h-[600px] flex items-center justify-center">
                  <div className="flex flex-col items-center gap-2">
                    <RefreshCw className="h-8 w-8 animate-spin text-muted-foreground" />
                    <p className="text-muted-foreground">Analyzing repository structure...</p>
                  </div>
                </Card>
              ) : error ? (
                <Card className="w-full h-[600px] flex items-center justify-center">
                  <div className="flex flex-col items-center gap-2 max-w-md text-center">
                    <p className="text-lg font-medium">Error loading repository</p>
                    <p className="text-muted-foreground">{error}</p>
                    <Button className="mt-4" onClick={() => loadRepositoryData(session?.accessToken as string)}>
                      Try Again
                    </Button>
                  </div>
                </Card>
              ) : (
                <>
                  <TabsContent value="dependencies" className="mt-0">
                    <Card className="w-full h-[600px] overflow-hidden">
                      <CodeDependencyGraph data={dependencies} />
                    </Card>
                  </TabsContent>
                  <TabsContent value="structure" className="mt-0">
                    <Card className="w-full h-[600px] overflow-auto p-4">
                      <FileStructureTree data={fileStructure} />
                    </Card>
                  </TabsContent>
                </>
              )}
            </Tabs>
          </main>
        </div>
      )
}