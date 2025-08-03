import { useState } from "react"
import { Button } from "./ui/Button"
import { IconMoon, IconDeviceDesktop, IconSun } from "@tabler/icons-react"

type Theme = "light" | "dark"

export const STORAGE_THEME_KEY = "tax-helper-theme"

export function ThemeToggleButton() {
  const storedTheme = localStorage.getItem(STORAGE_THEME_KEY) as Theme | null

  const [currentTheme, setCurrentTheme] = useState(storedTheme)
  if (storedTheme != currentTheme) {
    setCurrentTheme(storedTheme)
  }

  function handleToggle() {
    if (currentTheme === "light") {
      localStorage.setItem(STORAGE_THEME_KEY, "dark")
      setCurrentTheme("dark")
    } else if (currentTheme === "dark") {
      localStorage.removeItem(STORAGE_THEME_KEY)
      setCurrentTheme(null)
    } else {
      localStorage.setItem(STORAGE_THEME_KEY, "light")
      setCurrentTheme("light")
    }

    toggleThemeClass(currentTheme === "light" || (currentTheme === "dark" && prefersDarkTheme()))
  }

  let NextThemeIcon
  if (currentTheme === "light") {
    NextThemeIcon = IconMoon
  } else if (currentTheme === "dark") {
    NextThemeIcon = IconDeviceDesktop
  } else {
    NextThemeIcon = IconSun
  }

  return (
    <Button variant="secondary" size="icon" className="fixed bottom-2 right-2" onClick={handleToggle}>
      <NextThemeIcon />
    </Button>
  )
}

export function prefersDarkTheme() {
  return window.matchMedia("(prefers-color-scheme: dark)").matches
}

function toggleThemeClass(force?: boolean) {
  document.documentElement.classList.toggle("dark", force)
}
