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

  export interface GitHubTreeItem {
    path: string
    mode: string
    type: string
    sha: string
    size?: number
    url: string
  }

  export interface GitHubTreeResponse {
    sha: string
    url: string
    tree: GitHubTreeItem[]
    truncated: boolean
  }