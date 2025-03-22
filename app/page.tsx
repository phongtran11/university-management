import { redirect } from "next/navigation"

export default function Home() {
  // Redirect to dashboard by default
  // In a real app, you would check authentication status here
  redirect("/login")
}

