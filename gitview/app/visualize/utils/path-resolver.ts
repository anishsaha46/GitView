export function resolveRelativePath(basePath: string, relativePath: string): string {
    // Handle ./ (current directory)
    if (relativePath.startsWith("./")) {
      relativePath = relativePath.substring(2)
    }
  
    // Handle ../ (parent directory)
    const parts = basePath.split("/")
    while (relativePath.startsWith("../")) {
      relativePath = relativePath.substring(3)
      parts.pop()
    }
  
    return parts.length > 0 ? `${parts.join("/")}/${relativePath}` : relativePath
  }
  
  