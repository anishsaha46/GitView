import { Button } from "@/components/ui/button"
import { Github } from "lucide-react"
import Link from "next/link"

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="border-b">
        <div className="container flex h-16 items-center px-4 sm:px-6 lg:px-8">
          <h1 className="text-lg font-semibold">GitHub Code Visualizer</h1>
        </div>
      </header>
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                  Visualize Your Code Relationships
                </h2>
                <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
                  Login with GitHub, select a repository, and see how your code connects with interactive diagrams.
                </p>
              </div>
              <div className="w-full max-w-sm space-y-2">
                <Link href="/api/auth/signin">
                  <Button className="w-full" size="lg">
                    <Github className="mr-2 h-4 w-4" />
                    Login with GitHub
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32 bg-muted">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-3 lg:gap-12">
              <div className="flex flex-col justify-center space-y-4">
                <div className="inline-block rounded-lg bg-gray-100 px-3 py-1 text-sm dark:bg-gray-800">Step 1</div>
                <h3 className="text-2xl font-bold">Login with GitHub</h3>
                <p className="text-gray-500 dark:text-gray-400">
                  Securely connect your GitHub account to access your repositories.
                </p>
              </div>
              <div className="flex flex-col justify-center space-y-4">
                <div className="inline-block rounded-lg bg-gray-100 px-3 py-1 text-sm dark:bg-gray-800">Step 2</div>
                <h3 className="text-2xl font-bold">Select a Repository</h3>
                <p className="text-gray-500 dark:text-gray-400">
                  Choose any of your repositories to analyze and visualize.
                </p>
              </div>
              <div className="flex flex-col justify-center space-y-4">
                <div className="inline-block rounded-lg bg-gray-100 px-3 py-1 text-sm dark:bg-gray-800">Step 3</div>
                <h3 className="text-2xl font-bold">Explore Relationships</h3>
                <p className="text-gray-500 dark:text-gray-400">
                  View interactive diagrams showing how your code files relate to each other.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <footer className="border-t py-6">
        <div className="container flex flex-col items-center justify-between gap-4 px-4 md:flex-row md:px-6">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            © 2025 GitHub Code Visualizer. All rights reserved.
          </p>
          <div className="flex gap-4">
            <Link href="#" className="text-sm text-gray-500 underline-offset-4 hover:underline dark:text-gray-400">
              Terms
            </Link>
            <Link href="#" className="text-sm text-gray-500 underline-offset-4 hover:underline dark:text-gray-400">
              Privacy
            </Link>
          </div>
        </div>
      </footer>
    </div>
  )
}

