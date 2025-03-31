"use client"
import { useState } from "react"
import  { ChevronDown, ChevronRight, File, Folder } from "lucide-react"

interface FileNode{
    path:string
    type: "file" | "dir"
    children?: FileNode[]
}

interface FileStructureTreeProps {
    data: FileNode[]
  }