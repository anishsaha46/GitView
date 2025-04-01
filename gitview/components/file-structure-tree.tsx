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
