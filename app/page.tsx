import { redirect } from "next/navigation"
import { APP_ROUTES } from "@/lib/constants"

export default function Home() {
  // Redirect to dashboard by default
  redirect(APP_ROUTES.DASHBOARD)
}

