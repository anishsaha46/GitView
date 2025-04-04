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


  async function fetchRepositoryTree(
    username: string,
    repoName: string,
    branch: string,
    accessToken: string,
  ): Promise<GitHubTreeResponse> {
    const response = await fetch(`https://api.github.com/repos/${username}/${repoName}/git/trees/${branch}?recursive=1`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })
  
    if (!response.ok) {
      handleApiError(response)
    }
  
    const data: GitHubTreeResponse = await response.json()
  
    if (data.truncated) {
      console.warn("Repository is too large, some files may not be shown")
    }
  
    return data
  }


  function handleApiError(response: Response): never {
    if (response.status === 404) {
      throw new Error("Repository or branch not found")
    } else if (response.status === 401) {
      throw new Error("Authentication error. Please log in again.")
    } else if (response.status === 403) {
      const rateLimitRemaining = response.headers.get("x-ratelimit-remaining")
      if (rateLimitRemaining === "0") {
        throw new Error("GitHub API rate limit exceeded. Please try again later.")
      }
      throw new Error("Access forbidden. You may not have permission to view this repository.")
    } else if (response.status === 409) {
      throw new Error("Repository is empty")
    } else {
      throw new Error(`GitHub API error: ${response.statusText}`)
    }
  }
  