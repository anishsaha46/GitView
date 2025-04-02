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
    

          // Create the SVG elements
    const svg = d3.select(svgRef.current).attr("viewBox", [0, 0, width, height])

    // Add zoom functionality
    const g = svg.append("g")

    svg.call(
      d3
        .zoom()
        .extent([
          [0, 0],
          [width, height],
        ])
        .scaleExtent([0.1, 8])
        .on("zoom", (event) => {
          g.attr("transform", event.transform)
        }),
    )

    // define arrow markers for links
    svg
    .append("defs")
    .append("marker")
    .attr("id", "arrowhead")
    .attr("viewBox", "0 -5 10 10")
    .attr("refX", 20)
    .attr("refY", 0)
    .attr("orient", "auto")
    .attr("markerWidth", 6)
    .attr("markerHeight", 6)
    .append("path")
    .attr("d", "M0,-5L10,0L0,5")
    .attr("fill", "#999")

        // Create links
        const link = g
        .append("g")
        .selectAll("line")
        .data(data.links)
        .join("line")
        .attr("stroke", "#999")
        .attr("stroke-opacity", 0.6)
        .attr("stroke-width", 1.5)
        .attr("marker-end", "url(#arrowhead)")
  })