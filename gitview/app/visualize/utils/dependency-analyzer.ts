import { resolveRelativePath } from "./path-resolver";
import type { DependencyData,DependencyNode,DependencyLink,GitHubTreeItem,GitHubContentResponse } from "../types";

export const function analyzeDependencies(
    username:string,
    repoName:string,
    branch:string,
    treeItems: GitHubTreeItem[],
    accessToken:string,
):Promise<DependencyData> {
    // Filter code files
    const codeFiles = treeItems.filter((item)=>{
        const ext = item.path.split('.').pop()?.toLowerCase();
        return(
            item.type === "blob" &&
            ["js", "jsx", "ts", "tsx", "py", "java", "go", "rb", "php", "c", "cpp", "cs"].includes(ext || "")
        )
    })
    // Limit files to analyze to avoid rate Limits
    const MAX_FILES_TO_ANALYZE = 30
    const filesToAnalyze = codeFiles.slice(0, MAX_FILES_TO_ANALYZE)

    const nodes: DependencyNode[] = []
    const links: DependencyLink[] = []
    const importMap = new Map<string, string[]>()

    


}