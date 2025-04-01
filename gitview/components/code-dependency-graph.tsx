"use client"

import { useEffect,useRef } from "react"
import * as d3 from "d3"

interface DependencyNode {
    id: string
    label: string
    type: string
  }
  
  interface DependencyLink {
    source: string
    target: string
  }
  
  interface CodeDependencyGraphProps {
    data: {
      nodes: DependencyNode[]
      links: DependencyLink[]
    }
  }

  export default function CodeDependencyGraph({data}:
    CodeDependencyGraphProps) {
    const svgRef = useRef<SVGSVGElement>(null)
    useEffect(()=>{
        if(!svgRef.current || !data.nodes.length) return
        const width = svgRef.current.clientWidth
        const height = svgRef.current.clientHeight

        // clear previous graph elements
        d3.select(svgRef.current).selectAll("*").remove()
    })
    }