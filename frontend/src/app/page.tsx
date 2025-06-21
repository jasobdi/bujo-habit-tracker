// LANDING PAGE
import { Logo } from "../components/ui/logo/logo"
import { BaseButton } from "@/components/ui/button/base-button/base-button"
import Link from "next/link"
import { cn } from "@/lib/utils"

export default function LandingPage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-between bg-primary px-4 py-6">
      {/* Logo & Titel */}
      <div className="flex flex-col items-center mt-10">
        <Logo className="w-[200px] h-[200px]" />
        <h1 className="text-3xl mt-6 font-hand text-center">Bullet Journal & Habit Tracker</h1>
      </div>

      {/* Start Button & Link */}
      <div className="flex flex-col items-center mt-10 mb-10 gap-4">
        <BaseButton variant="start" className={cn("h-15 w-[265px] py-4 border-[2px] border-border rounded-radius-btn text-lg font-normal bg-secondary font-sans")}>
          <Link href="/public/login">Start now</Link>
        </BaseButton>
        <p className="text-xs text-foreground underline font-sans mt-8">
          <Link href="/public/register">Register</Link>
        </p>
      </div>

      {/* Footer */}
      <footer className="w-full text-xs font-sans flex flex-col items-center gap-1 pt-4 pb-2
        md:flex-row md:justify-evenly md:gap-0">
        <div className="flex flex-col items-center md:flex-row md:gap-8">
          <Link href="/impressum">Impressum</Link>
          <Link href="/privacy">Privacy policy</Link>
        </div>
          <p className="mt-1 md:mt-0">&copy; 2025 Bullet Journal</p>
        
      </footer>
    </main>
  )
}

