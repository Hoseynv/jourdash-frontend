"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Sun, Moon } from "lucide-react"
import { t } from "@/lib/translations"

export function ThemeToggle() {
  const [isDark, setIsDark] = useState(false)

  useEffect(() => {
    // Check for saved theme preference or default to light
    const savedTheme = localStorage.getItem("theme")
    const prefersDark = savedTheme === "dark"
    setIsDark(prefersDark)

    if (prefersDark) {
      document.documentElement.classList.add("dark")
    } else {
      document.documentElement.classList.remove("dark")
    }
  }, [])

  const toggleTheme = () => {
    const newTheme = !isDark
    setIsDark(newTheme)

    if (newTheme) {
      document.documentElement.classList.add("dark")
      localStorage.setItem("theme", "dark")
    } else {
      document.documentElement.classList.remove("dark")
      localStorage.setItem("theme", "light")
    }
  }

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={toggleTheme}
      className="gap-2"
      title={isDark ? t("lightMode") : t("darkMode")}
      aria-label={t("toggleTheme")}
    >
      {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
      <span className="sr-only">{isDark ? t("lightMode") : t("darkMode")}</span>
    </Button>
  )
}
