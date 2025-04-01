"use client"

import { useState } from "react"
import { ChevronDown, ChevronRight, File, Folder } from "lucide-react"

interface FileNode {
  path: string
  type: "file" | "dir"
  children?: FileNode[]
}

interface FileStructureTreeProps {
  data: FileNode[]
}

export default function FileStructureTree({ data }: FileStructureTreeProps) {
  return (
    <div className="font-mono text-sm">
      <ul className="space-y-1">
        {data.map((node) => (
          <TreeNode key={node.path} node={node} level={0} />
        ))}
      </ul>
    </div>
  )
}

interface TreeNodeProps {
  node: FileNode
  level: number
}

function TreeNode({node,level}:TreeNodeProps){
  const [isExpaded,setIsExpanded]= useState(level < 1)
  const hasChildren = node.children && node.children.length > 0
  const fileName=node.path.split("/").pop() || node.path
  const toggleExpand = () => {
    setIsExpanded(!isExpaded)
  }

  const getFileIcon = (fileName: string) => {
    const extension = fileName.split(".").pop()?.toLowerCase()

    // Return different colors based on file extension
    switch (extension) {
      case "js":
        return <File className="h-4 w-4 text-yellow-500" />
      case "jsx":
        return <File className="h-4 w-4 text-blue-400" />
      case "ts":
        return <File className="h-4 w-4 text-blue-600" />
      case "tsx":
        return <File className="h-4 w-4 text-blue-500" />
      case "json":
        return <File className="h-4 w-4 text-yellow-600" />
      case "md":
        return <File className="h-4 w-4 text-gray-500" />
      case "css":
        return <File className="h-4 w-4 text-pink-500" />
      case "html":
        return <File className="h-4 w-4 text-orange-500" />
      default:
        return <File className="h-4 w-4" />
    }
  }
}