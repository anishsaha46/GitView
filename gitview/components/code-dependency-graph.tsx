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