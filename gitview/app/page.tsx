"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import Image from "next/image"
import { motion } from "framer-motion"
import { Github, ArrowRight, Code, GitBranch, GitMerge, GitPullRequest, ExternalLink, ChevronDown, LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import CodeVisualDemo from "@/components/code-visual-demo"
import FeatureCard from "@/components/feature-card"
import TestimonialCard from "@/components/testimonial-card"
import { useMobile } from "./hooks/use-mobile"
import { useSession, signOut } from "next-auth/react"


export default function Home() {
  const [scrolled, setScrolled] = useState(false)
  const demoRef = useRef<HTMLDivElement>(null)
  const isMobile = useMobile()
  const { data: session, status } = useSession()

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const scrollToDemo = () => {
    demoRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  return (
    <div className="flex flex-col min-h-screen">
      {/* Sticky Header */}
      <header
        className={cn(
          "fixed top-0 w-full z-50 transition-all duration-300",
          scrolled ? "bg-background/80 backdrop-blur-md border-b" : "bg-transparent",
        )}
      >
        <div className="container flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2">
            <GitBranch className="h-6 w-6 text-primary" />
            <h1 className="text-lg font-bold">GitHub Code Visualizer</h1>
          </div>
          <div className="hidden md:flex items-center gap-6">
            <Link href="#features" className="text-sm font-medium hover:text-primary transition-colors">
              Features
            </Link>
            <Link href="#how-it-works" className="text-sm font-medium hover:text-primary transition-colors">
              How It Works
            </Link>
            <Link href="#testimonials" className="text-sm font-medium hover:text-primary transition-colors">
              Testimonials
            </Link>
          </div>
          {status === "authenticated" ? (
            <div className="flex items-center gap-4">
              <Link href="/dashboard">
                <Button variant="outline">
                  <Github className="mr-2 h-4 w-4" />
                  Dashboard
                </Button>
              </Link>
              <Button variant="destructive" onClick={() => signOut()}>
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </Button>
            </div>
          ) : (
            <Link href="/api/auth/signin" className="inline-block">
              <Button>
                <Github className="mr-2 h-4 w-4" />
                Login with GitHub
              </Button>
            </Link>
          )}
        </div>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative pt-24 md:pt-32 pb-16 md:pb-24 overflow-hidden">
          {/* Background Elements */}
          <div className="absolute inset-0 -z-10 overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-full bg-grid-pattern opacity-[0.03] dark:opacity-[0.05]" />
            <div className="absolute -top-[30%] -left-[10%] w-[50%] h-[80%] rounded-full bg-primary/20 blur-[120px] dark:bg-primary/10" />
            <div className="absolute -bottom-[10%] -right-[10%] w-[50%] h-[80%] rounded-full bg-blue-500/20 blur-[120px] dark:bg-blue-500/10" />
          </div>

          <div className="container px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col items-center text-center space-y-8 md:space-y-12">
              <motion.div
                className="space-y-4 max-w-3xl"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">
                  Visualize Your Code <span className="text-primary">Relationships</span>
                </h1>
                <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                  Discover how your code connects with interactive visualizations. Understand dependencies, explore file
                  structures, and gain insights into your GitHub repositories.
                </p>
              </motion.div>

              <motion.div
                className="flex flex-col sm:flex-row gap-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <Link href="/api/auth/signin">
                  <Button className="h-12 px-8">
                    <Github className="mr-2 h-5 w-5" />
                    Get Started
                  </Button>
                </Link>
                <Button className="h-12 px-8" onClick={scrollToDemo}>
                  See It In Action
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </motion.div>

              <motion.div
                className="w-full max-w-5xl mt-8 relative"
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.4 }}
              >
                <div className="aspect-[16/9] rounded-xl overflow-hidden border shadow-2xl bg-muted">
                  <div className="w-full h-full flex items-center justify-center">
                    <GitBranch className="h-24 w-24 text-muted-foreground/20" />
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
                  <div className="absolute bottom-4 left-0 right-0 flex justify-center">
                    <Button variant="ghost" size="sm" onClick={scrollToDemo}>
                      <ChevronDown className="h-5 w-5 animate-bounce" />
                    </Button>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Interactive Demo Section */}
        <section ref={demoRef} className="py-16 md:py-24 bg-muted/50">
          <div className="container px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col items-center text-center space-y-8">
              <div className="space-y-4 max-w-3xl">
                <h2 className="text-3xl md:text-4xl font-bold tracking-tight">Interactive Code Visualization</h2>
                <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                  See how our tool transforms your code repositories into interactive visual maps
                </p>
              </div>

              <div className="w-full max-w-5xl mt-8 h-[500px] rounded-xl overflow-hidden border bg-background">
                <CodeVisualDemo />
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-16 md:py-24">
          <div className="container px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col items-center text-center space-y-16">
              <div className="space-y-4 max-w-3xl">
                <h2 className="text-3xl md:text-4xl font-bold tracking-tight">Powerful Features</h2>
                <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                  Explore your code in ways you never thought possible
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                <FeatureCard
                  icon={<Code className="h-10 w-10 text-primary" />}
                  title="Dependency Visualization"
                  description="See how your code files connect and depend on each other with interactive graphs"
                />
                <FeatureCard
                  icon={<GitBranch className="h-10 w-10 text-primary" />}
                  title="File Structure Explorer"
                  description="Navigate through your repository structure with an intuitive tree view"
                />
                <FeatureCard
                  icon={<GitMerge className="h-10 w-10 text-primary" />}
                  title="Import Analysis"
                  description="Automatically detect and visualize imports and dependencies across your codebase"
                />
                <FeatureCard
                  icon={<GitPullRequest className="h-10 w-10 text-primary" />}
                  title="Multi-Repository Support"
                  description="Compare and analyze code across multiple repositories"
                />
                <FeatureCard
                  icon={<ExternalLink className="h-10 w-10 text-primary" />}
                  title="Export & Share"
                  description="Export visualizations to share with your team or include in documentation"
                />
                <FeatureCard
                  icon={<Github className="h-10 w-10 text-primary" />}
                  title="GitHub Integration"
                  description="Seamless integration with your GitHub repositories and workflow"
                />
              </div>
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section id="how-it-works" className="py-16 md:py-24 bg-muted/50">
          <div className="container px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col items-center space-y-16">
              <div className="space-y-4 max-w-3xl text-center">
                <h2 className="text-3xl md:text-4xl font-bold tracking-tight">How It Works</h2>
                <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                  Get started in just three simple steps
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-5xl">
                {[
                  {
                    step: "01",
                    title: "Connect with GitHub",
                    description: "Securely connect your GitHub account to access your repositories",
                  },
                  {
                    step: "02",
                    title: "Select a Repository",
                    description: "Choose any repository you want to analyze from your account",
                  },
                  {
                    step: "03",
                    title: "Explore Visualizations",
                    description: "Instantly see your code relationships through interactive diagrams",
                  },
                ].map((item, index) => (
                  <motion.div
                    key={index}
                    className="relative"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    viewport={{ once: true }}
                  >
                    <div className="bg-background rounded-xl p-6 border h-full flex flex-col">
                      <div className="text-4xl font-bold text-primary/20 mb-4">{item.step}</div>
                      <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                      <p className="text-muted-foreground">{item.description}</p>
                    </div>
                    {index < 2 && !isMobile && (
                      <div className="hidden md:block absolute top-1/2 -right-4 transform -translate-y-1/2 z-10">
                        <ArrowRight className="h-6 w-6 text-muted-foreground" />
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>

              <Link href="/api/auth/signin">
                <Button className="h-12 px-8">
                  <Github className="mr-2 h-5 w-5" />
                  Get Started Now
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section id="testimonials" className="py-16 md:py-24">
          <div className="container px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col items-center text-center space-y-16">
              <div className="space-y-4 max-w-3xl">
                <h2 className="text-3xl md:text-4xl font-bold tracking-tight">What Developers Say</h2>
                <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                  Hear from developers who use GitHub Code Visualizer
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <TestimonialCard
                  quote="This tool has completely changed how I understand our codebase. I can now see dependencies I never knew existed."
                  author="Sarah Chen"
                  role="Senior Frontend Developer"
                  avatarUrl="/placeholder.svg?height=100&width=100"
                />
                <TestimonialCard
                  quote="Onboarding new team members is so much easier now. They can visualize the entire project structure in minutes."
                  author="Michael Rodriguez"
                  role="Engineering Manager"
                  avatarUrl="/placeholder.svg?height=100&width=100"
                />
                <TestimonialCard
                  quote="I use this daily to track dependencies and understand the impact of changes across our microservices."
                  author="Aisha Johnson"
                  role="Backend Engineer"
                  avatarUrl="/placeholder.svg?height=100&width=100"
                />
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 md:py-24 bg-primary text-primary-foreground">
          <div className="container px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col items-center text-center space-y-8">
              <motion.div
                className="space-y-4 max-w-3xl"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
              >
                <h2 className="text-3xl md:text-4xl font-bold tracking-tight">Ready to Visualize Your Code?</h2>
                <p className="text-xl opacity-90 max-w-2xl mx-auto">
                  Join thousands of developers who are gaining new insights into their code every day.
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                viewport={{ once: true }}
              >
                <Link href="/api/auth/signin">
                  <Button className="h-12 px-8 text-primary">
                    <Github className="mr-2 h-5 w-5" />
                    Start Visualizing Now
                  </Button>
                </Link>
              </motion.div>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t py-8 bg-muted/30">
        <div className="container flex flex-col md:flex-row items-center justify-between gap-4 px-4 md:px-6">
          <div className="flex items-center gap-2">
            <GitBranch className="h-5 w-5 text-primary" />
            <p className="text-sm font-medium">GitHub Code Visualizer</p>
          </div>
          <p className="text-sm text-muted-foreground">© 2025 GitHub Code Visualizer. All rights reserved.</p>
          <div className="flex gap-4">
            <Link href="#" className="text-sm text-muted-foreground underline-offset-4 hover:underline">
              Terms
            </Link>
            <Link href="#" className="text-sm text-muted-foreground underline-offset-4 hover:underline">
              Privacy
            </Link>
          </div>
        </div>
      </footer>
    </div>
  )
}

