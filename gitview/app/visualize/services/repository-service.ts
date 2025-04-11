import { buildFileTree } from "../utils/file-tree-builder"
import { analyzeDependencies } from "../utils/dependency-analyzer"
import type { FileNode, DependencyData, GitHubTreeResponse, GitHubRepoResponse } from "../types"

export async function fetchRepositoryData(
    username: string,
    repoName: string,
    accessToken: string,
  ): Promise<{ fileStructure: FileNode[]; dependencies: DependencyData }> {
    if (!username || !repoName || !accessToken) {
      throw new Error("Missing required parameters: username, repository name, or access token")
    }

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
        Accept: "application/vnd.github.v3+json",
        Authorization: `Bearer ${accessToken}`,
      },
    })

    if (!response.ok) {
      await handleApiError(response)
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
        Accept: "application/vnd.github.v3+json",
        Authorization: `Bearer ${accessToken}`,
      },
    })

    if (!response.ok) {
      await handleApiError(response)
    }

    const data: GitHubTreeResponse = await response.json()
  
    if (data.truncated) {
      console.warn("Repository is too large, some files may not be shown")
    }
  
    return data
  }


  async function handleApiError(response: Response): Promise<never> {
    const errorData = await response.json().catch(() => ({}));
    
    if (response.status === 404) {
      throw new Error(errorData.message || "Repository or branch not found")
    } else if (response.status === 401) {
      throw new Error(errorData.message || "Invalid or expired access token. Please log in again.")
    } else if (response.status === 403) {
      const rateLimitRemaining = response.headers.get("x-ratelimit-remaining")
      const rateLimitReset = response.headers.get("x-ratelimit-reset")
      
      if (rateLimitRemaining === "0" && rateLimitReset) {
        const resetTime = new Date(parseInt(rateLimitReset) * 1000).toLocaleTimeString()
        throw new Error(`GitHub API rate limit exceeded. Limit will reset at ${resetTime}`)
      }
      throw new Error(errorData.message || "Access forbidden. You may not have permission to view this repository.")
    } else if (response.status === 409) {
      throw new Error(errorData.message || "Repository is empty or has conflicts")
    } else {
      throw new Error(errorData.message || `GitHub API error: ${response.statusText}`)
    }
  }
  