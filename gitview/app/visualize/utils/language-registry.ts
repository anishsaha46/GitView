/**
 * Language Registry - Central configuration for all supported programming languages
 * Defines import patterns, file extensions, and resolution logic for each language
 */

export interface LanguageConfig {
  name: string
  extensions: string[]
  color: string
  importPatterns: {
    pattern: RegExp
    captureGroup: number // Which capture group contains the import path
  }[]
  moduleExtensions?: string[] // File extensions to try when resolving imports
  indexFiles?: string[] // Index file names to try (e.g., index.js, __init__.py)
  resolveImport?: (importPath: string, currentFile: string, allFiles: string[]) => string | null
}

// Language configurations
const LANGUAGES: Record<string, LanguageConfig> = {
  // JavaScript/TypeScript
  javascript: {
    name: "JavaScript",
    extensions: ["js", "jsx", "mjs", "cjs"],
    color: "#f7df1e",
    importPatterns: [
      // ES6 imports: import X from 'module'
      { pattern: /import\s+(?:(?:{[^}]*}|\*\s+as\s+\w+|\w+)\s+from\s+)?['"]([^'"]+)['"]/g, captureGroup: 1 },
      // CommonJS: require('module')
      { pattern: /require\s*\(\s*['"]([^'"]+)['"]\s*\)/g, captureGroup: 1 },
      // Dynamic imports: import('module')
      { pattern: /import\s*\(\s*['"]([^'"]+)['"]\s*\)/g, captureGroup: 1 },
    ],
    moduleExtensions: [".js", ".jsx", ".mjs", ".cjs", ".json"],
    indexFiles: ["index.js", "index.jsx", "index.mjs"],
  },

  typescript: {
    name: "TypeScript",
    extensions: ["ts", "tsx", "mts", "cts"],
    color: "#3178c6",
    importPatterns: [
      // ES6 imports
      { pattern: /import\s+(?:(?:{[^}]*}|\*\s+as\s+\w+|\w+)\s+from\s+)?['"]([^'"]+)['"]/g, captureGroup: 1 },
      // CommonJS
      { pattern: /require\s*\(\s*['"]([^'"]+)['"]\s*\)/g, captureGroup: 1 },
      // Dynamic imports
      { pattern: /import\s*\(\s*['"]([^'"]+)['"]\s*\)/g, captureGroup: 1 },
      // Type imports
      { pattern: /import\s+type\s+(?:{[^}]*}|\w+)\s+from\s+['"]([^'"]+)['"]/g, captureGroup: 1 },
    ],
    moduleExtensions: [".ts", ".tsx", ".mts", ".cts", ".js", ".jsx", ".json", ".d.ts"],
    indexFiles: ["index.ts", "index.tsx", "index.mts", "index.js"],
  },

  // Python
  python: {
    name: "Python",
    extensions: ["py", "pyw", "pyi"],
    color: "#3776ab",
    importPatterns: [
      // from X import Y
      { pattern: /from\s+([^\s]+)\s+import/g, captureGroup: 1 },
      // import X
      { pattern: /^import\s+([^\s]+)/gm, captureGroup: 1 },
      // import X as Y
      { pattern: /^import\s+([^\s]+)\s+as/gm, captureGroup: 1 },
    ],
    moduleExtensions: [".py", ".pyi"],
    indexFiles: ["__init__.py"],
  },

  // Java
  java: {
    name: "Java",
    extensions: ["java"],
    color: "#b07219",
    importPatterns: [
      // import package.Class;
      { pattern: /import\s+(?:static\s+)?([^;]+);/g, captureGroup: 1 },
    ],
    moduleExtensions: [".java"],
  },

  // Go
  go: {
    name: "Go",
    extensions: ["go"],
    color: "#00add8",
    importPatterns: [
      // import "package"
      { pattern: /import\s+"([^"]+)"/g, captureGroup: 1 },
      // import ( "package1" "package2" )
      { pattern: /import\s+\([^)]*"([^"]+)"/g, captureGroup: 1 },
    ],
    moduleExtensions: [".go"],
  },

  // Rust
  rust: {
    name: "Rust",
    extensions: ["rs"],
    color: "#dea584",
    importPatterns: [
      // use crate::module;
      { pattern: /use\s+crate::([^;]+);/g, captureGroup: 1 },
      // use super::module;
      { pattern: /use\s+super::([^;]+);/g, captureGroup: 1 },
      // use self::module;
      { pattern: /use\s+self::([^;]+);/g, captureGroup: 1 },
      // mod module_name;
      { pattern: /mod\s+([^;]+);/g, captureGroup: 1 },
      // use external_crate::module;
      { pattern: /use\s+([a-zA-Z_][a-zA-Z0-9_]*)::/g, captureGroup: 1 },
    ],
    moduleExtensions: [".rs"],
    indexFiles: ["mod.rs", "lib.rs"],
  },

  // C/C++
  c: {
    name: "C",
    extensions: ["c", "h"],
    color: "#555555",
    importPatterns: [
      // #include "file.h"
      { pattern: /#include\s+"([^"]+)"/g, captureGroup: 1 },
      // #include <file.h>
      { pattern: /#include\s+<([^>]+)>/g, captureGroup: 1 },
    ],
    moduleExtensions: [".h", ".c"],
  },

  cpp: {
    name: "C++",
    extensions: ["cpp", "cc", "cxx", "hpp", "hh", "hxx"],
    color: "#f34b7d",
    importPatterns: [
      // #include "file.hpp"
      { pattern: /#include\s+"([^"]+)"/g, captureGroup: 1 },
      // #include <file>
      { pattern: /#include\s+<([^>]+)>/g, captureGroup: 1 },
    ],
    moduleExtensions: [".hpp", ".hh", ".hxx", ".h", ".cpp", ".cc", ".cxx"],
  },

  // C#
  csharp: {
    name: "C#",
    extensions: ["cs"],
    color: "#178600",
    importPatterns: [
      // using System.Collections;
      { pattern: /using\s+([^;]+);/g, captureGroup: 1 },
    ],
    moduleExtensions: [".cs"],
  },

  // Ruby
  ruby: {
    name: "Ruby",
    extensions: ["rb", "rake", "gemspec"],
    color: "#cc342d",
    importPatterns: [
      // require 'gem'
      { pattern: /require\s+['"]([^'"]+)['"]/g, captureGroup: 1 },
      // require_relative '../file'
      { pattern: /require_relative\s+['"]([^'"]+)['"]/g, captureGroup: 1 },
      // load 'file.rb'
      { pattern: /load\s+['"]([^'"]+)['"]/g, captureGroup: 1 },
    ],
    moduleExtensions: [".rb"],
  },

  // PHP
  php: {
    name: "PHP",
    extensions: ["php", "phtml"],
    color: "#4f5d95",
    importPatterns: [
      // require 'file.php';
      { pattern: /require\s+['"]([^'"]+)['"]/g, captureGroup: 1 },
      // require_once 'file.php';
      { pattern: /require_once\s+['"]([^'"]+)['"]/g, captureGroup: 1 },
      // include 'file.php';
      { pattern: /include\s+['"]([^'"]+)['"]/g, captureGroup: 1 },
      // include_once 'file.php';
      { pattern: /include_once\s+['"]([^'"]+)['"]/g, captureGroup: 1 },
      // use Namespace\Class;
      { pattern: /use\s+([^;]+);/g, captureGroup: 1 },
    ],
    moduleExtensions: [".php"],
  },

  // Kotlin
  kotlin: {
    name: "Kotlin",
    extensions: ["kt", "kts"],
    color: "#a97bff",
    importPatterns: [
      // import package.Class
      { pattern: /import\s+([^\s]+)/g, captureGroup: 1 },
    ],
    moduleExtensions: [".kt", ".kts"],
  },

  // Swift
  swift: {
    name: "Swift",
    extensions: ["swift"],
    color: "#ffac45",
    importPatterns: [
      // import Module
      { pattern: /import\s+(?:class|struct|enum|protocol|typealias|func|let|var)?\s*([^\s]+)/g, captureGroup: 1 },
    ],
    moduleExtensions: [".swift"],
  },

  // Scala
  scala: {
    name: "Scala",
    extensions: ["scala", "sc"],
    color: "#c22d40",
    importPatterns: [
      // import package.Class
      { pattern: /import\s+([^\s]+)/g, captureGroup: 1 },
    ],
    moduleExtensions: [".scala"],
  },

  // Dart
  dart: {
    name: "Dart",
    extensions: ["dart"],
    color: "#00b4ab",
    importPatterns: [
      // import 'package:name/file.dart';
      { pattern: /import\s+['"]([^'"]+)['"]/g, captureGroup: 1 },
      // export 'file.dart';
      { pattern: /export\s+['"]([^'"]+)['"]/g, captureGroup: 1 },
    ],
    moduleExtensions: [".dart"],
  },

  // Elixir
  elixir: {
    name: "Elixir",
    extensions: ["ex", "exs"],
    color: "#6e4a7e",
    importPatterns: [
      // import Module
      { pattern: /import\s+([^\s]+)/g, captureGroup: 1 },
      // alias Module
      { pattern: /alias\s+([^\s]+)/g, captureGroup: 1 },
      // require Module
      { pattern: /require\s+([^\s]+)/g, captureGroup: 1 },
    ],
    moduleExtensions: [".ex", ".exs"],
  },

  // Haskell
  haskell: {
    name: "Haskell",
    extensions: ["hs", "lhs"],
    color: "#5e5086",
    importPatterns: [
      // import Module
      { pattern: /import\s+(?:qualified\s+)?([^\s(]+)/g, captureGroup: 1 },
    ],
    moduleExtensions: [".hs", ".lhs"],
  },
}

// Build extension to language map for quick lookup
const extensionToLanguage: Map<string, LanguageConfig> = new Map()
Object.values(LANGUAGES).forEach((lang) => {
  lang.extensions.forEach((ext) => {
    extensionToLanguage.set(ext, lang)
  })
})

/**
 * Get language configuration by file extension
 */
export function getLanguageByExtension(extension: string): LanguageConfig | null {
  return extensionToLanguage.get(extension.toLowerCase()) || null
}

/**
 * Get language configuration by file path
 */
export function getLanguageByPath(filePath: string): LanguageConfig | null {
  const ext = filePath.split(".").pop()?.toLowerCase()
  return ext ? getLanguageByExtension(ext) : null
}

/**
 * Get all supported file extensions
 */
export function getSupportedExtensions(): string[] {
  return Array.from(extensionToLanguage.keys())
}

/**
 * Check if a file extension is supported
 */
export function isSupported(extension: string): boolean {
  return extensionToLanguage.has(extension.toLowerCase())
}

/**
 * Get all language configurations
 */
export function getAllLanguages(): LanguageConfig[] {
  return Object.values(LANGUAGES)
}

/**
 * Get color for a file type (for visualization)
 */
export function getColorForExtension(extension: string): string {
  const lang = getLanguageByExtension(extension)
  return lang?.color || "#999999"
}
