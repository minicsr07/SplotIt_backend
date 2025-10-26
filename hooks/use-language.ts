"use client"

import { useState, useEffect } from "react"

export function useLanguage() {
  const [language, setLanguage] = useState("en")

  useEffect(() => {
    const saved = localStorage.getItem("language") || "en"
    setLanguage(saved)
  }, [])

  const changeLanguage = (lang: string) => {
    setLanguage(lang)
    localStorage.setItem("language", lang)
  }

  return { language, changeLanguage }
}
