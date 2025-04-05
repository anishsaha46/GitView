import { buildFileTree } from "../utils/file-tree-builder"
import { analyzeDependencies } from "../utils/dependency-analyzer"
import type { FileNode, DependencyData, GitHubTreeResponse, GitHubRepoResponse } from "../types"

export async function fetchRepositoryData(
    username: string,
    repoName: string,
    accessToken: string,
  ): Promise<{ fileStructure: FileNode[]; dependencies: DependencyData }> {
    // First get the default branch
    const defaultBranch = await fetchDefaultBranch(username, repoName, accessToken)
  
    // Then get the file tree
    const treeData = await fetchRepositoryTree(username, repoName, defaultBranch, accessToken)
  
    // Build the file tree structure
    const fileStructure = buildFileTree(treeData.tree)
  
    // Analyze dependencies
    const dependencies = await analyzeDependencies(username, repoName, defaultBranch, treeData.tree, accessToken)
  
    return { fileStructure, dependencies }
  }

  async function fetchDefaultBranch(username: string, repoName: string, accessToken: string): Promise<string> {
    const response = await fetch(`https://api.github.com/repos/${username}/${repoName}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })
  
    if (!response.ok) {
      handleApiError(response)
    }
  
    const repoInfo: GitHubRepoResponse = await response.json()
    return repoInfo.default_branch || "main"
  }