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
    const {data:session,status} = useSession()
    const [repositories, setRepositories] = useState<Repository[]>([])
    const [loading, setLoading] = useState(false)
    const [searchQuery, setSearchQuery] = useState("")

    useEffect(()=>{
        if(status === "unauthenticated"){
            redirect("/")
        }
        if(status === "authenticated" && session?.accessToken){
            fetchRepositories(session.accessToken as string)
        }
    },[status, session])

    const fetchRepositories = async (accessToken: string) => {
        try{
            const response = await fetch("https://api.github.com/user/repos?sort=updated&per_page=100", {
                headers: {
                  Authorization: `Bearer ${accessToken}`,
                },
        })

        if(response.ok){
            const data = await response.json()
            setRepositories(data)
        }else{
            console.error("Failed to fetch repositories")
        }
    } catch(error){
        console.error("Error fetching repositories:", error)
        }finally{
            setLoading(false)
        }
    }

    const filteredRepositories = repositories.filter(
        (repo) =>
          repo.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (repo.description && repo.description.toLowerCase().includes(searchQuery.toLowerCase())),
      )
  }