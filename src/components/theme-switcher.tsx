"use client"

import * as React from "react"
import { useTheme } from "next-themes"
import { Palette } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

const themes = [
    { name: "Default", value: "dark" },
    { name: "Forest", value: "forest" },
    { name: "Cyberpunk", value: "cyberpunk" },
    { name: "Ocean", value: "ocean" },
    { name: "Synthwave", value: "synthwave" },
    { name: "Noir", value: "noir" },
]

export function ThemeSwitcher() {
  const { setTheme } = useTheme()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon">
          <Palette className="h-[1.2rem] w-[1.2rem] transition-all" />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {themes.map((t) => (
            <DropdownMenuItem key={t.value} onClick={() => setTheme(t.value)}>
                {t.name}
            </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
