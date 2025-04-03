export interface FileNode{
    path: string;
    type: "file"|"dir"
    children?: FileNode[];
    content?: string;
    imports?: string[];
}

export interface DependencyNode {
    id: string
    label: string
    type: string
  }
  
  export interface DependencyLink {
    source: string
    target: string
  }
  
  export interface DependencyData {
    nodes: DependencyNode[]
    links: DependencyLink[]
  }

  