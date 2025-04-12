import React, { Suspense } from 'react'
import VisualizeClient from './visualize-client'
import { Skeleton } from "@/components/ui/skeleton"

export default function VisualizeRepoPage() {
  return (
    <Suspense fallback={
      <div className="flex flex-col min-h-screen items-center justify-center">
        <Skeleton className="h-8 w-64 mb-4" />
        <Skeleton className="h-4 w-48" />
        <Skeleton className="h-[600px] w-full max-w-4xl mt-8" />
      </div>
    }>
      <VisualizeClient />
    </Suspense>
  )
}