"use client"

import { useState } from "react"
import { Plus, X, MapPin, Tag, FileText, Sparkles } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

import { Button } from "@/app/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/app/components/ui/card"
import { Input } from "@/app/components/ui/input"
import { Label } from "@/app/components/ui/label"
import { Textarea } from "@/app/components/ui/textarea"
import { Problem } from "@/lib/data"
import { cn } from "@/lib/utils"

interface SubmitProblemFormProps {
  onSubmit: (problem: Omit<Problem, "id" | "upvotes" | "createdAt">) => void
}

const categories = [
  { value: "infrastructure", label: "Infrastructure", icon: "🛠️", color: "border-blue-500/50 bg-blue-500/10 hover:bg-blue-500/20" },
  { value: "sanitation", label: "Sanitation", icon: "🗑️", color: "border-green-500/50 bg-green-500/10 hover:bg-green-500/20" },
  { value: "safety", label: "Safety", icon: "⚠️", color: "border-red-500/50 bg-red-500/10 hover:bg-red-500/20" },
  { value: "other", label: "Other", icon: "📌", color: "border-slate-500/50 bg-slate-500/10 hover:bg-slate-500/20" },
] as const

export function SubmitProblemForm({ onSubmit }: SubmitProblemFormProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [address, setAddress] = useState("")
  const [category, setCategory] = useState<Problem["category"]>("other")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit({
      title,
      description,
      location: {
        lat: 40.7128 + (Math.random() - 0.5) * 0.02,
        lng: -74.006 + (Math.random() - 0.5) * 0.02,
        address,
      },
      category,
    })
    setIsOpen(false)
    setTitle("")
    setDescription("")
    setAddress("")
    setCategory("other")
  }

  return (
    <AnimatePresence mode="wait">
      {!isOpen ? (
        <motion.div
          key="button"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
        >
          <Button
            className="w-full h-14 text-base shadow-xl glow"
            onClick={() => setIsOpen(true)}
          >
            <Plus className="mr-2 h-5 w-5" />
            Report a Problem
            <Sparkles className="ml-2 h-4 w-4 opacity-70" />
          </Button>
        </motion.div>
      ) : (
        <motion.div
          key="form"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
        >
          <Card className="border-indigo-500/30 shadow-2xl shadow-indigo-500/10">
            <CardHeader className="relative">
              <button
                onClick={() => setIsOpen(false)}
                className="absolute right-4 top-4 p-2 rounded-lg hover:bg-slate-700/50 transition-colors"
              >
                <X className="w-5 h-5 text-slate-400" />
              </button>
              <CardTitle className="flex items-center gap-2">
                <div className="p-2 bg-indigo-500/20 rounded-lg">
                  <FileText className="w-5 h-5 text-indigo-400" />
                </div>
                Report a Problem
              </CardTitle>
              <CardDescription>
                Help us identify and prioritize issues in your community.
              </CardDescription>
            </CardHeader>
            <form onSubmit={handleSubmit}>
              <CardContent className="space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="title">Problem Title</Label>
                  <Input
                    id="title"
                    placeholder="e.g., Broken Street Light on Main St"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-3">
                  <Label>Category</Label>
                  <div className="grid grid-cols-2 gap-2">
                    {categories.map((cat) => (
                      <button
                        key={cat.value}
                        type="button"
                        onClick={() => setCategory(cat.value)}
                        className={cn(
                          "flex items-center gap-2 p-3 rounded-xl border-2 transition-all duration-200",
                          category === cat.value
                            ? cn(cat.color, "border-opacity-100 ring-2 ring-offset-2 ring-offset-slate-900", 
                                cat.value === "infrastructure" && "ring-blue-500",
                                cat.value === "sanitation" && "ring-green-500",
                                cat.value === "safety" && "ring-red-500",
                                cat.value === "other" && "ring-slate-500"
                              )
                            : "border-slate-700 bg-slate-800/30 hover:border-slate-600"
                        )}
                      >
                        <span className="text-lg">{cat.icon}</span>
                        <span className={cn(
                          "text-sm font-medium",
                          category === cat.value ? "text-white" : "text-slate-400"
                        )}>
                          {cat.label}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address" className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-slate-500" />
                    Location / Address
                  </Label>
                  <Input
                    id="address"
                    placeholder="e.g., 123 Main St & 5th Ave"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    placeholder="Describe the issue in detail. What's wrong? How long has it been like this?"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={4}
                    required
                  />
                </div>
              </CardContent>
              <CardFooter className="flex justify-end gap-3 pt-2">
                <Button type="button" variant="ghost" onClick={() => setIsOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">
                  Submit Report
                </Button>
              </CardFooter>
            </form>
          </Card>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
