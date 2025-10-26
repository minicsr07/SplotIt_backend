"use client"

import { useLanguage } from "@/hooks/use-language"
import { Button } from "@/components/ui/button"
import { languages } from "@/lib/i18n"
import { useState } from "react"

export default function LanguageSwitcher() {
  const { language, changeLanguage } = useLanguage()
  const [open, setOpen] = useState(false)

  return (
    <div className="relative">
      <Button variant="ghost" size="sm" onClick={() => setOpen(!open)} className="flex items-center gap-2">
        <span>🌐</span>
        <span className="hidden sm:inline">{languages[language as keyof typeof languages]}</span>
      </Button>

      {open && (
        <div className="absolute right-0 mt-2 w-48 bg-background border border-border rounded-lg shadow-lg z-50">
          {Object.entries(languages).map(([code, name]) => (
            <button
              key={code}
              onClick={() => {
                changeLanguage(code)
                setOpen(false)
              }}
              className={`w-full text-left px-4 py-2 hover:bg-muted transition ${
                language === code ? "bg-primary/10 text-primary font-semibold" : "text-foreground"
              }`}
            >
              {name}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
