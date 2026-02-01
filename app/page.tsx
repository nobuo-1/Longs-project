import { Suspense } from "react"
import { HomeClient } from "@/components/home-client"

export default function Home() {
  return (
    <Suspense fallback={<div className="flex h-screen bg-background" />}>
      <HomeClient />
    </Suspense>
  )
}
