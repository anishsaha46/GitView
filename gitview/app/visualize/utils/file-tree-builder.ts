import type { FileNode, GitHubTreeItem } from "../types"

export function buildFileTree(items: GitHubTreeItem[]): FileNode[] {
  // Use a Map for efficient lookups
  const nodeMap = new Map<string, FileNode>()
  const root: FileNode[] = []

  // Create a placeholder for the root
  nodeMap.set("", { path: "", type: "dir", children: root })

  // Single pass to build the tree
  items.forEach((item) => {
    const isFile = item.type === "blob"
    const path = item.path
    const parts = path.split("/")

    // Create the node for this item
    const node: FileNode = {
      path,
      type: isFile ? "file" : "dir",
      ...(isFile ? {} : { children: [] }),
    }

    // Add to the map
    nodeMap.set(path, node)

    // Add to parent
    if (parts.length === 1) {
      // Top-level item
      root.push(node)
    } else {
      // Nested item, find or create parent
      const parentPath = parts.slice(0, -1).join("/")
      let parent = nodeMap.get(parentPath)

      if (!parent) {
        // Create missing parent directories
        parent = {
          path: parentPath,
          type: "dir",
          children: [],
        }
        nodeMap.set(parentPath, parent)

        // Add parent to its parent recursively
        const parentParts = parentPath.split("/")
        const grandParentPath = parentParts.slice(0, -1).join("/")
        const grandParent = nodeMap.get(grandParentPath)

        if (grandParent && grandParent.children) {
          grandParent.children.push(parent)
        } else if (parentParts.length === 1) {
          root.push(parent)
        }
      }

      if (parent.children) {
        parent.children.push(node)
      }
    }
  })

  return root
}

