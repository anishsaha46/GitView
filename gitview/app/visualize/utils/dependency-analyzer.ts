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
  const nodeMap = new Map<string, DependencyNode>()

  // Fetch and analyze files in parallel with rate limiting
  const analyzePromises = filesToAnalyze.map(async (file, index) => {
    // Add delay to avoid rate limiting
    await new Promise((resolve) => setTimeout(resolve, index * 100))

    try {
      const content = await fetchFileContent(username, repoName, file.path, branch, accessToken)

      // Add node
      const fileExt = file.path.split(".").pop() || "file"
      const node = {
        id: file.path,
        label: file.path.split("/").pop() || "",
        type: fileExt,
      }
      nodes.push(node)
      nodeMap.set(file.path, node)

      // Extract imports based on file type
      const imports = extractImports(content, fileExt, file.path)
      importMap.set(file.path, imports)
    } catch (error) {
      console.warn(`Error analyzing ${file.path}:`, error)
    }
  })

  await Promise.all(analyzePromises)

  // Create links based on actual imports, only if both nodes exist
  importMap.forEach((imports, filePath) => {
    if (!nodeMap.has(filePath)) return // Skip if source node doesn't exist

    imports.forEach((importPath) => {
      // Find the actual file that matches the import
      const targetFile = findMatchingFile(importPath, filePath, codeFiles)
      if (targetFile && nodeMap.has(targetFile)) { // Only create link if both nodes exist
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


  function extractImports(content: string, fileType: string, filePath: string): string[] {
    const imports: string[] = []
  
    try {
      // JavaScript/TypeScript import detection
      if (["js", "jsx", "ts", "tsx"].includes(fileType)) {
        // ES6 imports
        const es6ImportRegex = /import\s+(?:(?:{[^}]*}|\*\s+as\s+\w+|\w+)\s+from\s+)?['"]([^'"]+)['"]/g
        let match
        while ((match = es6ImportRegex.exec(content)) !== null) {
          imports.push(match[1])
        }
  
        // CommonJS require
        const requireRegex = /require\s*$$\s*['"]([^'"]+)['"]\s*$$/g
        while ((match = requireRegex.exec(content)) !== null) {
          imports.push(match[1])
        }
      }
  
      // Python imports
      else if (fileType === "py") {
        const importRegex = /(?:from\s+(\S+)\s+import|import\s+(\S+))/g
        let match
        while ((match = importRegex.exec(content)) !== null) {
          const importPath = match[1] || match[2]
          if (importPath) imports.push(importPath)
        }
      }
  
      // Java imports
      else if (fileType === "java") {
        const importRegex = /import\s+([^;]+);/g
        let match
        while ((match = importRegex.exec(content)) !== null) {
          imports.push(match[1])
        }
      }
    } catch (error) {
      console.warn(`Error extracting imports from ${filePath}:`, error)
    }
  
    return imports
  }

  function findMatchingFile(importPath: string, currentFilePath: string, allFiles: GitHubTreeItem[]): string | null {
    // Handle relative imports
    if (importPath.startsWith("./") || importPath.startsWith("../")) {
      const currentDir = currentFilePath.split("/").slice(0, -1).join("/")
      const targetPath = resolveRelativePath(currentDir, importPath)
  
      // Try exact match first
      const exactMatch = allFiles.find((f) => f.path === targetPath)
      if (exactMatch) return exactMatch.path
  
      // Try with extensions
      for (const ext of [".js", ".jsx", ".ts", ".tsx"]) {
        const withExt = targetPath + ext
        const matchWithExt = allFiles.find((f) => f.path === withExt)
        if (matchWithExt) return matchWithExt.path
      }
  
      // Try index files in directory
      for (const ext of [".js", ".jsx", ".ts", ".tsx"]) {
        const indexFile = `${targetPath}/index${ext}`
        const matchIndex = allFiles.find((f) => f.path === indexFile)
        if (matchIndex) return matchIndex.path
      }
    }
  
    // Handle package imports
    else {
      // Skip node_modules imports and built-in modules
      if (importPath.includes("node_modules") || 
          importPath.startsWith("@") || 
          importPath.includes("/")) {
        return null
      }

      // For local package imports, try to find exact matches first
      const importName = importPath.split("/").pop()
      if (!importName) return null

      // First try exact file name match
      const exactMatch = allFiles.find((f) => {
        const fileName = f.path.split("/").pop() || ""
        return fileName === importName || 
               fileName === `${importName}.js` || 
               fileName === `${importName}.jsx` || 
               fileName === `${importName}.ts` || 
               fileName === `${importName}.tsx`
      })

      if (exactMatch) return exactMatch.path

      // If no exact match, try directory with index file
      for (const ext of [".js", ".jsx", ".ts", ".tsx"]) {
        const indexFile = `${importName}/index${ext}`
        const matchIndex = allFiles.find((f) => f.path === indexFile)
        if (matchIndex) return matchIndex.path
      }
    }
  
    return null
  }
  
  