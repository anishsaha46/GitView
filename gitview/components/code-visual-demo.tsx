"use client"

import { useEffect, useRef, useState } from "react"
import { motion } from "framer-motion"
import * as d3 from "d3"

interface Node extends d3.SimulationNodeDatum {
    id: string
    group: number
    x?: number
    y?: number
  }
  
  interface Link extends d3.SimulationLinkDatum<Node> {
    source: string | Node
    target: string | Node
  }
export default function CodeVisualDemo() {
  const svgRef = useRef<SVGSVGElement>(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          observer.disconnect()
        }
      },
      { threshold: 0.1 },
    )

    if (svgRef.current) {
      observer.observe(svgRef.current)
    }

    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    if (!svgRef.current || !isVisible) return

    // Sample data for visualization
    const nodes = [
      { id: "app.js", group: 1 },
      { id: "components/header.js", group: 2 },
      { id: "components/footer.js", group: 2 },
      { id: "components/sidebar.js", group: 2 },
      { id: "utils/api.js", group: 3 },
      { id: "utils/helpers.js", group: 3 },
      { id: "pages/home.js", group: 4 },
      { id: "pages/about.js", group: 4 },
      { id: "pages/contact.js", group: 4 },
      { id: "styles/main.css", group: 5 },
      { id: "styles/components.css", group: 5 },
      { id: "data/config.json", group: 6 },
    ]

    const links = [
      { source: "app.js", target: "components/header.js" },
      { source: "app.js", target: "components/footer.js" },
      { source: "app.js", target: "components/sidebar.js" },
      { source: "app.js", target: "pages/home.js" },
      { source: "components/header.js", target: "styles/components.css" },
      { source: "components/footer.js", target: "styles/components.css" },
      { source: "components/sidebar.js", target: "styles/components.css" },
      { source: "pages/home.js", target: "utils/api.js" },
      { source: "pages/about.js", target: "utils/helpers.js" },
      { source: "pages/contact.js", target: "utils/api.js" },
      { source: "utils/api.js", target: "data/config.json" },
      { source: "app.js", target: "styles/main.css" },
    ]

    const width = svgRef.current.clientWidth
    const height = svgRef.current.clientHeight

    // Clear previous graph
    d3.select(svgRef.current).selectAll("*").remove()

    // Create the simulation with forces
    const simulation = d3
    .forceSimulation<Node>(nodes as Node[])
    .force(
      "link",
      d3
        .forceLink<Node, Link>(links as Link[])
        .id((d) => d.id)
        .distance(100),
    )
    .force("charge", d3.forceManyBody<Node>().strength(-300))
    .force("center", d3.forceCenter(width / 2, height / 2))
    .force("collision", d3.forceCollide().radius(50))

  // Create the SVG elements
  const svg = d3.select(svgRef.current).attr("viewBox", [0, 0, width, height])

  // Add zoom functionality
  const g = svg.append("g")

  svg.call(
    d3
      .zoom<SVGSVGElement, unknown>()
      .extent([
        [0, 0],
        [width, height],
      ])
      .scaleExtent([0.1, 8])
      .on("zoom", ({ transform }) => {
        g.attr("transform", transform.toString())
      })
  )

    // Define arrow marker for links
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
      .data(links)
      .join("line")
      .attr("stroke", "#999")
      .attr("stroke-opacity", 0.6)
      .attr("stroke-width", 1.5)
      .attr("marker-end", "url(#arrowhead)")

    // Create nodes
    const node = g
      .append("g")
      .selectAll<SVGGElement, Node>(".node")
      .data(nodes)
      .join("g")
      .attr("class", "node")
      .call(drag(simulation))

    // Add circles to nodes
    node
      .append("circle")
      .attr("r", 8)
      .attr("fill", (d: any) => getNodeColor(d.group))
      .attr("stroke", "#fff")
      .attr("stroke-width", 1.5)

    // Add labels to nodes
    node
      .append("text")
      .attr("dx", 12)
      .attr("dy", ".35em")
      .text((d: any) => d.id.split("/").pop())
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

    // Drag functionality
    function drag(simulation: d3.Simulation<Node, Link>) {
        function dragstarted(event: d3.D3DragEvent<SVGGElement, Node, Node>, d: Node) {
          if (!event.active) simulation.alphaTarget(0.3).restart()
          d.fx = event.x
          d.fy = event.y
        }
  
        function dragged(event: d3.D3DragEvent<SVGGElement, Node, Node>, d: Node) {
          d.fx = event.x
          d.fy = event.y
        }
  
        function dragended(event: d3.D3DragEvent<SVGGElement, Node, Node>, d: Node) {
          if (!event.active) simulation.alphaTarget(0)
          d.fx = null
          d.fy = null
        }
  
        return d3
          .drag<SVGGElement, Node>()
          .on("start", dragstarted)
          .on("drag", dragged)
          .on("end", dragended)
      }

    // Color nodes based on group
    function getNodeColor(group: number): string {
      const colorMap: { [key: number]: string } = {
        1: "#3b82f6", // blue-500
        2: "#8b5cf6", // violet-500
        3: "#ec4899", // pink-500
        4: "#f97316", // orange-500
        5: "#10b981", // emerald-500
        6: "#6366f1", // indigo-500
      }

      return colorMap[group] || "#6b7280" // gray-500
    }

    return () => {
      simulation.stop()
    }
  }, [isVisible])

  return (
    <div className="w-full h-full flex items-center justify-center bg-grid-pattern bg-opacity-5">
      {!isVisible ? (
        <div className="animate-pulse text-muted-foreground">Loading visualization...</div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
          className="w-full h-full"
        >
          <svg ref={svgRef} className="w-full h-full" style={{ cursor: "grab" }} />
        </motion.div>
      )}
    </div>
  )
}

