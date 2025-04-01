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

    // Create the simulation with forces
    const simulation = d3
      .forceSimulation()
      .nodes(data.nodes as d3.SimulationNodeDatum[])
      .force(
        "link",
        d3
          .forceLink()
          .id((d: any) => d.id)
          .links(data.links)
          .distance(100),
      )
      .force("charge", d3.forceManyBody().strength(-300))
      .force("center", d3.forceCenter(width / 2, height / 2))
      .force("collision", d3.forceCollide().radius(50))
    })