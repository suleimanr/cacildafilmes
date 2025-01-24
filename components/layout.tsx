"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Footer from "./footer"
import Cursor from "./cursor"
import { LoadingScreen } from "./loading-screen"
import Header from "./Header"

interface LayoutProps {
  children: React.ReactNode
}

export default function Layout({ children }: LayoutProps) {
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false)
    }, 2000) // Simulating load time
  }, [])

  return (
    <div className="min-h-screen bg-black text-white">
      <AnimatePresence>
        {isLoading ? (
          <LoadingScreen key="loading" />
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Cursor />
            <Header />
            <main className="pt-28">{children}</main>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

