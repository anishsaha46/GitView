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

     // Create nodes
    const node = g
    .append("g")
    .selectAll(".node")
    .data(data.nodes)
    .join("g")
    .attr("class", "node")
    .call(drag(simulation))

        // Add circles to nodes
        node
        .append("circle")
        .attr("r", 8)
        .attr("fill", (d: any) => getNodeColor(d.type))
        .attr("stroke", "#fff")
        .attr("stroke-width", 1.5)
  
      // Add labels to nodes
      node
        .append("text")
        .attr("dx", 12)
        .attr("dy", ".35em")
        .text((d: any) => d.label)
        .attr("font-size", "10px")
        .attr("fill", "#333")

    // Add title for hover tooltip
    node.append("title").text((d: any) => d.id)

    // Update positions on simulation tick
    simulation.on("tick", () => {
      link
        .attr("x1", (d: any) => d.source.x)
        .attr("y1", (d: any) => d.source.y)
        .attr("x2", (d: any) => d.target.x)
        .attr("y2", (d: any) => d.target.y)

      node.attr("transform", (d: any) => `translate(${d.x},${d.y})`)
    })

    // drag functionality
    function drop(simulation,d3.simulation<d3.SimulationNodeDatum,undefined>) {
      function dragstarted(event:any){
        if(!event.active) simulation.alphaTarget(0.3).restart()
        event.subject.fx = event.subject.x
        event.subject.fy = event.subject.y
      }
      function dragged(event:any){
        event.subject.fx = event.x
        event.subject.fy = event.y
      }
      function dragended(event:any){
        if(!event.active) simulation.alphaTarget(0)
        event.subject.fx = null
        event.subject.fy = null
      }
      return d3.drag().on("start", dragstarted).on("drag", dragged).on("end", dragended).on("end", dragended)
    }

        // Color nodes based on file type
        function getNodeColor(type: string): string {
          const colorMap: { [key: string]: string } = {
            js: "#f7df1e",
            jsx: "#61dafb",
            ts: "#3178c6",
            tsx: "#61dafb",
            py: "#3776ab",
            java: "#b07219",
            go: "#00add8",
            rb: "#cc342d",
            php: "#4f5d95",
            c: "#555555",
            cpp: "#f34b7d",
            cs: "#178600",
            default: "#999999",
          }
    
          return colorMap[type] || colorMap.default
        }

  })