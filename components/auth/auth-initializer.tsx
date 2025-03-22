"use client"

import { useEffect } from "react"
import { initApi } from "@/lib/api"

export function AuthInitializer() {
  useEffect(() => {
    // Initialize API on client-side only
    initApi()
  }, [])

  return null // This component doesn't render anything
}

