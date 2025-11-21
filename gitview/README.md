# GitView - GitHub Repository Visualizer

[![Next.js](https://img.shields.io/badge/Next.js-15.2.4-black)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.0.0-blue)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)](https://www.typescriptlang.org/)
[![D3.js](https://img.shields.io/badge/D3.js-7.9.0-orange)](https://d3js.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.3.3-38B2AC)](https://tailwindcss.com/)
[![Netlify Status](https://api.netlify.com/api/v1/badges/status-badge/deploy-status)](https://gitview-code-visualizer.netlify.app/)

GitView is a powerful web application that helps developers visualize and understand GitHub repositories through interactive code dependency graphs and file structure trees.

🚀 **[Live Demo](https://gitview-code-visualizer.netlify.app/)**

![GitView Screenshot](public/window.svg)

## Features

- **GitHub Authentication**: Securely log in with your GitHub account to access your repositories
- **Repository Visualization**: View your repositories in an intuitive, visual format
- **File Structure Tree**: Navigate through repository files and directories in a hierarchical tree view
- **Code Dependency Graph**: Visualize code dependencies between files using an interactive D3.js graph
- **Export Functionality**: Export visualization data as JSON for offline analysis or sharing
- **Responsive Design**: Works seamlessly on desktop and mobile devices

## Getting Started

### Prerequisites

- Node.js 18.x or higher
- npm or yarn
- GitHub account
- GitHub OAuth App credentials

### Environment Setup

Create a `.env.local` file in the root directory with the following variables:

```
GITHUB_ID=your_github_oauth_app_client_id
GITHUB_SECRET=your_github_oauth_app_client_secret
NEXTAUTH_URL=http://localhost:3000 # Use your Netlify URL in production
NEXTAUTH_SECRET=your_nextauth_secret
```

For production deployment on Netlify, add these environment variables in your Netlify dashboard under Site settings > Environment variables.

### Installation

1. Clone the repository
2. Install dependencies:

```bash
npm install
# or
yarn install
```

3. Run the development server:

```bash
npm run dev
# or
yarn dev
```

4. Open [http://localhost:3000](http://localhost:3000) with your browser to see the application

### Deployment

This project is configured for deployment on Netlify. The deployment configuration is handled through `netlify.toml` in the root directory.

1. Connect your GitHub repository to Netlify
2. Configure the environment variables in Netlify dashboard
3. Deploy using the following build settings:
   - Build command: `npm run build`
   - Publish directory: `.next`

The application will be automatically deployed when you push changes to the main branch.

## Usage

1. **Login**: Click "Login with GitHub" on the homepage to authenticate with your GitHub account
2. **Dashboard**: Browse your repositories on the dashboard page
3. **Visualization**: Select a repository to visualize
4. **Explore**: Switch between the dependency graph and file structure views using the tabs
5. **Export**: Download the visualization data as JSON using the export button

## Architecture

GitView is built with the following technologies:

- **Next.js**: React framework for server-rendered applications
- **TypeScript**: Type-safe JavaScript
- **NextAuth.js**: Authentication solution for Next.js
- **D3.js**: Data visualization library for the dependency graphs
- **Tailwind CSS**: Utility-first CSS framework for styling
- **Prisma**: Database ORM for user data storage
- **GitHub API**: For fetching repository data

### Key Components

- **Repository Service**: Handles GitHub API interactions to fetch repository data
- **File Tree Builder**: Constructs hierarchical file structure from GitHub API data
- **Language Registry**: Central configuration for 17+ programming languages
- **Dependency Analyzer**: Analyzes code files to extract import/export relationships
- **Visualization Components**: Renders interactive file trees and dependency graphs

### Documentation

Comprehensive documentation is available in the `docs/` folder:
- **ARCHITECTURE.md** - Complete system architecture and data flow
- **MULTI_LANGUAGE_SUPPORT.md** - Language support guide and examples
- **REFACTORING_PLAN.md** - Technical refactoring details
- **CHANGES_SUMMARY.md** - Recent changes and improvements

## Supported Languages

GitView now supports **17+ programming languages** for dependency visualization:

### Tier 1 (Fully Supported)
- **JavaScript/TypeScript** - `.js`, `.jsx`, `.ts`, `.tsx`, `.mjs`, `.cjs`, `.mts`, `.cts`
- **Python** - `.py`, `.pyw`, `.pyi`
- **Java** - `.java`
- **Go** - `.go`
- **Rust** - `.rs`
- **C/C++** - `.c`, `.h`, `.cpp`, `.cc`, `.cxx`, `.hpp`, `.hh`, `.hxx`
- **C#** - `.cs`

### Tier 2 (Supported)
- **Ruby** - `.rb`, `.rake`, `.gemspec`
- **PHP** - `.php`, `.phtml`
- **Kotlin** - `.kt`, `.kts`
- **Swift** - `.swift`
- **Scala** - `.scala`, `.sc`

### Tier 3 (Supported)
- **Dart** - `.dart`
- **Elixir** - `.ex`, `.exs`
- **Haskell** - `.hs`, `.lhs`

## Limitations

- GitHub API rate limits may affect large repositories
- Repository analysis is capped at 30 files to avoid rate limiting
- Import detection uses regex patterns (not AST-based)
- External package dependencies are not tracked

## Future Enhancements

- AST-based parsing for more accurate dependency detection
- Increase file analysis limit for smaller repositories
- Advanced code analysis features (complexity, code smells)
- Collaborative sharing of visualizations
- Integration with CI/CD pipelines
- Historical analysis of repository evolution
- Support for monorepo structures
- Circular dependency detection

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgements

- [Next.js](https://nextjs.org/) for the React framework
- [D3.js](https://d3js.org/) for visualization capabilities
- [GitHub API](https://docs.github.com/en/rest) for repository data access
- [Tailwind CSS](https://tailwindcss.com/) for styling
- [Lucide React](https://lucide.dev/) for icons
