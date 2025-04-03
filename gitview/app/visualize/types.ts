export interface FileNode{
    path: string;
    type: "file"|"dir"
    children?: FileNode[];
    content?: string;
    imports?: string[];
}