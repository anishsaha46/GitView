import { resolveRelativePath } from "./path-resolver"
import type { DependencyData, DependencyNode, DependencyLink, GitHubTreeItem, GitHubContentResponse } from "../types"

export async function analyzeDependencies(
  username: string,
  repoName: string,
  branch: string,
  treeItems: GitHubTreeItem[],
  accessToken: string,
): Promise<DependencyData> {
  // Filter code files
  const codeFiles = treeItems.filter((item) => {
    const ext = item.path.split(".").pop()?.toLowerCase()
    return (
      item.type === "blob" &&
      ["js", "jsx", "ts", "tsx", "py", "java", "go", "rb", "php", "c", "cpp", "cs"].includes(ext || "")
    )
  })

  // Limit files to analyze to avoid rate limits
  const MAX_FILES_TO_ANALYZE = 30
  const filesToAnalyze = codeFiles.slice(0, MAX_FILES_TO_ANALYZE)

  const nodes: DependencyNode[] = []
  const links: DependencyLink[] = []
  const importMap = new Map<string, string[]>()

  // Fetch and analyze files in parallel with rate limiting
  const analyzePromises = filesToAnalyze.map(async (file, index) => {
    // Add delay to avoid rate limiting
    await new Promise((resolve) => setTimeout(resolve, index * 100))

    try {
      const content = await fetchFileContent(username, repoName, file.path, branch, accessToken)

      // Add node
      const fileExt = file.path.split(".").pop() || "file"
      nodes.push({
        id: file.path,
        label: file.path.split("/").pop() || "",
        type: fileExt,
      })

      // Extract imports based on file type
      const imports = extractImports(content, fileExt, file.path)
      importMap.set(file.path, imports)
    } catch (error) {
      console.warn(`Error analyzing ${file.path}:`, error)
    }
  })

  await Promise.all(analyzePromises)

  // Create links based on actual imports
  importMap.forEach((imports, filePath) => {
    imports.forEach((importPath) => {
      // Find the actual file that matches the import
      const targetFile = findMatchingFile(importPath, filePath, codeFiles)
      if (targetFile) {
        links.push({
          source: filePath,
          target: targetFile,
        })
      }
    })
  })

  return { nodes, links }
}

async function fetchFileContent(
    username: string,
    repoName: string,
    filePath: string,
    branch: string,
    accessToken: string,
  ): Promise<string> {
    const response = await fetch(
      `https://api.github.com/repos/${username}/${repoName}/contents/${filePath}?ref=${branch}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
    )
  
    if (!response.ok) {
      throw new Error(`Failed to fetch content for ${filePath}: ${response.statusText}`)
    }
  
    const contentData: GitHubContentResponse = await response.json()
    return contentData.content ? atob(contentData.content) : ""
  }