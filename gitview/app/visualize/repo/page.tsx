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
}